#!/usr/bin/env node

'use strict';

var config = require('./config.default.js');

require('simple-git')().clone(config.git_path + '.git', config.content_dir);
