var sensorLib = require('node-dht-sensor');

var dhtSensor = {
	_debug: false,
	// _fakeReading: false,
	reading: null,
	_sensorType: null,
	_gpioPin: null,
	init: function(args){
		dhtSensor._log('init', args);
		dhtSensor._sensorType = args.sensorType;
		dhtSensor._gpioPin = args.gpioPin;
	},
	updateReading: function(){
		dhtSensor._log('updateReading');
		return new Promise((resolve, reject) => {
			/* var updateReadingMethod = typeof sensorLib === 'undefined' ? null : sensorLib.read;
			if(dhtSensor._fakeReading)
				updateReadingMethod = dhtSensor._fakeSensorRead;
			updateReadingMethod(dhtSensor._sensorType, dhtSensor._gpioPin, function(err, tempC, humidity){ */
			sensorLib.read(dhtSensor._sensorType, dhtSensor._gpioPin, function(err, tempC, humidity){
				if(err)
					reject(err);
				dhtSensor.reading = {
					temperature: dhtSensor._convertTempToF(tempC).toFixed(1),
					humidity: humidity.toFixed(1)
				};
				resolve(dhtSensor.reading);
			});
		})
	},
	getTemperatureReading: function(){
		dhtSensor._log('getTemperatureReading', dhtSensor.reading.temperature);
		return dhtSensor.reading.temperature;
	},
	getHumidityReading: function(){
		dhtSensor._log('getHumidityReading', dhtSensor.reading.humidity);
		return dhtSensor.reading.humidity;
	},
	_convertTempToF: function(c){
		dhtSensor._log('_convertTempToF', c);
		return c * 9/5 + 32;
	},
	/* _fakeSensorRead: function(sensorType, gpioPin, callback){
		dhtSensor._log('_fakeSensorRead', sensorType, gpioPin);
		callback(
			// new Error('Could not read dht sensor'),
			null,
			dhtSensor._randomIntFromInterval(10, 40),
			dhtSensor._randomIntFromInterval(10, 70)
		);
	}, */
	_randomIntFromInterval: function(min, max){
		return Math.floor(Math.random() * (max - min + 1) + min);
	},
	_log: function(msg){
		if(dhtSensor._debug)
			console.log('dhtSensor.' + msg);
	}
}
module.exports = dhtSensor;