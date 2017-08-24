
'use strict';

// Modules
var mysql = require('../middleware/mysql_control');
var uuidV1 = require('uuid/v1');

function get_comments(config, raneto) {
    return function (req, res, next) {

        var keyword_list = req.url.split('/').filter(function(el){return el != 0;});
        if(keyword_list.length == 1) {
            generateCommentKey( function(id) {
                res.header('Content-Type', 'text/plain');
                res.send('<comment id=' + id + ' />');
            });
            
        } 
        else if(keyword_list.length == 2) {
            mysql.getComments(keyword_list[1], function(result) {
                res.header('Content-Type', 'application/json');
                res.send(result);
            })
        }
        else {
            next();
        }

    };
}

function generateCommentKey(resultNotify) {
    var idGenerator = function() {
        var id = uuidV1();
        mysql.checkCommentKeyExist(id, function(result) {
            if(result) return idGenerator();
            else return resultNotify(id);
        });
    }
    idGenerator();
}

// Exports
module.exports = get_comments;
