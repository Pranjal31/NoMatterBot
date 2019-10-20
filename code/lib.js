var request = require('request');
const got  = require('got');
var storage_lib = require('./storage_lib.js');

const token = "token " + "YOUR TOKEN";
const githubUrl = "https://api.github.com";

const chalk  = require('chalk');

var config = {};

// Retrieve our api token from the environment variables.
config.channel = process.env.CHANNELID;
config.botaccess = process.env.BOTACCESSTOKEN;
config.mmurl = process.env.MATTERMOSTURL;
config.token = process.env.GITHUBTOKEN;

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
			"Content-Type": "application/json",
			"Authorization": `Bearer ${config.botaccess}`
		},
		json : data
	};

	request(options, function (error, response, body) {

		console.log((response.body)) ;
	});
}

async function getIssues(owner, repo) {
	console.log(config.token)
	const url = urlRoot + "/repos/" + owner + "/" + repo + "/issues";
	const options = {
		url: urlRoot,
		method: 'GET',
		headers: {
			"User-Agent": "CSC510-REST-WORKSHOP",
			"content-type": "application/json",
			"Authorization": `token ${config.token}`
		},
		json: true
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

			console.log(response)
		});
	});
}

function createChannel(githubUser) {

	var mmuserid = storage_lib.get("tblGitMatter", githubUser);

	return config.channel;
}

function assignToIssue(owner, repo, issue_id) {

	return response.statusCode;
}

module.exports.sendResponse = sendResponse;
module.exports.getIssues = getIssues;
module.exports.createChannel = createChannel;
module.exports.assignToIssue = assignToIssue;
