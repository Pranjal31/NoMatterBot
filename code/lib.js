var request = require('request');
const got  = require('got');
const chalk  = require('chalk');

var storage_lib = require('./storage_lib.js');

var config = {};

// Retrieve our api tokens from the environment variables.
config.githubUrl = process.env.GITHUBURL;
config.userchannelid = process.env.CHANNELUSERID;
config.botaccess = process.env.BOTACCESSTOKEN;
config.mmurl = process.env.MATTERMOSTURL;
config.gh_token = process.env.GITHUBTOKEN;
config.botuserid = process.env.BOTUSERID;
config.server = process.env.SERVERURL;
config.dbServer = process.env.DBSERVERURL;
config.dbUserId = process.env.DBUSER;
config.dbUserPwd = process.env.DBUSERPWD;
config.dbName = process.env.DBNAME;

if( !config.githubUrl || !config.mmurl || !config.botaccess || !config.userchannelid || 
	!config.gh_token || !config.botuserid || !config.server || !config.dbServer || !config.dbUserId || 
	!config.dbUserPwd || !config.dbName)
{
	console.log(`Please set your environment variables with appropriate values.`);
	console.log(chalk`{italic You may need to refresh your shell in order for your changes to take place.}`);
	process.exit(1);
}


// send response to the front end
async function postMessage(data) {
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

function getDefaultOptions(urlRoot, endpoint, method)
{
	var options = {
		url: urlRoot + endpoint,
		method: method,
		headers: {
			"User-Agent": "NoMatterBot",
			"content-type": "application/json",
			"Authorization": `token ${config.gh_token}`
		}
	};
	return options;
}

// get repositories for owner
async function getAccessibleRepos() {

	//var options = getDefaultOptions(config.githubUrl, "/users/" + owner + "/repos?type=all", "GET");
	var options = getDefaultOptions(config.githubUrl, "/user/repos?type=all", "GET");
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

// get issues for a given repo
async function getOpenIssues(owner, repo) {

	var options = getDefaultOptions(config.githubUrl, "/repos/" + owner + "/" + repo + "/issues", "GET");

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

	var options = getDefaultOptions(config.githubUrl, "/repos/" + owner + "/" + repo + "/collaborators", "GET")

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

	var mmuserid = await storage_lib.getMMUID(githubUser);

	var options = {
		url: config.mmurl + "/api/v4/channels/direct",
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${config.botaccess}`
		},
		json : [
		  config.botuserid,
		  mmuserid
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
	var options = getDefaultOptions(config.githubUrl, "/repos/" + owner + "/" + repo + "/issues/" + issue_id, "PATCH")

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

// open interactive dialog
async function openInteractiveDialog(data)
{
	console.log(chalk.green("\nOpen Interactive Dialog"));

	let options = getDefaultOptions(config.server, "/api/v4/actions/dialogs/open", "POST");
    options.body = JSON.stringify(data);

	// Send a http request to url and specify a callback that will be called upon its return.
	return new Promise(function(resolve, reject)
	{
		request.post(options, function(error, response, body){
			if(error){
				console.log(chalk.red(error));
				reject(error);
				return; // Terminate execution
            }
			console.log(`Response Status Code ${response.statusCode}`);
			resolve(response.statusCode);
		});
	});
}

// get repositories for owner
async function getRepos(owner) {

	var options = getDefaultOptions(config.githubUrl, "/users/" + owner + "/repos", "GET");
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

// get a particular issue
async function getIssue(owner, repo, issueId) {

	var options = getDefaultOptions(config.githubUrl, "/repos/" + owner + "/" + repo + "/issues/" + issueId, "GET");
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

module.exports.getRepos = getRepos; 
module.exports.getIssue = getIssue; 
module.exports.postMessage = postMessage;
module.exports.getOpenIssues = getOpenIssues;
module.exports.createChannel = createChannel;
module.exports.assignToIssue = assignToIssue;
module.exports.getCollaborators = getCollaborators;
module.exports.openInteractiveDialog = openInteractiveDialog;
module.exports.getDefaultOptions = getDefaultOptions;
module.exports.config = config;
module.exports.getAccessibleRepos = getAccessibleRepos;

