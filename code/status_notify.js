var lib = require('./lib');

var data = {}

//Function to notify changes in Issue status
async function notifyStatChange(recipient, repo, issueNum, issueTitle, newStatus)
{
    //create private Mattermost channel with user to post message to
    data.channel_id = await lib.createChannel(recipient);
    data.message = "Issue: #" + issueNum + " " + issueTitle + " in repo: " + repo + " is now " + newStatus;

    //send message on Mattermost channel
    var respBody = await lib.postMessage(data);

    //console.log(data.message);
    
    return respBody.id;
}

module.exports.notifyStatChange = notifyStatChange;
