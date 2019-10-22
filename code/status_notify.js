var lib = require('./lib');

var data = {}

async function notify_change(post_body)
{
    var msg = "";

    var chId = await lib.createChannel("abcd");
    data.channel_id = chId;

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
    var respBody = await lib.postMessage(data);

    return respBody.id;
}

module.exports.notify_change = notify_change;
