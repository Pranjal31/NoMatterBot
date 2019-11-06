var request = require('request');
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
	
	issueLabels = await lib.getLabelsOnIssue(owner,repo, issue)
	if (issueLabels.length > 0) {
		for ( var labelIdx in issueLabels ) {	
			// no need to update label
			if ( issueLabels[labelIdx].name === label ) {
				return;
			} else if ( issueLabels[labelIdx].name === label_ir || issueLabels[labelIdx].name === label_ip || issueLabels[labelIdx].name === label_test ) {
				await deleteLabelOnIssue(owner, repo, issue, issueLabels[labelIdx].name);
				await addLabelToIssue(owner, repo, issue, label);
				return;
			}
		}

	} else {
		await addLabelToIssue(owner, repo, issue, label);
	}
}

// Delete all labels for issue
async function deleteLabelOnIssue(owner,repo, issue, label) {
    let options = lib.getDefaultOptions(lib.config.githubUrl, "/repos/"+owner+"/"+repo+"/issues/"+issue+"/labels/" + label, "DELETE");

	// Send a http request to url and specify a callback that will be called upon its return.
	return new Promise(function(resolve, reject)
	{
        request.delete(options, function(error, response, body){
			if(error){
				console.log(chalk.red(error));
				reject(error);
				return; // Terminate execution
            }
            console.log(response.body);
			console.log(`Response Status Code ${response.statusCode}`);
			resolve(response.statusCode);
		});
	});
}

// add a label for issue
async function addLabelToIssue(owner,repo, issue, label)
{
    let options = lib.getDefaultOptions(lib.config.githubUrl, "/repos/"+owner+"/"+repo+"/issues/"+issue+"/labels", "POST");
    options.body = `{"labels":["${label}"]}`;

	// Send a http request to url and specify a callback that will be called upon its return.
	return new Promise(function(resolve, reject)
	{
		request.post(options, function(error, response, body){
			if(error){
				console.log(chalk.red(error));
				reject(error);
				return; // Terminate execution
            }
            console.log(response.body);
			console.log(`Response Status Code ${response.statusCode}`);
			resolve(response.statusCode);
		});
	});
}

module.exports.updateStatusLabelOnIssue = updateStatusLabelOnIssue;


