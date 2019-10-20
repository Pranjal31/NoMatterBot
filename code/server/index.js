const express = require('express')
const status_change = require('../statuschange')
const app = express()
const port = 3000

var label_ir = "in review";
var label_test = "test";

// express configuration
app.use(express.json({type: '*/*'}));

// set routes
app.post('/events/', function (req, res) {
    var req_body = req.body

    if (req_body.pull_request) {
        var userId = req_body.pull_request.user.login

        var repo = req_body.pull_request.head.repo.name;
        var issue = req_body.pull_request.title.split('-')[0].trim()

        if (req_body.action === 'opened'){
            status_change.updateLabelForIssue(userId, repo, issue, label_ir);
        } else if(req_body.action === 'closed') {
            status_change.updateLabelForIssue(userId, repo, issue, label_test);
        }
    }

    res.send(`Received event. ${JSON.stringify(req.body)}`);
});

app.listen(port, () => console.log(`NoMatterBot server listening on port ${port}!\n`))