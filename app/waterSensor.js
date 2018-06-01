// var sensorLib = require('node-dht-sensor');

var waterSensor = {
	_debug: false,
	_fakeReading: true,
	reading: null,
	_gpioPin: null,
	init: function(args){
		waterSensor._log('init', args);
		waterSensor._gpioPin = args.gpioPin;
	},
	updateReading: function(){
		waterSensor._log('updateReading');
		return new Promise((resolve, reject) => {
			var updateReadingMethod = typeof sensorLib === 'undefined' ? null : sensorLib.read;
			if(waterSensor._fakeReading)
				updateReadingMethod = waterSensor._fakeSensorRead;
			updateReadingMethod(waterSensor._gpioPin, function(err, waterLevel){
				if(err)
					reject(err);
				waterSensor.reading = waterLevel.toFixed(1);
				resolve(waterSensor.reading);
			});
		})
	},
	getWaterLevelReading: function(){
		waterSensor._log('getWaterLevelReading', waterSensor.reading);
		return waterSensor.reading;
	},
	_fakeSensorRead: function(gpioPin, callback){
		waterSensor._log('_fakeSensorRead', gpioPin);
		callback(
			// new Error('Could not read water sensor'),
			null,
			// waterSensor._randomIntFromInterval(10, 90),
			50
		);
	},
	_randomIntFromInterval: function(min, max){
		return Math.floor(Math.random() * (max - min + 1) + min);
	},
	_log: function(msg){
		if(waterSensor._debug)
			console.log('waterSensor.' + msg);
	}
}
module.exports = waterSensor;