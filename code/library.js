var request = require('request');
const got  = require('got');

const githubUrl = "https://api.github.ncsu.edu";
const chalk  = require('chalk');

var config = {};

// Retrieve our api tokens from the environment variables.
config.channel = process.env.CHANNELID;
config.botaccess = process.env.BOTACCESSTOKEN;
config.mmurl = process.env.MATTERMOSTURL;
config.gh_token = process.env.GITHUBTOKEN;

/*if( config.mmurl || !config.botaccess )
{
	console.log(`Please set your environment variables with appropriate token.`);
	console.log(chalk`{italic You may need to refresh your shell in order for your changes to take place.}`);
	process.exit(1);
}*/

async function createChannel() {

	//var mmuserid = storage_lib.get("tblGitMatter", githubUser);

	var options = {
		url: config.mmurl + "/api/v4/channels/direct",
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${config.botaccess}`
		},
		json : [
		  "zonbwmqtxtdmtp9b79owgid3ny",
		  "xzxmyqd5n7ya8fqqayyiqhsq3y"
		]
	};

	return new Promise(function(resolve, reject)
	{
		request(options, function (error, response, body) {

			if( error )
			{
				console.log( chalk.red( error ));
				reject(error);
				return; // Terminate execution.
			}
			resolve(response.body.id);
		});
	});
}

async function sendResponse(data) {
	var options = {
		url: config.mmurl + "/api/v4/posts",
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${config.botaccess}`
		},
		json : data
	};

	return new Promise(function(resolve, reject)
	{
		request(options, function (error, response, body) {

			if( error )
			{
				//console.log( chalk.red( error ));
				console.log("Error");
				reject(error);
				return; // Terminate execution.
			}

			resolve(response.body);
		});
	});
}



module.exports.sendResponse = sendResponse;
module.exports.createChannel = createChannel;