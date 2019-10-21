var request = require('request');
const got  = require('got');

var lib = require('./lib');

async function recommendAssignee(data) {

	// get work load for each user
	var workLoad = await getWorkLoad(data.owner, data.repo);

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
	var channel_id = await lib.createChannel(data.creator);

	// var channel_id = "xyz";

	var data_assignee = {
		"channel_id": channel_id,
	 	"message": "Hey! I saw you created an issue, want to assign it to somebody?",
	 	"props": {
			"attachments": [
		     	{
					"pretext": "I suggest these people based on the work load:",
					"text": "Assignee recommendations",
					"actions": [
				        {
							"name": "Select an option...",
							"integration": {
								"url": "http://de305d48.ngrok.io/triggers/",
								"context": {
									"action": "ASSIGN",
									"owner": data.owner,
									"creator": data.creator,
									"issue_id": data.issue_id,
									"repo": data.repo
								}
							},
							"type": "select",
							"options" : recommendations
						}, 
						{
							"name": "Ignore",
							"integration": {
								"url": "http://de305d48.ngrok.io/triggers/",
								"context": {
									"action": "IGNORE_ASSIGN",
									"creator": data.creator
								}
							}
						}
					]
				}
			]
		}
	}

	console.log(data_assignee);

	lib.sendResponse(data_assignee);
}

async function getWorkLoad(owner, repo) {

	// get issues for all users
	var issueList = await lib.getOpenIssues(owner, repo);
	// console.log(issueList);

	//get all users
	var userList = await lib.getCollaborators(owner, repo);

	var collaborators = {}

	for (var index in userList) {
		collaborators[userList[index].login] = 0;
	}	

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

		// console.log(data);

		lib.sendResponse(data);

	} else {

		var data = {
			"channel_id": channel_id,
		 	"message": "Assigned successfully!"
		}

		// console.log(data);

		lib.sendResponse(data);
	}

}

async function ignoreRecommendations(creator) {

	var channel_id = await lib.createChannel(creator);

	var data = {
		"channel_id": channel_id,
	 	"message": "All those CPU cycles for nothing! Okay :(",

	}

	lib.sendResponse(data);
}

// recommendAssignee("asmalunj", "test_repo", "asmalunj");
// assign("asmalunj", "test_repo", 6, "asmalunj", "vbbhadra");

module.exports.recommendAssignee = recommendAssignee;
module.exports.getWorkLoad = getWorkLoad;
module.exports.assign = assign;
module.exports.ignoreRecommendations = ignoreRecommendations;
