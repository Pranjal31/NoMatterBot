var lib = require('./lib');

// Update status label on issue
function isStatusLabel(labelName) {
	var label_ir = "in review";
	var label_test = "in test";
	var label_ip = "in progress"
	return ( labelName === label_ir || labelName === label_ip || labelName === label_test )
}

// Update status label on issue
async function updateStatusLabelOnIssue(owner, repo, issue, label) {
	issueLabels = await lib.getLabelsOnIssue(owner,repo, issue);
	if ( issueLabels.length > 0 ) {
		var labelName = ""
		// delete any existing status labels
		for ( var labelIdx in issueLabels ) {
			labelName = issueLabels[labelIdx].name.toLowerCase()
			if ( isStatusLabel(labelName) ) {
				await lib.deleteLabelOnIssue(owner, repo, issue, labelName);
			}
		}
	} 
	// add desired status label
	await lib.addLabelOnIssue(owner, repo, issue, label);
}

module.exports.updateStatusLabelOnIssue = updateStatusLabelOnIssue;