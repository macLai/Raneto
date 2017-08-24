'use strict';

var config = require('../example/config.default.js');
var mysql_control = require('../app/middleware/mysql_control.js');

var insertCommentTest = function(key, username, content, project) {
    mysql_control.insertComment(key, username, content, project, function(result) {
        console.log("insertCommentTest test:" + result);
    })
}
var updateCommentTest = function(key, floor, content, project) {
    mysql_control.updateComment(key, floor, content, project, function(result) {
        console.log("updateCommentTest test:" + result);
    })
}
var getCommentsTest = function(key) {
    mysql_control.getComments(key, function(result) {
        console.log("getCommentsTest test:" + result);
    })
}
var deleteCommentsTest = function(key, floor) {
    mysql_control.deleteComments(key, floor, function(result) {
        console.log("deleteCommentsTest test:" + result);
    })
}
var checkCommentKeyExistTest = function(key) {
    mysql_control.checkCommentKeyExist(key, function(result) {
        console.log("checkCommentKeyExistTest test:" + result);
    })
}

mysql_control.connectCommentSql(config, function(result) {
    console.log("connectCommentSql test:" + result);
    if(result) {
        insertCommentTest("72a1bb70-8178-11e7-af39-af58ebb229df","zhao","asd","asd");
        getCommentsTest("a");
    }
});