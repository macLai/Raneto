
'use strict';

var mysql = require('../middleware/mysql_control');
var fs = require('fs');

function git_update(config, raneto) {
    return function (req, res, next) {
        var mail = require("nodemailer").createTransport('smtps://' + config.mail_address + ':' + config.mail_password + '@' + config.mail_server + '/?pool=true');


        var git = require('simple-git')(config.content_dir);

        git.pull();
        git.show('--pretty=format:%H --name-only', function(err, result) {
            if(err) return;
            var datas = result.split('\n');
            var sha1 = datas[0];
            datas.forEach(function(path) {
                if(!path.endsWith('.md')) return;

                fs.readFile(config.content_dir + path, 'utf8', function (error, content) {
                    try{
                        var key = /<comment\s+id=\"([a-z|0-9]+-[a-z|0-9]+-[a-z|0-9]+-[a-z|0-9]+-[a-z|0-9]+)\"\s+\/>/.exec(content)[1];
                    }
                    catch(err) {
                        console.log(err);
                        return;
                    }
                    mysql.getWatchMail(key, function(mails) {
                        var html = '"/' + path.slice(0, -3) + '" に更新があります。<br /><a href="'+ config.base_url + "/" + path.slice(0, -3) + '">最新版</a>と<a href="' + config.git_path + '/commit/' + sha1 + '">差分</a>をご確認ください。'
                        
                        mail.sendMail({
                            from: config.mail_address, // 发件地址
                            to: mails, // 收件列表
                            subject: "wiki article update", // 标题
                            html: html // html 内容
                        },
                        function(error, response){
                            if(error){
                                console.log(error);
                            }
                        });
                    });
                });
            });
            
        });
        smtpTransport.close();

        res.header('Content-Type', 'text/html');
        return res.send('ok');
    }
}

// Exports
module.exports = git_update;