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

if( !config.githubUrl || !config.mmurl || !config.botaccess || !config.userchannelid || 
	!config.gh_token || !config.botuserid || !config.server)
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

async function updateMessage(msg_id, data) {

	var options = {
		url: config.mmurl + "/api/v4/posts/" + msg_id,
		method: "PUT",
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

async function getMessage(msg_id) {

	var options = {
		url: config.mmurl + "/api/v4/posts/" + msg_id,
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${config.botaccess}`
		}
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

async function getUser() {

	var options = getDefaultOptions(config.githubUrl, "/user", "GET");
	options.json = true;
	config
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

/// get repositories owned by the bot account
async function getAccessibleRepos() {

    var options = getDefaultOptions(config.githubUrl, "/user/repos?affiliation=owner", "GET");
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

	// var mmuserid = await storage_lib.getMMUID(githubUser);

	var mmuserid = "g9ztakciipdtuf5354yk6yof1h";

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

// list labels on a particular issue
async function getLabelsOnIssue(owner,repo, issueId) {

	var options = getDefaultOptions(config.githubUrl, "/repos/" + owner + "/" + repo + "/issues/" + issueId + "/labels", "GET");
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

// Delete a label on issue
async function deleteLabelOnIssue(owner, repo, issue, label) {
    let options = getDefaultOptions(config.githubUrl, "/repos/"+owner+"/"+repo+"/issues/"+issue+"/labels/" + label, "DELETE");

	// Send a http request to url and specify a callback that will be called upon its return.
	return new Promise(function(resolve, reject)
	{
        request.delete(options, function(error, response, body){
			if(error){
				console.log(chalk.red(error));
				reject(error);
				return; // Terminate execution
            }
            console.log(response.body);
			console.log(`Response Status Code ${response.statusCode}`);
			resolve(response.statusCode);
		});
	});
}

// add a label on issue
async function addLabelOnIssue(owner,repo, issue, label)
{
    let options = getDefaultOptions(config.githubUrl, "/repos/"+owner+"/"+repo+"/issues/"+issue+"/labels", "POST");
    options.body = `{"labels":["${label}"]}`;

	// Send a http request to url and specify a callback that will be called upon its return.
	return new Promise(function(resolve, reject)
	{
		request.post(options, function(error, response, body){
			if(error){
				console.log(chalk.red(error));
				reject(error);
				return; // Terminate execution
            }
            console.log(response.body);
			console.log(`Response Status Code ${response.statusCode}`);

			resolve(response.statusCode);
		});
	});
}

//Function to close GitHub Issue
async function closeIssue(owner, repo, issueId)
{
	var options = getDefaultOptions(config.githubUrl, "/repos/" + owner + "/" + repo + "/issues/" + issueId, "PATCH");
	options.body = `{"state": "closed"}`;

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

// check if the specified issue exists and is open
async function openIssueExists(owner, repo, issueId)
{
	var issue  = await getIssue(owner, repo, issueId)

    if ( issue.number && issue.number.toString() === issueId && issue.state === "open" ){
		return true;
	}
	console.log("For owner: " + owner + ", " + repo + "/" + issueId + " is not an open issue!")
	return false;
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
module.exports.getAccessibleRepos = getAccessibleRepos;
module.exports.getLabelsOnIssue = getLabelsOnIssue;
module.exports.addLabelOnIssue = addLabelOnIssue;
module.exports.deleteLabelOnIssue = deleteLabelOnIssue;
module.exports.openIssueExists = openIssueExists;
module.exports.config = config;
module.exports.getUser = getUser;
module.exports.closeIssue = closeIssue;
module.exports.updateMessage = updateMessage;
module.exports.getMessage = getMessage;

