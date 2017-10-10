
'use strict';

var mysql  = require('mysql');
var sql_pool;
var sql_config;

function connectCommentSql(config, resultNotify) {
    sql_pool = mysql.createPool({    
        host     : config.db_host,       //主机
        user     : config.db_user,       //MySQL认证用户名
        password : config.db_pass,
        port     : config.db_port,
        database : config.db_name,
        connectionLimit: 100
    });
    sql_config = config;

    sql_pool.getConnection(function(err, connection) {
        if(err) throw err;
        var createCommentDatabase = function() {
            connection.query('CREATE DATABASE IF NOT EXISTS ' + sql_config.db_comment_name + ';',
                function (error, results, fields) {
                    if(error) throw error;
                    connection.query('USE ' + sql_config.db_comment_name + ';', function (error, results, fields) {
                        if(error) throw error;
                        createCommentTable();
                    });
                });
        }
        var createCommentTable = function() {
            connection.query("CREATE TABLE IF NOT EXISTS " + sql_config.table_comment_name + " ( \
                    floor INT(11) NOT NULL, \
                    commentkey VARCHAR(100) NOT NULL, \
                    username VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL, \
                    time DATETIME NOT NULL, \
                    content TEXT, \
                    project VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_general_ci, \
                    primary key (floor,commentkey) );" ,
                function (error, results, fields) {
                    if(error) throw error;
                    createWatchTable();
                });
        }
        var createWatchTable = function() {
            connection.query("CREATE TABLE IF NOT EXISTS " + sql_config.table_articlewatch_name + " ( \
                    commentkey VARCHAR(100) NOT NULL, \
                    username VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL, \
                    primary key (username,commentkey) );" ,
                function (error, results, fields) {
                    if(error) throw error;
                    return resultNotify?resultNotify(true):true;
                });
        }
        createCommentDatabase();
        connection.release();
    });
}

function checkCommentKeyExist(key, resultNotify) {
    sql_pool.getConnection(function(err, connection) {
        if(err) throw err;
        connection.query("SELECT COUNT(*) AS result FROM ??.?? WHERE commentkey = ?", 
            [sql_config.db_comment_name, sql_config.table_comment_name, key],
            function (error, results, fields) {
                if(error) throw error;
                if(results[0]["result"] > 0) return resultNotify(true);
                else return resultNotify(false);
            });
        connection.release();
    });
}

function insertComment(key, username, content, project, resultNotify) {
    if(!key || !username || (!content && !project)) return resultNotify(false);
    sql_pool.getConnection(function(err, connection) {
        if(err) throw err;

        var columns = "commentkey";
        var values = "'" + key.toString() + "'";
        if(project) {
            columns += ",project";
            values += ",'" + project.toString() + "'";
        }
        if(content) {
            columns += ",content";
            values += ",'" + content.toString() + "'";
        }
        connection.query("INSERT INTO ??.??("+columns+",username,time,floor) SELECT "+values+",a.username,NOW(),IFNULL(MAX(c.floor)+1,1) FROM ??.?? AS c,??.?? AS a WHERE c.commentkey=? AND a.username=?",
            [sql_config.db_comment_name, sql_config.table_comment_name, sql_config.db_comment_name, sql_config.table_comment_name, sql_config.db_account_name, sql_config.table_account_name, key, username],
            function (error, results, fields) {
                if(error) resultNotify(false);
                return resultNotify(true);
            });
        connection.release();
    });
}

function updateComment(key, username, floor, content, project, resultNotify) {
    if(!key || !floor || !username || (project == null && content == null)) return resultNotify(false);
    sql_pool.getConnection(function(err, connection) {
        if(err) throw err;
        var sql_content = "";
        if(sql_content != "") sql_content += ","
        sql_content += "content='" + content + "'";
        if(sql_content != "") sql_content += ","
        sql_content += "project='" + project + "'";
        if(sql_content == "") return resultNotify(false);
        connection.query("UPDATE ??.?? SET " + sql_content + " WHERE commentkey=? AND floor=? AND username=?;",
            [sql_config.db_comment_name, sql_config.table_comment_name, key, floor, username],
            function (error, results, fields) {
                if(error) throw error;
                return resultNotify(true);
            });
        connection.release();
    });
}

function getComments(key,resultNotify) {
    if(!key) resultNotify(null);
    sql_pool.getConnection(function(err, connection) {
        if(err) throw err;
        // TODO: 增加按照Floor排序
        connection.query("SELECT floor,username AS name,time,content AS data,project FROM ??.?? WHERE commentkey=?;",
            [sql_config.db_comment_name, sql_config.table_comment_name, key],
            function (error, results, fields) {
                if(error) throw error;
                return resultNotify(results);
            });
        connection.release();
    });
}

function deleteComment(key, floor, resultNotify) {
    if(!key || !floor) resultNotify(false);
    sql_pool.getConnection(function(err, connection) {
        if(err) throw err;
        connection.query("DELETE FROM ??.?? WHERE commentkey=? AND floor=?;",
            [sql_config.db_comment_name, sql_config.table_comment_name, key, floor],
            function (error, results, fields) {
                if(error) throw error;
                return resultNotify(true);
            });
        connection.release();
    });
}

function getAccounts(resultNotify) {
    sql_pool.getConnection(function(err, connection) {
        if(err) throw err;
        connection.query("SELECT username FROM ??.??;",
            [sql_config.db_account_name, sql_config.table_account_name],
            function (error, results, fields) {
                if(error) throw error;
                return resultNotify(results);
            });
        connection.release();
    });
}

function changeWatchStatus(key, user, isChange, resultNotify) {
    sql_pool.getConnection(function(err, connection) {
        if(err) throw err;
        connection.query("SELECT COUNT(*) AS result FROM ??.?? WHERE commentkey = ? AND username = ?;",
            [sql_config.db_comment_name, sql_config.table_articlewatch_name, key, user],
            function (error, results, fields) {
                if(error) throw error;
                var isExist = Boolean(results[0]["result"]);
                if(!isChange) return resultNotify(isExist);
                if(isExist) {
                    connection.query("DELETE FROM ??.?? WHERE commentkey=? AND username=?;",
                        [sql_config.db_comment_name, sql_config.table_articlewatch_name, key, user],
                        function (error, results, fields) {
                            if(error) throw error;
                            return resultNotify(false);
                        });
                } 
                else {
                    connection.query("INSERT INTO ??.??(commentkey,username) VALUES (?, ?)",
                        [sql_config.db_comment_name, sql_config.table_articlewatch_name, key, user],
                        function (error, results, fields) {
                            if(error) throw error;
                            return resultNotify(true);
                        });
                }
            });
        connection.release();
    });
}

function getWatchMail(key, resultNotify) {
    sql_pool.getConnection(function(err, connection) {
        if(err) throw err;
        connection.query("SELECT b.email AS result FROM ??.?? AS a, ??.?? AS b WHERE a.commentkey = ? AND a.username = b.username",
        [sql_config.db_comment_name, sql_config.table_articlewatch_name, sql_config.db_account_name, sql_config.table_account_name, key],
        function (error, results, fields) {
            if(error) throw error;
            return resultNotify(results.map(function(x){return x["result"];}));
        });
    });
}

function getUsersMail(users, resultNotify) {
    sql_pool.getConnection(function(err, connection) {
        if(err) throw err;
        connection.query("SELECT email AS result FROM ??.?? WHERE username in ??",
        [sql_config.db_account_name, sql_config.table_account_name, users],
        function (error, results, fields) {
            if(error) throw error;
            return resultNotify(results.map(function(x){return x["result"];}));
        });
    });
}

function getCommentMail(users, key, resultNotify) {
    sql_pool.getConnection(function(err, connection) {
        if(err) throw err;
        connection.query("SELECT DISTINCT b.email AS result FROM ??.?? AS a, ??.?? AS b WHERE (b.username in (?)) OR (a.commentkey = ? AND a.username = b.username)",
        [sql_config.db_comment_name, sql_config.table_articlewatch_name, sql_config.db_account_name, sql_config.table_account_name, users.toString(), key],
        function (error, results, fields) {
            if(error) throw error;
            return resultNotify(results.map(function(x){return x["result"];}));
        });
    });
}


// Exports
module.exports = {
    connectCommentSql: connectCommentSql,
    checkCommentKeyExist: checkCommentKeyExist,
    insertComment: insertComment,
    updateComment: updateComment,
    getComments: getComments,
    deleteComment: deleteComment,
    getAccounts: getAccounts,
    changeWatchStatus: changeWatchStatus,
    getWatchMail: getWatchMail,
    getUsersMail: getUsersMail,
    getCommentMail: getCommentMail
};