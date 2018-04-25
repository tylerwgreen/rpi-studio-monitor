// var settings = require('./app/settings.js');
const dhtSensor = require('./app/dhtSensor');

var app = {
	init: function(){
		console.log('app.init');
		dhtSensor.getReading
			.then(function(reading){
				console.log('foo', reading);
			})
			.catch(function(err){
				console.log('bar', err.message);
			});
	}
}
app.init();

// var dhtSensorReading = dhtSensor.read();
// console.log(dhtSensorReading);