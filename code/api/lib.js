var request = require('request');

const chalk  = require('chalk');

var config = {};

// Retrieve our api token from the environment variables.
config.channel = process.env.CHANNELID;
config.botaccess = process.env.BOTACCESSTOKEN;
config.mmurl = process.env.MATTERMOSTURL;

if( !config.channel || !config.mmurl || !config.botaccess )
{
	console.log(`Please set your environment variables with appropriate token.`);
	console.log(chalk`{italic You may need to refresh your shell in order for your changes to take place.}`);
	process.exit(1);
}

function sendResponse(method, data) {
	var options = {
		url: config.mmurl + "/api/v4/posts",
		method: method,
		headers: {
			"content-type": "application/json",
			"Authorization": "Bearer ${config.botaccess}"
		},
		data : data
	};

	request(options, function (error, response, body) {

		console.log((response.body)) ;
	});
}

module.exports.sendResponse = sendResponse;
