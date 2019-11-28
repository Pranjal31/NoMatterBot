var lib = require('./lib');

const msg = {

	msg_500 : "Sorry, something went wrong.",

	ar_done : "Done and dusted!",
	ar_ignore : "All those CPU cycles wasted for nothing? Okay :(",
	ar_no_sm : "Nope, that's all I have. Sorry :(",
	ar_suggest1 : "Ciao! I see that you recently created an issue #issue_id with title: issue_title",
	ar_suggest2 : "Here are all of the assignees I can think of for issue #issue_id",

	lib_env_1 : "Please set your environment variables with appropriate values.",
	lib_env_2 : "italic You may need to refresh your shell in order for your changes to take place.",

	stale_message : "Hey, Bot's up? \n The following open issues have had no activity in the last 6 months.",
	stale_gh_token : "red.bold GITHUBTOKEN is not defined!",
	stale_ignore : "Alright! These issues(s) have been ignored for a day."
}

async function getMessage_ar_suggest1(data) {

	var suggest1 = {
		"attachments": [
	     	{
				"pretext": "Here are some assignee recommendations based on current workload:",
				"text": "Assignee recommendations",
				"actions": [
			        {
						"name": "Select an option...",
						"integration": {
							"url": lib.config.server + "/triggers/",
							"context": {
								"action": "ASSIGN",
								"owner": data.owner,
								"creator": data.creator,
								"issue_id": data.issue_id,
								"repo": data.repo
							}
						},
						"type": "select",
						"options" : data.recommendations
					}, 
					{
						"name": "Show more",
						"integration": {
							"url": lib.config.server + "/triggers/",
							"context": {
								"action": "MORE_SUGGESTIONS",
								"owner": data.owner,
								"creator": data.creator,
								"issue_id": data.issue_id,
								"repo": data.repo
							}
						}
					}, 
					{
						"name": "Ignore",
						"integration": {
							"url": lib.config.server + "/triggers/",
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

	return suggest1;
} 

async function getMessage_ar_suggest2(data) {

	var suggest2 = {
		"attachments": [
	     	{
				"pretext": "All assignee recommendations based on current workload:",
				"text": "Assignee recommendations",
				"actions": [
			        {
						"name": "Select an option...",
						"integration": {
							"url": lib.config.server + "/triggers/",
							"context": {
								"action": "ASSIGN",
								"owner": data.owner,
								"creator": data.creator,
								"issue_id": data.issue_id,
								"repo": data.repo
							}
						},
						"type": "select",
						"options" : data.recommendations
					},
					{
						"name": "Ignore",
						"integration": {
							"url": lib.config.server + "/triggers/",
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

	return suggest2;
}

async function generateMsg(msg, data){
    var re = new RegExp(Object.keys(data).join("|"),"gi");

    return msg.toString().replace(re, function(matched){
        return data[matched.toLowerCase()];
    });
}

module.exports.msg = msg;
module.exports.generateMsg = generateMsg;
module.exports.getMessage_ar_suggest1 = getMessage_ar_suggest1;
module.exports.getMessage_ar_suggest2 = getMessage_ar_suggest2;
