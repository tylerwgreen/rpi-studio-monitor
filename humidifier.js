process.env['NODE_CONFIG_DIR'] = __dirname + '/config/';
var logger = require('node-logger');
var config = require('config');

var app = {
	init: function(){
		app.config = config;
		app.console.logLevel = config.get('console.logLevel');
		app.error.timeout = config.get('error.timeout');
		app.logger = logger.createLogger(config.get('logger.logFile'));
		app.logger.setLevel(config.get('logger.level'));
		app.settings = require(__dirname + '/app/settings');
		app.humidifier = require(__dirname + '/app/humidifier');
		app.humidifier.init(config.get('humidifier'));
		app.humidifier.test();
		app.console.debug('app.init|success');
	},
	error: {
		errorTimeout: null,
		error: function(error){
			app.console.debug('app.error.error', error);
			app.humidifier.deactivate();
			if(error.message)
				error = error.message;
			app.console.error(error);
			app.logger.error(error);
			app.studioMonitorApi.postError(error)
				.then(function(body){
					app.console.debug('app.error.error success', body);
					// wait so we do not flood the log or api if things get out of hand
					// app.readings.timer.reset();
					setTimeout(app.readings.timer.reset, app.error.timeout);
				})
				.catch(function(error){
					app.console.error('app.error.error error', error);
					app.logger.error(error);
					// wait so we do not flood the log or api if things get out of hand
					// app.readings.timer.reset();
					setTimeout(app.readings.timer.reset, app.error.timeout);
				});
		}
	},
	console: {
		logLevel: null,
		getLogLevelNumber: function(logLevelName){
			if(logLevelName === 'debug')
				return 0;
			else if(logLevelName === 'info')
				return 1;
			else if(logLevelName === 'error')
				return 2;
			else
				throw new Error('Illegal logLevelName: ', logLevelName);
		},
		canLog: function(logLevelName){
			return app.console.getLogLevelNumber(logLevelName) >= app.console.getLogLevelNumber(app.console.logLevel) ? true : false;
		},
		debug: function(msg, params){
			if(!app.console.canLog('debug'))
				return;
			var params = typeof params === 'undefined' ? {} : params;
			console.log('DEBUG|' + msg, params);
		},
		info: function(msg, params){
			if(!app.console.canLog('info'))
				return;
			var params = typeof params === 'undefined' ? {} : params;
			console.log('INFO|' + msg, params);
		},
		error: function(msg, params){
			if(!app.console.canLog('error'))
				return;
			var params = typeof params === 'undefined' ? {} : params;
			console.log('ERROR|' + msg, params);
		}
	}
}
app.init();