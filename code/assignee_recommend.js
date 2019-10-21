var request = require('request');
var HashMap = require('HashMap');
const got  = require('got');

var lib = require('./lib');

async function recommendAssignee(owner, repo, creator) {

	// get issues for all users
	var issueList = await lib.getOpenIssues(owner, repo);

	//get all users
	var userList = await lib.getCollaborators(owner, repo);

	var collaborators = {}

	for (var index in userList) {
		collaborators[userList[index].login] = 0;
	}

	// get work load for each user
	var workLoad = getWorkLoad(issueList, collaborators);

	var recommendations = [];

	for (var index in workLoad) {
		if (index < 3) {
			var json_data = {
				"text": workLoad[index][0] ,
				"value": workLoad[index][0]
			}
			recommendations[index] = json_data; 
		}
	}

	// send to front end
	var channel_id = await lib.createChannel(creator);

	var data = {
		"channel_id": channel_id,
	 	"message": "Hey! I saw you created an issue, want to assign to somebody?",
	 	"props": {
			"attachments": [
		     	{
					"pretext": "I suggest these people based on the work load:",
					"text": "Assignee recommendations",
					"actions": [
				        {
							"name": "Select an option...",
							"integration": {
								"url": "http://127.0.0.1:7357/action_options",
								"context": {
									"action": "do_something"
								}
							},
							"type": "select",
							"options" : recommendations
						}
					]
				}
			]
		}
	}

	lib.sendResponse(data);
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

	var channel_id = await lib.createChannel(creator);

	var status = await lib.assignToIssue(owner, repo, issue_id, assignee);

	if(status == 200) {

		var data = {
			"channel_id": channel_id,
		 	"message": "Assignee recommendation success"
		}

		console.log(data);

		// lib.sendResponse(data);

	} else {

		var data = {
			"channel_id": channel_id,
		 	"message": "Assignee recommendation failure"
		}

		console.log(data);

		// lib.sendResponse(data);
	}

}

async function ignoreRecommendations(creator) {

	var channel_id = await lib.createChannel(creator);

	var data = {
		"channel_id": channel_id,
	 	"message": "Assignee recommendation ignored",

	}

	lib.sendResponse(data);
}

recommendAssignee("asmalunj", "test_repo", "asmalunj");
assign("asmalunj", "test_repo", 6, "asmalunj", "vbbhadra");
