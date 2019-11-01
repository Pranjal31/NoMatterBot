const express = require('express');
const status_change = require('../statuschange');
const recommend_assignee = require('../assignee_recommend.js');
const stale = require('../stale.js');
const notifier = require('../status_notify');

const app = express()
const port = 3000;

var label_ir = "in review";
var label_test = "in test";
var label_ip = "in progress"

// express configuration
app.use(express.json({type: '*/*'}));

// set routes
app.post('/events/', function (req, res) {
    var req_body = req.body

    //on pull-request event
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

    //on issue-related event
    if (req_body.issue) {
      //on issue open with no assignee
      if (req_body.action === "opened" && !req_body.issue.assignees.length) {

        var data = {};

        data.owner = req_body.repository.owner.login;
        data.repo = req_body.repository.name;
        data.issue_id = req_body.issue.number;
        data.issue_title = req_body.issue.title;
        data.creator = req_body.issue.user.login;

        recommend_assignee.recommendAssignee(data);
      }
      //on issue status change or issue close
      else if((req_body.action === "labeled" && (req_body.label.name === label_ip 
                || req_body.label.name === label_ir || req_body.label.name === label_test)) 
                || req_body.action === "closed")
      {
        var assignee = req_body.issue.assignees[0].login;
        var repo = req_body.repository.name;
        var issueNum = req_body.issue.number;
        var issueTitle = req_body.issue.title;
        var newStatus = null;
        
        if (req_body.action === "closed")
        {
          newStatus = req_body.action;
        }
        else
        {
          newStatus = req_body.label.name;
        }
        
        notifier.notifyStatChange(assignee, repo, issueNum, issueTitle, newStatus);
        
      }

    }

    console.log(JSON.stringify(req_body));
    res.send(`Received event. ${JSON.stringify(req.body)}`);
});

app.post('/triggers/', function (req, res) {
    var req_body = req.body

    
    if (req_body.trigger_id) {

      if (req_body.context.action == "ASSIGN") {

        var data = req_body.context;

        recommend_assignee.assign(data.owner, data.repo, data.issue_id, data.creator, data.selected_option);

      }

      if (req_body.context.action == "IGNORE_ASSIGN") {
          recommend_assignee.ignoreRecommendations(req_body.context.creator);
      }

        // not used in this milestone because of existing issue with Mattermost (https://forum.mattermost.org/t/cannot-open-dialog/7842)
         /* var data = {
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
           status_change.openInteractiveDialog(data) */

           if (req_body.context.action == "STALE_CLOSE")
           {
             var data = req_body.context;
             console.log("In assign");
             stale.close_all();
           }
 
           if(req_body.context.action == "STALE_IGNORE")
           {
             console.log("In ignore");
             stale.ignore();
            }
    }

    console.log(JSON.stringify(req_body));
    res.send(`Received trigger. ${JSON.stringify(req.body)}`);

});



app.listen(port, () => console.log(`NoMatterBot server listening on port ${port}!\n`))