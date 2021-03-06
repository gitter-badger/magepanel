/**
 * Module dependencies.
 */
var Common = require('./common');
var express = require('express.io');
var routes = require('./routes');
var projects = require('./routes/projects');
var mage = require('./routes/mage');
var mageLogs = require('./routes/mageLogs');
var tags = require('./routes/tags');
var setup = require('./routes/setup');
var http = require('http');
var path = require('path');

var app = express().http().io();

/**
 * Logger Configuration
 */
Common.scribe.configure(function(){
    Common.scribe.set('app', Common.config.server.name);
    Common.scribe.set('logPath', Common.config.logger.directory);
    Common.scribe.set('defaultTag', Common.config.logger.defaultTag);
    Common.scribe.set('divider', Common.config.logger.divider);
    Common.scribe.set('identation', 5);
    Common.scribe.set('maxTagLength', 30);
    Common.scribe.set('mainUser', Common.username);
});
// Create loggers (name, save to file, print to console, tag color)
Common.scribe.addLogger('debug', true , true, 'grey');
Common.scribe.addLogger('log', true , true, 'white');
Common.scribe.addLogger('info', true , true, 'green');
Common.scribe.addLogger('error', true , true, 'red');
Common.scribe.addLogger('warn', true , true, 'yellow');

/**
 * Express Server Configuration
 */
app.set('port', process.env.PORT || Common.config.server.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.use(express.favicon());
app.use(express.favicon(path.join(__dirname, 'public','images','favicon.ico')));
//app.use(express.logger('dev')); // Open for express js logging
app.use(express.json());
app.use(express.urlencoded());
//app.use(express.methodOverride()); //deprecated
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// 404
app.use(function(req, res, next) {
    console.warn("404: %s", req.url);
    res.status(404);
    res.render('404', {
        username: Common.username,
        title: 'Not Found',
        setupCompleted: Common.setupCompleted
    });
});

// development only
if (app.get('env') == 'development') {
  app.use(express.errorHandler());
}

/**
 * Routes
 */
app.get('/', routes.index); // Index
app.get('/log', Common.scribe.express.controlPanel()); // Log control panel

// MagePanel App Setup
app.get('/setup', setup.index); // App setup
app.post('/setup/save', setup.save); // Setup save
app.io.route('checkUpdates', setup.checkUpdates); // Execute check for app updates with Socket.IO
app.io.route('revisionVersion', setup.revisionVersion); // Get revision version for app with Socket.IO

// Mage Projects
app.get('/projects', projects.index); // Projects page
app.get('/projects/get', projects.getProject); // Get project from DB with ID
app.post('/projects/add', projects.add); // Add new project
app.post('/projects/addEnvFile', projects.addEnvFile); // Add new project environment file
app.post('/projects/addTaskFile', projects.addTaskFile); // Add new project task file
app.post('/projects/refresh', projects.refresh); // Refresh project
app.post('/projects/gitPull', projects.gitPull); // GIT Pull project
app.post('/projects/gitCommitPush', projects.gitCommitPush); // GIT Commit & Push project
app.post('/projects/gitIsDirty', projects.gitIsDirty); // GIT Is Dirty?
app.post('/projects/gitRemoteBranches', projects.gitRemoteBranches); // GIT Remote Branches of project
app.post('/projects/gitSwitchBranch', projects.gitSwitchBranch); // GIT Checkout branch project
app.post('/projects/delete', projects.delete); // Delete projects
app.post('/projects/deleteFile', projects.deleteFile); // Delete project file
app.post('/projects/applyFile', projects.applyFile); // Apply project file
app.post('/projects/saveFile', projects.saveFile); // Save project file
app.get('/projects/detail', projects.detail); // Get project detail
app.get('/projects/envs', projects.envs); // Get environments of selected project

// Mage Console
app.get('/mage', mage.index); // Mage console
app.post('/mage/init', mage.init); // Execute mage init
app.io.route('mageCommand', mage.command); // Execute mage command with Socket.IO

// Mage Logs
app.get('/mageLogs', mageLogs.index); // Mage logs
app.get('/mageLogs/project', mageLogs.projectLogs); // Get logs for project
app.get('/mageLogs/projectLatestLog', mageLogs.projectLatestLog); // Get project's latest log file
app.io.route('tailLog', mageLogs.tailLog); // Tail project log with Socket.IO
app.io.route('exitTail', mageLogs.exitTail); // Exit tail log with Socket.IO
app.io.route('pauseTail', mageLogs.pauseTail); // Pause tail log with Socket.IO
app.io.route('resumeTail', mageLogs.resumeTail); // Resume tail log with Socket.IO

// Project Tags
app.get('/tags', tags.index); // Project Tags
app.get('/tags/get', tags.getTag); // Get tag from DB with ID
app.post('/tags/add', tags.add); // Add new tag
app.post('/tags/delete', tags.delete); // Delete tag

/**
 * Start Server
 */
app.listen(app.get('port'), function(){
  console.t().info('MagePanel started on port ' + app.get('port'));
});