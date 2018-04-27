var logger = require('node-logger');
var config = require('config');

var app = {
	init: function(){
		app.config = config;
		app.console.logLevel = config.get('console.logLevel');
		app.error.timeout = config.get('error.timeout');
		app.logger = logger.createLogger(config.get('logger.logFile'));
		app.logger.setLevel(config.get('logger.level'));
		app.settings = require('./app/settings');
		app.dhtSensor = require('./app/dhtSensor');
		app.dhtSensor.init(config.get('dhtSensor'));
		app.waterSensor = require('./app/waterSensor');
		app.waterSensor.init(config.get('waterSensor'));
		app.humidifier = require('./app/humidifier');
		app.humidifier.init(config.get('humidifier'));
		app.studioMonitorApi = require('./app/studioMonitorApi');
		app.studioMonitorApi.init(config.get('studioMonitorApi'));
		app.console.debug('app.init|success');
		// update settings and init readings
		app.studioMonitorApi.getSettings()
			.then(function(settings){
				app.settings.update(settings);
				app.readings.init();
			})
			.catch(function(error){
				throw new Error('Could not initialize app settings|' + error);
			});
	},
	readings: {
		init: function(){
			app.console.debug('app.readings.init');
			app.readings.update();
			app.readings.timer.stop();
		},
		update: function(){
			app.console.debug('app.readings.update ---------- ---------- ---------- ---------- ----------');
			app.dhtSensor.updateReading()
				.then(function(reading){
					app.console.debug('app.readings.init|dhtSensor.updateReading|success', reading);
					app.waterSensor.updateReading()
						.then(function(reading){
							app.console.debug('app.readings.init|waterSensor.updateReading|success', reading);
							app.readings.validate();
						})
						.catch(app.error.error);
				})
				.catch(app.error.error);
		},
		validate: function(){
			app.console.debug('app.readings.validate', {
				dhtSensor: app.dhtSensor.reading,
				waterSensor: app.waterSensor.reading
			});
			app.settings.validateReading({
				'temperature': app.dhtSensor.getTemperatureReading(),
				'humidity': app.dhtSensor.getHumidityReading(),
				'water_level': app.waterSensor.getWaterLevelReading()
			})
				.then(function(){
					app.console.debug('app.readings.validate|Success');
					app.readings.handleReading(1);
				})
				.catch(function(error){
					app.console.error('app.readings.validate|Error', error);
					app.readings.handleReading(0);
				});
		},
		handleReading: function(active){
			app.console.debug('app.readings.handleReading', active);
			app.humidifier.toggle(active)
				.then(function(data){
					app.console.debug('app.readings.handleReading|app.humidifier.toggle|success', data);
					app.studioMonitorApi.postReading({
						active: active,
						temperature: app.dhtSensor.getTemperatureReading(),
						humidity: app.dhtSensor.getHumidityReading(),
						water_level: app.waterSensor.getWaterLevelReading()
					})
						.then(function(data){
							app.console.info('app.readings.handleReading|app.studioMonitorApi.postReading|success', data);
							app.settings.update(data.settings);
							app.readings.timer.start();
						}).catch(app.error.error);
				}).catch(app.error.error);
		},
		timer: {
			_timer: null,
			start: function(){
				app.console.debug('app.readings.timer.start');
				app.readings.timer._timer = setTimeout(app.readings.update, app.settings.getMillisecondsBetweenReadings());
			},
			stop: function(){
				app.console.debug('app.readings.timer.stop');
				clearTimeout(app.readings.timer._timer);
			},
			reset: function(){
				app.console.debug('app.readings.timer.reset');
				app.readings.timer.stop();
				app.readings.timer.start();
			}
		}
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