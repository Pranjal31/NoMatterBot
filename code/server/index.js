const express = require('express')
const status_change = require('../statuschange')
const lib = require('../lib')

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

    console.log(JSON.stringify(req_body));
    res.send(`Received event. ${JSON.stringify(req.body)}`);
});

app.post('/triggers/', function (req, res) {
    var req_body = req.body

    if (req_body.trigger_id) {
        var data = {
            "trigger_id": req_body.trigger_id,
            "url": "http://808a9ed1.ngrok.io/triggers/",
            "dialog": {
              "callback_id": "1",
              "title": "Lol",
              "elements": [{ "display_name": "Email", "name": "email", "type": "text", "subtype": "email", "placeholder": "placeholder@example.com" }],
              "submit_label": "submit",
              "notify_on_cancel": false,
              "state": "test"
            }
          }
          status_change.openInteractiveDialog(data)
    }

    console.log(JSON.stringify(req_body));
    res.send(`Received trigger. ${JSON.stringify(req.body)}`);
});

app.listen(port, () => console.log(`NoMatterBot server listening on port ${port}!\n`))