
'use strict';

// Modules
var path                           = require('path');
var fs                             = require('fs');
var marked                         = require('marked');
var toc                            = require('markdown-toc');
var get_last_modified              = require('../functions/get_last_modified.js');
var remove_image_content_directory = require('../functions/remove_image_content_directory.js');
var mysql                          = require('../middleware/mysql_control');

function route_wildcard (config, raneto) {
  return function (req, res, next) {

    // Skip if nothing matched the wildcard Regex
    // if (!req.params[0]) { return next(); }

    var suffix = 'edit';
    var slug   = req.params[0] || '/';
    if (slug === '/') { slug = config.home_dir; }

    var file_path      = path.normalize(raneto.config.content_dir + slug);
    var file_path_orig = file_path;

    // Remove "/edit" suffix
    if (file_path.indexOf(suffix, file_path.length - suffix.length) !== -1) {
      file_path = file_path.slice(0, - suffix.length - 1);
    }

    if (!fs.existsSync(file_path)) { file_path += '.md'; }

    fs.readFile(file_path, 'utf8', function (error, content) {

      if (error) {
        error.status = '404';
        error.message = config.lang.error['404'];
        return next(error);
      }

      // Process Markdown files
      if (path.extname(file_path) === '.md') {

        // Meta
        var meta = raneto.processMeta(content);
        meta.custom_title = meta.title;
        if (!meta.title) { meta.title = raneto.slugToTitle(file_path); }

        // Content
        content = raneto.stripMeta(content);
        content = raneto.processVars(content);

        var template = meta.template || 'page';
        var render   = template;

        // Check for "/edit" suffix
        if (file_path_orig.indexOf(suffix, file_path_orig.length - suffix.length) !== -1) {

          // Edit Page
          if ((config.authentication || config.authentication_for_edit) && !req.session.loggedIn) {
            res.redirect('/login');
            return;
          }
          render  = 'edit';
          content = content;

        } else {

          // Render Table of Contents
          if (config.table_of_contents) {
            var tableOfContents = toc(content);
            if (tableOfContents.content) {
              content = '#### Table of Contents\n' + tableOfContents.content + '\n\n' + content;
            }
          }

          // Render Markdown
          marked.setOptions({
            langPrefix : ''
          });
          content = marked(content);

        }

        var page_list = remove_image_content_directory(config, raneto.getPages(slug));

        var loggedIn = ((config.authentication || config.authentication_for_edit) ? req.session.loggedIn : false);

        var canEdit = false;
        if (config.authentication || config.authentication_for_edit) {
          canEdit = loggedIn && config.allow_editing;
        } else {
          canEdit = config.allow_editing;
        }

        var username = req.cookies["identity"];

        var res_render = function() {
          return res.render(render, {
            config        : config,
            pages         : page_list,
            meta          : meta,
            content       : content,
            body_class    : template + '-' + raneto.cleanString(slug),
            last_modified : get_last_modified(config,meta,file_path),
            lang          : config.lang,
            loggedIn      : loggedIn,
            username      : username,
            canEdit       : canEdit,
            commentlist   : commentlist,
            key           : key,
            slug          : slug,
            watch         : watch,
            isShow        : function() {
                              return username == this.name;
                            }
          });
        }

        // Render key
        // Render comment list
        var commentlist = [];
        var key = "";
        var watch = false;
        if (file_path_orig.indexOf(suffix, file_path_orig.length - suffix.length) == -1) {
          try{
            key = /<comment\s+id=\"([a-z|0-9]+-[a-z|0-9]+-[a-z|0-9]+-[a-z|0-9]+-[a-z|0-9]+)\"\s+\/>/.exec(content)[1];
          }
          catch(err) {
            return res_render();
          }
          
          mysql.getComments(key, function(result) {
            commentlist = JSON.parse(JSON.stringify(result));
            mysql.changeWatchStatus(key, username, false, function(result) {
              watch = result;
              return res_render();
            })
          });
        }
        else {
          return res_render();
        }

      }

    });

  };
}

// Exports
module.exports = route_wildcard;
