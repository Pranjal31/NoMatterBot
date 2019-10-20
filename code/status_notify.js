var lib = require('./lib');
var server = require('./server/index.js')

var config = {};

// Retrieve our api token from the environment variables.
config.channel = process.env.CHANNELID;

var data = {}
data.channel_id = config.channel;

function notify_change(post_body)
{
    var msg = ""

    if (post_body.action === 'opened')
    {
        msg = "A new Issue: #" + post_body.issue.number + " " + post_body.issue.title + " was opened in " + post_body.repository.name;
    }
    else if(post_body.action === 'labeled')
    {
        msg = "Issue: #" + post_body.issue.number + " " + post_body.issue.title + " is now " + post_body.label.name;
    }
    else if(post_body.action === 'closed')
    {
        msg = "Issue: #" + post_body.issue.number + " " + post_body.issue.title + " is now closed";
    }
    else
    {
        return;
    }

    data.message = msg;
    lib.sendResponse("POST", data)
}

module.exports.notify_change = notify_change;