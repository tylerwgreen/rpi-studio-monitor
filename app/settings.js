var settings = {
	_debug: false,
	_settings: {
		seconds_between_readings: null,
		readings_ranges: {
			temperature: {
				hi: null,
				lo: null
			},
			humidity: {
				hi: null,
				lo: null
			},
			water_level: {
				hi: null,
				lo: null
			}
		}
	},
	update: function(newSettings){
		settings._log('update', newSettings);
		settings._settings = newSettings;
	},
	getSecondsBetweenReadings: function(){
		settings._log('getSecondsBetweenReadings', settings._settings.seconds_between_readings);
		return settings._settings.seconds_between_readings;
	},
	getMillisecondsBetweenReadings: function(){
		settings._log('getMillisecondsBetweenReadings', settings._settings.seconds_between_readings);
		return settings._settings.seconds_between_readings * 1000;
	},
	getReadingsRanges: function(){
		settings._log('getReadingsRanges', settings._settings.readings_ranges);
		return settings._settings.readings_ranges;
	},
	validateReading: function(reading){
		settings._log('validateReading', reading);
		return new Promise((resolve, reject) => {
			settings._validateTemperatureReading(reading.temperature)
			.then(settings._validateHumidityReading(reading.humidity))
			.then(settings._validateWaterLevelReading(reading.water_level))
			.then(function(){
				resolve('validateReading|Valid');
			})
			.catch(function(err){
				reject(err);
			});
		});
	},
	_validateTemperatureReading: function(reading){
		settings._log('validateTemperatureReading', reading);
		return new Promise((resolve, reject) => {
			if(reading > settings._settings.readings_ranges.temperature.hi)
				reject('validateTemperatureReading|Invalid|Too Hi|' + reading);
			else if(reading < settings._settings.readings_ranges.temperature.lo)
				reject('validateTemperatureReading|Invalid|Too Low|' + reading);
			resolve('validateTemperatureReading|Valid');
		});
	},
	_validateHumidityReading: function(reading){
		settings._log('validateHumidityReading', reading);
		return new Promise((resolve, reject) => {
			if(reading > settings._settings.readings_ranges.humidity.hi)
				reject('validateHumidityReading|Invalid|Too Hi|' + reading);
			else if(reading < settings._settings.readings_ranges.humidity.lo)
				reject('validateHumidityReading|Invalid|Too Low|' + reading);
			resolve('validateHumidityReading|Valid');
		});
	},
	_validateWaterLevelReading: function(reading){
		settings._log('validateWaterLevelReading', reading);
		return new Promise((resolve, reject) => {
			if(reading > settings._settings.readings_ranges.water_level.hi)
				reject('validateWaterLevelReading|Invalid|Too Hi|' + reading);
			else if(reading < settings._settings.readings_ranges.water_level.lo)
				reject('validateWaterLevelReading|Invalid|Too Low|' + reading);
			resolve('validateWaterLevelReading|Valid');
		});
	},
	_log: function(msg){
		if(settings._debug)
			console.log('settings.' + msg);
	}
}
module.exports = settings;