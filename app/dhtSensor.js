// var request = require('request');
var sensorLib = require('node-dht-sensor');

var settings = {
	sensorType: 11,
	gpioPin: 4
};

var getReading = new Promise((resolve, reject) => {
	// sensorLib.read(dhtSensor.settings.sensorType, dhtSensor.settings.gpioPin, function(err, tempC, humidity){
	// console.log(this.settings);
	console.log(settings);
	sensorLib.read(11, 4, function(err, tempC, humidity){
		if(err){
			console.log(err);
			reject('test');
			// reject(err.message);
			// reject(new Error(err));
			// dhtSensor.sendErrorToServer(err);
		}
		var data = {
			temperature: dhtSensor.convertTempToF(tempC).toFixed(1),
			humidity: humidity.toFixed(1)
		};
		console.log('temp: ' + data.temp + '°F, ' + 'humidity: ' + data.humidity + '%');
		// dhtSensor.sendDataToServer(data);
		// setTimeout(function() {
			// dhtSensor.read();
		// }, 15000);
		resolve('success');
	})
});
var convertTempToF = function(c){
	return c * 9/5 + 32;
}
/* sendDataToServer: function(data){
	request({
		uri: 'http://studiomonitor.tylergreenphoto.com/api/reading',
		method: 'POST',
		headers: {
			'X-AUTH-TOKEN': 'api:foo',
			'Content-Type': 'application/json'
		},
		json: data
	}, function(error, response, body){
		if(!error && response.statusCode == 200){
			console.log(body);
		}else{
			console.log(['Error', response.statusCode, response.body.message]);
		}
	});
},
sendErrorToServer: function(error){
	request({
		uri: 'http://studiomonitor.tylergreenphoto.com/api/error',
		method: 'POST',
		headers: {
			'X-AUTH-TOKEN': 'api:foo',
			'Content-Type': 'application/json'
		},
		json: {error: error}
	}, function(error, response, body){
		if(!error && response.statusCode == 200){
			console.log(body);
		}else{
			console.log(['Error', response.statusCode, response.body.message]);
		}
	});
} */
module.exports = getReading;