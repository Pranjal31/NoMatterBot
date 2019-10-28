var request = require('request');
const got  = require('got');

var lib = require('./lib');

async function recommendAssignee(data) {
	const weightSkill = 0.5
	const weightLoad = 0.5
	const bonusScore = 1
	const numOptions = 3

	// get list of assignment candidates
	var assignCandidates = await lib.getCollaborators(owner, repo);
	workloadsDict = {}
	matchedSkillsDict = {}
	recoScoreDict = {}
	var recommendations = []

	for (var candidate in assignCandidates) {
		var recoScore = 0

		// get workload (number of assigned issues) for candidate
		workloadsDict[candidate] = await getWorkLoad(data.owner, data.repo, candidate);
	
		// get number of matched skills for candidate
		matchedSkillsDict[candidate] = await getMatchedSkills( data.owner, data.repo, candidate, data.issue_id)
	
		// compute recommendation score for candidate
		if ( workloadsDict[candidate] == 0 ) {
			recoScore = weightSkill * matchedSkillsDict[candidate] + bonusScore 	// candidate has no assigned issues 
		} else {
			recoScore = weightSkill * matchedSkillsDict[candidate] + weightLoad / workloadsDict[candidate]
		}
		recoScoreDict[candidate] = recoScore
	}

	// sort the recommendations based on score
	var scores = Object.keys(recoScoreDict).map(function(key) {
		return [key, recoScoreDict[key]];
  	});
  
  	scores.sort(function(first, second) {
		return second[1] - first[1];
  	});
  
	// retain only top k recommendations
  	recommendations = scores.slice(0, numOptions);

	// send to front end
	var channel_id = await lib.createChannel(data.creator);

	var data_assignee = {
		"channel_id": channel_id,
	 	"message": "Ciao! I see that you recently created an issue #" + data.issue_id + " with title: " + data.issue_title,
	 	"props": {
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
							"options" : recommendations
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
	}

	let response_body = await lib.postMessage(data_assignee);

    return response_body.id;
}

async function getMatchedSkills(owner, repo, user, issueId ) {
	// number of matched skills
	var numMatchedSkills = 0
	
	// get user skills
	// TODO: replace me with a DB call; make use of 'user' variable
	const userSkills = ['js', 'python', 'mysql']

	// get skills required for issue
	issue = await getIssue(owner, repo, issueId)
	if( issue.body && issue.body.toLowerCase().includes('skills:') ) {
		issueSkillsStr = issue.body.toLowerCase().split('skills:')[1]
		var issueSkills = issueSkillsStr.split(",").map(item => item.trim());

		// do pairwise matching for issue and user skills
		for ( userSkill in userSkills ) {
			for ( issueSkill in issueSkills) {
				if ( issueSkill === userSkill ) {
					numMatchedSkills += 1
				}
			}
		}
	} 
	return numMatchedSkills
}

async function getWorkLoad(owner, repo, user) {

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


async function getWorkLoadOld(owner, repo) {

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
		 	"message": "Done and dusted!"
		}

		// console.log(data);

		response_body = await lib.postMessage(data);

	} else {

		var data = {
			"channel_id": channel_id,
		 	"message": "Sorry, something went wrong."
		}

		// console.log(data);

		response_body = await lib.postMessage(data);
	}

	return response_body.id;

}

async function ignoreRecommendations(creator) {

	var channel_id = await lib.createChannel(creator);

	var data = {
		"channel_id": channel_id,
	 	"message": "All those CPU cycles for nothing? Okay :("

	}

	response_body = await lib.postMessage(data);
	return response_body.id;
}

module.exports.recommendAssignee = recommendAssignee;
module.exports.getWorkLoad = getWorkLoad;
module.exports.assign = assign;
module.exports.ignoreRecommendations = ignoreRecommendations;
