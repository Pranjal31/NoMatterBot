var lib = require('./lib');
var storage_lib = require('./storage_lib.js');
var md = require('./messages');

const numrec = 3			// default number of recommendations
const smnumrec = 10			// "show more" number of recommendations

// get number of matches between user's skills and issue's required skills
async function getMatchedSkills(owner, repo, user, issueId ) {
	var numMatchedSkills = 0
	
	// get user skills
	const userSkills = await storage_lib.getUserSkills(user)

	// get skills required for issue
	issue = await lib.getIssue(owner, repo, issueId)
	if( issue.body && issue.body.toLowerCase().includes('skills:') ) {
		var issueBody = issue.body.toLowerCase();

		// use the last occurence of 'skills:' for the skill list
		var issueSkillsStr = issueBody.substring(issueBody.lastIndexOf('skills:'));
		issueSkillsStr = issueSkillsStr.split('skills:')[1];
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

    // get all repos owned by the bot account
	var repos = await lib.getAccessibleRepos()

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
	const bonusScore = 2 * weightLoad		// bonus score if a candidate has no workload

	// get list of assignment candidates
	var assignCandidates = await lib.getCollaborators(data.owner, data.repo);
	workloadsDict = {}
	matchedSkillsDict = {}
	recoScoreDict = {}
	var recommendations = []

	if (assignCandidates[0] == undefined) {

		return;		
	}

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
	if(numOptions === numrec) {
	
		// retain only top k recommendations
		var sortedRecoScoreDict = scores.slice(0, numOptions);
		for ( recoScoreIdx in sortedRecoScoreDict ) {
			var menu_data = {
				"text": sortedRecoScoreDict[recoScoreIdx][0] ,
				"value": sortedRecoScoreDict[recoScoreIdx][0]
			}
			recommendations[recoScoreIdx] = menu_data; 
		} 

		data.recommendations = recommendations;

		var data_assignee = {
			"channel_id": channel_id,
		 	"message": await md.generateMsg(md.msg.ar_suggest1, data),
		 	"props": await md.getMessage_ar_suggest1(data)
		}
	// Path to take when user selects show more assignees
	} else{

		// If there is no change in original recommendation
		if(scores.length <= numrec) {

			var data_assignee = {
				"channel_id": channel_id,
			 	"message": md.msg.ar_no_sm
			}

		} else {

			await modifyMessage(data.post_id)
			
			// Display all recommendations
			for ( recoScoreIdx in scores ) {
				var menu_data = {
					"text": scores[recoScoreIdx][0] ,
					"value": scores[recoScoreIdx][0]
				}
				recommendations[recoScoreIdx] = menu_data; 
			} 

			data.recommendations = recommendations;

			var data_assignee = {
				"channel_id": channel_id,
			 	"message": await md.generateMsg(md.msg.ar_suggest2, data), 
			 	"props": await md.getMessage_ar_suggest2(data)
			}
		}
	}

	let response_body = await lib.postMessage(data_assignee);
    return response_body.id;
}

async function assign(owner, repo, issue_id, creator, assignee, post_id) {

	var channel_id = await lib.createChannel(creator);

	var status = await lib.assignToIssue(owner, repo, issue_id, assignee);

	await modifyMessage(post_id);

	if(status == 200) {

		var data = {
			"channel_id": channel_id,
		 	"message": md.msg.ar_done
		}

		response_body = await lib.postMessage(data);

	} else {

		var data = {
			"channel_id": channel_id,
		 	"message": md.msg.msg_500
		}

		response_body = await lib.postMessage(data);
	}

	return response_body.id;

}

async function moreRecommendations(owner, repo, issue_id, creator, post_id) {

	var data = {};

    data.owner = owner;
    data.repo = repo;
    data.issue_id = issue_id;
    data.creator = creator;
    data.post_id = post_id;

	await recommendAssignee(data, smnumrec);
}

async function ignoreRecommendations(creator, post_id) {

	var channel_id = await lib.createChannel(creator);

	await modifyMessage(post_id);

	var data = {
		"channel_id": channel_id,
	 	"message": md.msg.ar_ignore
	}

	response_body = await lib.postMessage(data);
	return response_body.id;
}

async function modifyMessage(post_id) {

	var old_msg = JSON.parse(await lib.getMessage(post_id));

	var new_props = {
		"attachments": [
	     	{
				"pretext": old_msg.props.attachments[0].pretext,
				"text": old_msg.props.attachments[0].text,
				"actions": []
			}
		]
	}

	for(var i = 0; i < old_msg.props.attachments[0].actions.length; i++) {

		new_props.attachments[0].actions[i] = {};

		new_props.attachments[0].actions[i].name = old_msg.props.attachments[0].actions[i].name;
		new_props.attachments[0].actions[i].integration = {
			"url" : "",
			"context" : {}
		};
		if(old_msg.props.attachments[0].actions[i].type != null){
			new_props.attachments[0].actions[i].type = old_msg.props.attachments[0].actions[i].type;
		}
		if(old_msg.props.attachments[0].actions[i].options != null){
			new_props.attachments[0].actions[i].options = old_msg.props.attachments[0].actions[i].options;
		}

	}

	var updated_msg = {

		"id" : post_id,
		"message" : old_msg.message,
		"props" : new_props
	}

	await lib.updateMessage(post_id, updated_msg);
}

module.exports.recommendAssignee = recommendAssignee;
module.exports.assign = assign;
module.exports.ignoreRecommendations = ignoreRecommendations;
module.exports.moreRecommendations = moreRecommendations;
