var request = require('request');

var studioMonitorApi = {
	_debug: false,
	_baseUri: null,
	_username: null,
	_password: null,
	init: function(args){
		studioMonitorApi._log('init', args);
		studioMonitorApi._baseUri = args.baseUri;
		studioMonitorApi._username = args.username;
		studioMonitorApi._password = args.password;
	},
	getSettings: function(){
		return new Promise((resolve, reject) => {
			studioMonitorApi._handlRequest({
					path: '/settings',
					method: 'GET',
					data: null
				})
				.then(function(body){
					if(body.data && body.data.settings)
						resolve(body.data.settings);
					else
						reject('Missing body.data.settings');
				})
				.catch(function(err){
					reject(err);
				});
		});
	},
	postReading: function(data){
		return new Promise((resolve, reject) => {
			studioMonitorApi._handlRequest({
					path: '/reading',
					method: 'POST',
					data: data
				})
				.then(function(body){
					if(body.data && body.data)
						resolve(body.data);
					else
						reject('Missing body.data');
				})
				.catch(function(err){
					reject(err);
				});
		});
	},
	postError: function(error){
		return new Promise((resolve, reject) => {
			studioMonitorApi._handlRequest({
					path: '/error',
					method: 'POST',
					data: {error: error}
				})
				.then(function(body){
					resolve(body.data);
				})
				.catch(function(err){
					reject(err);
				});
		});
	},
	_handlRequest: function(args){
		studioMonitorApi._log('_handlRequest', args);
		return new Promise((resolve, reject) => {
			request({
				uri: studioMonitorApi._baseUri + args.path,
				method: args.method,
				headers: {
					'X-AUTH-TOKEN': studioMonitorApi._username + ':' + studioMonitorApi._password,
					'Content-Type': 'application/json'
				},
				json: args.data
			}, function(error, response, body){
// studioMonitorApi._log('error', error);
// studioMonitorApi._log('response.statusMessage', response.statusMessage);
// studioMonitorApi._log('response.statusCode', response.statusCode);
// studioMonitorApi._log(typeof body);
				if(typeof body !== 'undefined' && typeof body !== 'object')
					body = JSON.parse(body);
				if(!error && response.statusCode == 200){
					resolve(body);
				}else{
					if(error){
						reject(error)
					}else if(response){
						if(response.body){
							var msg = ['Error', response.statusCode, response.statusMessage];
							if(response.body.error)
								msg.push(response.body.error);
							else if(response.body.message)
								msg.push(response.body.message);
							reject(msg);
						}else{
							reject(['Error', response.statusCode, response.statusMessage]);
						}
					}else{
						reject('Unknown error');
					}
				}
			});
		});
	},
	_log: function(msg){
		if(studioMonitorApi._debug)
			console.log('studioMonitorApi.' + msg);
	}
}
module.exports = studioMonitorApi;