var lib = require('./lib');
var storage_lib = require('./storage_lib.js');

// get number of matches between user's skills and issue's required skills
async function getMatchedSkills(owner, repo, user, issueId ) {
	var numMatchedSkills = 0
	
	// get user skills
	const userSkills = await storage_lib.getUserSkills(user)

	// get skills required for issue
	issue = await lib.getIssue(owner, repo, issueId)
	if( issue.body && issue.body.toLowerCase().includes('skills:') ) {
		issueSkillsStr = issue.body.toLowerCase().split('skills:')[1]
		var issueSkills = issueSkillsStr.split(",").map(item => item.trim());

		// do pairwise matching for issue and user skills
		for ( userSkill in userSkills ) {
			for ( issueSkill in issueSkills) {
				if ( issueSkills[issueSkill] === userSkills[userSkill] ) {
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

async function recommendAssignee(data, numOptions) {
	const weightSkill = 0.5		// weight for skill factor in recommendation score calculation
	const weightLoad = 0.5		// weight for workload factor  in recommendation score calculation
	const bonusScore = 1		// bonus score if a candidate has no workload

	// get list of assignment candidates
	var assignCandidates = await lib.getCollaborators(data.owner, data.repo);
	workloadsDict = {}
	matchedSkillsDict = {}
	recoScoreDict = {}
	var recommendations = []

	for (var candidateIdx in assignCandidates) {
		var recoScore = 0
		var candidate = assignCandidates[candidateIdx].login;

		// get workload (number of assigned issues) for candidate
		workloadsDict[candidate] = await getWorkLoad(data.owner, candidate);
	
		// get number of matched skills for candidate
		matchedSkillsDict[candidate] = await getMatchedSkills( data.owner, data.repo, candidate, data.issue_id)
	
		// compute recommendation score for candidate
		if ( workloadsDict[candidate] == 0 ) { 		// candidate has zero load, must be strongly considered (accrues bonus score)
			recoScore = weightSkill * matchedSkillsDict[candidate] + bonusScore 	
		} else {
			recoScore = weightSkill * matchedSkillsDict[candidate] + weightLoad / workloadsDict[candidate]
		}
		recoScoreDict[candidate] = recoScore
	}

	var scores = Object.keys(recoScoreDict).map(function(key) {
		return [key, recoScoreDict[key]];
	});

	// sort lexicographically to break any score ties since sort is stable
	scores.sort(function(first, second) {
		return ('' + first[0]).localeCompare(second[0]);
	});
	   
	// sort by scores
  	scores.sort(function(first, second) {
		return second[1] - first[1];
	});

	// send to front end
	var channel_id = await lib.createChannel(data.creator);

	// default path for showing assignee recommendations
	if(numOptions === lib.config.numrec) {
	
		// retain only top k recommendations
		var sortedRecoScoreDict = scores.slice(0, numOptions);
		for ( recoScoreIdx in sortedRecoScoreDict ) {
			var menu_data = {
				"text": sortedRecoScoreDict[recoScoreIdx][0] ,
				"value": sortedRecoScoreDict[recoScoreIdx][0]
			}
			recommendations[recoScoreIdx] = menu_data; 
		} 

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
		}
	// Path to take when user selects show more assignees
	} else{

		// If there is no change in original recommendation
		if(scores.length <= lib.config.numrec) {

			var data_assignee = {
				"channel_id": channel_id,
			 	"message": "Nope, that's all I have. Sorry :("

			}

		} else {
			// Display all recommendations
			for ( recoScoreIdx in scores ) {
				var menu_data = {
					"text": scores[recoScoreIdx][0] ,
					"value": scores[recoScoreIdx][0]
				}
				recommendations[recoScoreIdx] = menu_data; 
			} 

			var data_assignee = {
				"channel_id": channel_id,
			 	"message": "Here are all of the recommendations I can think of for issue #" + data.issue_id, 
			 	"props": {
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

async function moreRecommendations(owner, repo, issue_id, creator) {

	var data = {};

    data.owner = owner;
    data.repo = repo;
    data.issue_id = issue_id;
    data.creator = creator;

	await recommendAssignee(data, lib.config.smnumrec);
}

async function ignoreRecommendations(creator) {

	var channel_id = await lib.createChannel(creator);

	var data = {
		"channel_id": channel_id,
	 	"message": "All those CPU cycles wasted for nothing? Okay :("

	}

	response_body = await lib.postMessage(data);
	return response_body.id;
}

module.exports.recommendAssignee = recommendAssignee;
module.exports.assign = assign;
module.exports.ignoreRecommendations = ignoreRecommendations;
module.exports.moreRecommendations = moreRecommendations;
