
'use strict';

var glob = require('glob');
var fs = require('fs');
var pathF = require('path');

function page_list(config, raneto) {
    return function (req, res, next) {
        res.header('Content-Type', 'text/html');
        var path = "";
        if(Object.prototype.hasOwnProperty.call(req.body,'path')) {
            path = req.body.path + '.md';
        }
        else {
            return res.send([]);
        }
        if(Object.prototype.hasOwnProperty.call(req.body,'id')) {
            // 选择的目录的显示
            return res.send(getpage(req.body.id, false, config));
        }
        else {
            // 根目录到当前目录的显示
            return res.send(getpage(path, true, config));
        }
    }
}

function getpage(path, allTreeChk, config, childPath, child  ) {
    var pathFull = pathF.join(config.content_dir, path);
    try {
        var stat = fs.statSync(pathFull);
    } catch(err) {
        return getpage('/', false, config );
    }

    if(stat.isFile()) {
        var fileName = pathF.parse(pathFull).name;
        pathFull = pathF.resolve(pathFull, '..');
    }

    var files = fs.readdirSync(pathFull);
    var pathList = [];
    files.forEach(function(value, index, array) {
        var tempPath = {};
        var valuePath = pathF.resolve(pathFull, value);
        var valueStat = pathF.parse(valuePath);
        tempPath['id'] = pathF.relative(config.content_dir, valuePath);
        tempPath['name'] = valueStat.name;
        tempPath['isParent'] = fs.statSync(valuePath).isDirectory();
        tempPath['click'] = false;
        if(tempPath['isParent'] && valueStat.name == childPath) {
            tempPath['children'] = child;
            tempPath['open'] = true;
        }
        else if(valueStat.ext == '.md') {
            tempPath['url'] = pathF.resolve('/' + config.base_suburl, tempPath['id'], '..', tempPath['name']);
            tempPath['target'] = "_self";
            if(valueStat.name == fileName) {
                tempPath['font'] = {'font-weight':'bold'};
            }
        }
        if((tempPath['isParent'] && glob.sync(valuePath + '/*.md', 'absolute').length > 0)
             || valueStat.ext == '.md') pathList.push(tempPath);
    })

    pathList.sort(function(a, b) {
        return a['name'].localeCompare(b['name']);
    });
    
    if(!allTreeChk) {
        // 返回当前目录文件列表
        return pathList;
    }

    var relativePath = pathF.relative(config.content_dir, pathFull);
    if(relativePath == '') {
        return pathList;
    }
    else {
        return getpage(pathF.resolve('/' + relativePath, '..'), allTreeChk, config, pathF.parse(pathFull).name, pathList);
    }
}

// Exports
module.exports = page_list;
