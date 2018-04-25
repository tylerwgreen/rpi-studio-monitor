const settings = {
	settings: {
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
			waterLevel: {
				hi: null,
				lo: null
			}
		}
	},
	update: function(settings){
		console.log('settings.update', settings);
		this.settings = settings;
	},
	getSecondsBetweenReadings: function(){
		return this.settings.seconds_between_readings;
	},
	getReadingsRanges: function(){
		return this.settings.readings_ranges;
	}
}
module.exports = settings;