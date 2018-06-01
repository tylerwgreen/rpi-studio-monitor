// var sensorLib = require('node-dht-sensor');

var humidifier = {
	_debug: true,
	_gpioPin: null,
	_status: null,
	init: function(args){
		humidifier._log('init', args);
		humidifier._gpioPin = args.gpioPin;
	},
	toggle: function(active){
		if(active)
			return humidifier.activate();
		else
			return humidifier.deactivate();
	},
	activate: function(){
		humidifier._log('activate');
		return new Promise((resolve, reject) => {
			// reject(err);
			resolve('Activated humidifier');
		})
	},
	deactivate: function(){
		humidifier._log('deactivate');
		return new Promise((resolve, reject) => {
			// reject(err);
			resolve('Deactivated humidifier');
		})
	},
	_log: function(msg){
		if(humidifier._debug)
			console.log('humidifier.' + msg);
	},
	test: function(){
		humidifier._log('test');
		setTimeout(humidifier.test, 1000);
	}
}
module.exports = humidifier;