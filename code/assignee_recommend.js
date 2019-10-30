var request = require('request');
const got  = require('got');

var lib = require('./lib');


 (async () => {
     await getWorkLoad("psharma9", "psharma9");
 })(); 

// get number of matches between user's skills and issue's required skills
async function getMatchedSkills(owner, repo, user, issueId ) {
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

// get number of issues assigned to the user
async function getWorkLoad(owner, user) {
	var workload = 0

	//get all repos for owner
	var repos = await lib.getRepos(owner)

	for ( var repoIdx in repos ) {		
		// get issues for all users
		var issueList = await lib.getOpenIssues(owner, repos[repoIdx].name);

		// find issues assigned to user that are currently open
		for ( var index in issueList ) {
			if ( issueList[index].state === "open" && issueList[index].assignee && issueList[index].assignee.login === user ) {
				workload += 1
			}
		}
	}
	return workload
}

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
		workloadsDict[candidate] = await getWorkLoad(data.owner, candidate);
	
		// get number of matched skills for candidate
		matchedSkillsDict[candidate] = await getMatchedSkills( data.owner, data.repo, candidate, data.issue_id)
	
		// compute recommendation score for candidate
		if ( workloadsDict[candidate] == 0 ) { 		// candidate has no assigned issues, must be strongly considered for assignment
			recoScore = weightSkill * matchedSkillsDict[candidate] + bonusScore 	
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

async function assign(owner, repo, issue_id, creator, assignee) {

	var channel_id = await lib.createChannel(creator);

	var status = await lib.assignToIssue(owner, repo, issue_id, assignee);

	if(status == 200) {

		var data = {
			"channel_id": channel_id,
		 	"message": "Done and dusted!"
		}

		response_body = await lib.postMessage(data);

	} else {

		var data = {
			"channel_id": channel_id,
		 	"message": "Sorry, something went wrong."
		}

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
module.exports.getMatchedSkills = getMatchedSkills;
module.exports.getWorkLoad = getWorkLoad;
module.exports.assign = assign;
module.exports.ignoreRecommendations = ignoreRecommendations;
