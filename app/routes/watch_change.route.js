
'use strict';

// Modules
var mysql = require('../middleware/mysql_control');

function git_update(config, raneto) {
    return function (req, res, next) {
        if(!Object.prototype.hasOwnProperty.call(req.body,'key') || !Object.prototype.hasOwnProperty.call(req.body,'user')) {
            res.header('Content-Type', 'text/html');
            return res.send('ok');
        }
        var key = req.body.key;
        var user = req.body.user;

        mysql.changeWatchStatus(key, user, true, function(status) {
            res.header('Content-Type', 'text/html');
            return res.send('ok');
        })

    }
}

// Exports
module.exports = git_update;