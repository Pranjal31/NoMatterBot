var request = require('request');
const chalk  = require('chalk');

// NCSU Enterprise endpoint:
//var ghRoot = "https://api.github.ncsu.edu";
//var config = {};

// Retrieve our api token from the environment variables.
//config.gh_token = process.env.GITHUBTOKEN;

if( !config.gh_token )
{
	console.log(chalk`{red.bold GITHUBTOKEN is not defined!}`);
	console.log(`Please set your environment variables with appropriate token.`);
	console.log(chalk`{italic You may need to refresh your shell in order for your changes to take place.}`);
	process.exit(1);
}

console.log(chalk.green(`Your token is: ${config.gh_token.substring(0,4)}...`));

// Delete all labels and add a new label
async function updateLabelForIssue(userId, repo, issue, label){
    await deleteLabelsForIssue(userId, repo, issue);
    await addLabelToIssue(userId, repo, issue,label);
}

// Delete all labels for issue
async function deleteLabelsForIssue(owner,repo, issue)
{
	console.log(chalk.green("\nDelete Issue Labels"));

    let options = getDefaultOptions(config.githubUrl, "/repos/"+owner+"/"+repo+"/issues/"+issue+"/labels", "DELETE");

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
	console.log(chalk.green("\nAdd Label to Issue"));

    let options = getDefaultOptions(config.githubUrl, "/repos/"+owner+"/"+repo+"/issues/"+issue+"/labels", "POST");
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

module.exports.deleteLabelsForIssue = deleteLabelsForIssue;
module.exports.addLabelToIssue = addLabelToIssue;
module.exports.updateLabelForIssue = updateLabelForIssue;


