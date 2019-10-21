var request = require('request');
const got  = require('got');
var storage_lib = require('./storage_lib.js');

const githubUrl = "https://api.github.ncsu.edu";

const chalk  = require('chalk');

var config = {};

// Retrieve our api tokens from the environment variables.
config.channel = process.env.CHANNELID;
config.botaccess = process.env.BOTACCESSTOKEN;
config.mmurl = process.env.MATTERMOSTURL;
config.gh_token = process.env.GITHUBTOKEN;

if( !config.channel || !config.mmurl || !config.botaccess )
{
	console.log(`Please set your environment variables with appropriate token.`);
	console.log(chalk`{italic You may need to refresh your shell in order for your changes to take place.}`);
	process.exit(1);
}


// send response to the front end
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
				console.log( chalk.red( error ));
				reject(error);
				return; // Terminate execution.
			}

			resolve(response.body);
		});
	});
}

function getDefaultOptions(endpoint, method)
{
	var options = {
		url: githubUrl + endpoint,
		method: method,
		headers: {
			"User-Agent": "NoMatterBot",
			"content-type": "application/json",
			"Authorization": `token ${config.gh_token}`
		}
	};
	return options;
}

// get issues for a given repo
async function getOpenIssues(owner, repo) {

	var options = getDefaultOptions("/repos/" + owner + "/" + repo + "/issues", "GET");

	options.json = true;

	return new Promise(function(resolve, reject)
	{
		request(options, function (error, response, body) {

			if( error )
			{
				console.log( chalk.red( error ));
				reject(error);
				return; // Terminate execution.
			}

			resolve(response.body);
		});
	});
}

// get collaborators for a given repo
async function getCollaborators(owner, repo) {

	var options = getDefaultOptions("/repos/" + owner + "/" + repo + "/collaborators", "GET")

	options.json = true;

	return new Promise(function(resolve, reject)
	{
		request(options, function (error, response, body) {

			if( error )
			{
				console.log( chalk.red( error ));
				reject(error);
				return; // Terminate execution.
			}

			resolve(response.body);
		});
	});
}

async function createChannel(githubUser) {

	var mmuserid = storage_lib.get("tblGitMatter", githubUser);

	var options = {
		url: config.mmurl + "/api/v4/channels/direct",
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${config.botaccess}`
		},
		json : [
		  "zonbwmqtxtdmtp9b79owgid3ny",
		  "3e43uuy41ir4jm7dqzu189knbw"
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


// assign the issue to an assignee 
async function assignToIssue(owner, repo, issue_id, assignee) {
	var options = getDefaultOptions("/repos/" + owner + "/" + repo + "/issues/" + issue_id, "PATCH")

	options.body = `{"assignees":["${assignee}"]`;

	return new Promise(function(resolve, reject)
	{
		request(options, function (error, response, body) {

			if( error )
			{
				console.log( chalk.red( error ));
				reject(error);
				return; // Terminate execution.
			}

			resolve(response.statusCode);
		});
	});
}

module.exports.sendResponse = sendResponse;
module.exports.getOpenIssues = getOpenIssues;
module.exports.createChannel = createChannel;
module.exports.assignToIssue = assignToIssue;
module.exports.getCollaborators = getCollaborators;
