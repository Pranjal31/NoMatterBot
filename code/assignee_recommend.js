var request = require('request');
var HashMap = require('HashMap');
const got  = require('got');

var lib = require('./lib');

const token = "token " + "YOUR TOKEN";
const githubUrl = "https://api.github.com";

const chalk  = require('chalk');

var config = {};

const data = require("./mockIssues.json");

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

async function recommendAssignee(owner, repo, creator) {

	// get issues for all users
	var issueList = await lib.getIssues(owner, repo);

	//get all users
	var userList = await lib.getCollaborators(owner, repo);

	var collaborators = {}

	for (var index in userList) {
		collaborators[userList[index].login] = 0;
	}

	// get work load for each user
	var workLoad = getWorkLoad(issueList, collaborators);

	console.log(workLoad);
	// send to front end
	var channel_id = lib.createChannel(creator);

	var data = {
		"channel_id": channel_id,
	 	"message": "Assignee recommendation",
	 	"props": {
			"attachments": [
		     	{
					"pretext": "Look some text",
					"text": "This is text"
				}
			]
		}
	}

	// lib.sendResponse("POST", data);

}

function getWorkLoad(issueList, collaborators) {

	for (var index in issueList) {
 
		if (issueList[index].state == "open" && issueList[index].pull_request == null) {
			var assignees_list = issueList[index].assignees;
			for (var assignee_index in assignees_list) {
				var assignee = assignees_list[assignee_index].login;
				if (!(assignee in collaborators)) {
					collaborators[assignee] = 0;
				}
				collaborators[assignee] += 1;
			}
		}
	}

	var sorted_workLoad = [];
	for (var assignee in collaborators) {
	    sorted_workLoad.push([assignee, collaborators[assignee]]);
	}

	sorted_workLoad.sort(function(a, b) {
	    return a[1] - b[1];
	});

	return sorted_workLoad;
}

async function assign(owner, repo, issue_id, creator, assignee) {

	var channel_id = lib.createChannel(creator);

	var status = await lib.assignToIssue(owner, repo, issue_id, assignee);

	if(status == 200) {

		var data = {
			"channel_id": channel_id,
		 	"message": "Assignee recommendation success"
		}

		console.log(data);

		// lib.sendResponse("POST", data);

	} else {

		var data = {
			"channel_id": channel_id,
		 	"message": "Assignee recommendation failure"
		}

		console.log(data);

		// lib.sendResponse("POST", data);
	}

}

function ignoreRecommendations(creator) {

	var channel_id = lib.createChannel(creator);

	var data = {
		"channel_id": channel_id,
	 	"message": "Assignee recommendation ignored",

	}

	lib.sendResponse("POST", data);
}

recommendAssignee("asmalunj", "test_repo", "asmalunj");
assign("asmalunj", "test_repo", 6, "asmalunj", "vbbhadra");
