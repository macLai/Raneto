
'use strict';

// Modules
var mysql = require('../middleware/mysql_control');

function route_comment_post (config, raneto) {
    return function (req, res, next) {

        var key = req.url.split('/').filter(function(el){return el != 0;})[1];
        var action = "";
        var username = ""
        var content = "";
        var project = "";
        var slug = "/";
        var floor = -1;
        if(Object.prototype.hasOwnProperty.call(req.body,'username')) username = req.body.username;
        if(Object.prototype.hasOwnProperty.call(req.body,'action')) action = req.body.action;
        if(Object.prototype.hasOwnProperty.call(req.body,'content')) content = req.body.content;
        if(Object.prototype.hasOwnProperty.call(req.body,'project')) project = req.body.project;
        if(Object.prototype.hasOwnProperty.call(req.body,'slug')) slug = req.body.slug;
        if(Object.prototype.hasOwnProperty.call(req.body,'floor')) floor = req.body.floor;

        var returnAction = function() {
            if(action == 'insert') {
                mysql.insertComment(key, username, content, project, function(result) {
                    return res.redirect(slug);
                })
            }
            else if(action == 'update') {
                mysql.updateComment(key, username, floor, content, project, function(result) {
                    return res.redirect(slug);
                })
            }
            else if(action == 'delete') {
                mysql.deleteComment(key, floor, function(result) {
                    return res.redirect(slug);
                })
            }
            else {
                return res.redirect(slug);
            }
        };

        if(action == 'insert') {
            var datas = getFloor(content);
            if(datas['floor'] > 0) {
                action = 'update';
                floor = datas['floor'];
                content = datas['content'];
            }
            // FIXME: 对特殊html符号不敏感，可能产生问题
            content = transformEnterKey(content);

            // 用户名着色
            mysql.getAccounts(function(accounts) {
                content = content.replace(/@[a-z]+/g, function(match, i) {
                    var name = match.slice(1);
                    if(accounts.filter(function(el) { return el.username == name; }).length) {
                        return "@<a>" + name + "</a>";
                    }
                });
                returnAction();
            });
        }
        else {
            returnAction();
        }
    };
}

function getFloor(content) {
    var match = /^#([0-9]+):\s+/.exec(content);
    if(!match) return {floor: -1, content: ""};
    return {floor: match[1],  content: match['input'].slice(match[0].length)}

}

function transformEnterKey(content) {
    return content.replace(/\n/g, '<br />');
}

// Exports
module.exports = route_comment_post;