const chalk  = require('chalk');
var lib = require('./lib');

if( !lib.config.gh_token )
{
	console.log(chalk`{red.bold GITHUBTOKEN is not defined!}`);
	console.log(`Please set your environment variables with appropriate token.`);
	console.log(chalk`{italic You may need to refresh your shell in order for your changes to take place.}`);
	process.exit(1);
}

// Update status label on issue
async function updateStatusLabelOnIssue(owner, repo, issue, label) {
	var label_ir = "in review";
	var label_test = "in test";
	var label_ip = "in progress"
	var hasStatus = false
	var labelName = ""
	
	issueLabels = await lib.getLabelsOnIssue(owner,repo, issue);
	if (issueLabels.length > 0) {
		for ( var labelIdx in issueLabels ) {	
			// no need to update label
			if ( issueLabels[labelIdx].name === label ) {
				return;
			} else if ( issueLabels[labelIdx].name === label_ir || issueLabels[labelIdx].name === label_ip || issueLabels[labelIdx].name === label_test ) {
				hasStatus = true
				labelName = issueLabels[labelIdx].name
				break;
			} 
		}
	} 
	// delete status label if present
	if (hasStatus) {
		await lib.deleteLabelOnIssue(owner, repo, issue, labelName);
	}
	await lib.addLabelOnIssue(owner, repo, issue, label);
}

module.exports.updateStatusLabelOnIssue = updateStatusLabelOnIssue;


