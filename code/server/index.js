const express = require('express');
const dbConnManager = require('../dbConnManager');
const status_change = require('../statuschange');
const recommend_assignee = require('../assignee_recommend.js');
const stale = require('../stale.js');
const cron = require("node-cron");
const notifier = require('../status_notify');

const app = express()
const port = 3000;

var label_ir = "in review";
var label_test = "in test";
var label_ip = "in progress"

const numrec = 3      // default number of recommendations

// express configuration
app.use(express.json({type: '*/*'}));

// set routes
app.post('/events/', function (req, res) {
  var req_body = req.body

  // on pull-request event
  if ( req_body.pull_request ) {
    // change issue status only if PR title is in expected format
    if ( req_body.pull_request.title.includes('-') ) {
      var issue = req_body.pull_request.title.split('-')[0].trim()
      // change issue status only if PR title is in expected format
      if ( !isNaN(Number(issue)) ) {
        var owner = req_body.pull_request.head.repo.owner.login
        var repo = req_body.pull_request.head.repo.name;
        if ( req_body.action === 'opened' ){
          status_change.updateStatusLabelOnIssue(owner, repo, issue, label_ir);
        } else if( req_body.action === 'closed' ) {
            status_change.updateStatusLabelOnIssue(owner, repo, issue, label_test);
        }
      }
    }
  }

    // on issue-related event
    if (req_body.issue) {
      // on issue open with no assignee
      if (req_body.action === "opened" && !req_body.issue.assignees.length) {

        var data = {};

        data.owner = req_body.repository.owner.login;
        data.repo = req_body.repository.name;
        data.issue_id = req_body.issue.number;
        data.issue_title = req_body.issue.title;
        data.creator = req_body.issue.user.login;
        
        recommend_assignee.recommendAssignee(data, numrec);
      }
      // on issue status change or issue close
      else if((req_body.action === "labeled" && (req_body.label.name === label_ip 
                || req_body.label.name === label_ir || req_body.label.name === label_test)) 
                || req_body.action === "closed")
      {
        var repo = req_body.repository.name;
        var issueNum = req_body.issue.number;
        var issueTitle = req_body.issue.title;
        var newStatus = null;
        var recipient = null;

        if(!req_body.issue.assignee)
        {
          recipient = req_body.issue.user.login;
        }
        else
        {
          recipient = req_body.issue.assignee.login;
        }
        
        if (req_body.action === "closed")
        {
          newStatus = req_body.action;
        }
        else
        {
          newStatus = req_body.label.name;
        }
        
        //notifier.notifyStatChange(recipient, repo, issueNum, issueTitle, newStatus);
        
      }

    }

    console.log(JSON.stringify(req_body));
    res.send(`Received event. ${JSON.stringify(req.body)}`);
});

app.post('/triggers/', function (req, res) {
    var req_body = req.body
    
    //if it is a user's reponse on Mattermost 
    if (req_body.trigger_id) {

      if (req_body.context.action == "ASSIGN") {

        var data = req_body.context;

        recommend_assignee.assign(data.owner, data.repo, data.issue_id, data.creator, data.selected_option, req_body.post_id);

      }

      if (req_body.context.action == "MORE_SUGGESTIONS") {

          var data = req_body.context;

          recommend_assignee.moreRecommendations(data.owner, data.repo, data.issue_id, data.creator, req_body.post_id);
      }

      if (req_body.context.action == "IGNORE_ASSIGN") {
          recommend_assignee.ignoreRecommendations(req_body.context.creator, req_body.post_id);
      }
      
      //if user chooses to close all stale issues
      if(req_body.context.action === "CLOSE_ALL")
      {
        var data = req_body.context;
        stale.closeStaleIssues(data.owner, data.issueData, data.recipient)
      }
      
      //if user chooses to close one stale issue
      if (req_body.context.action === "STALE_CLOSE")
      {
        var data = req_body.context;
        var issueData = {};
        issueData[data.repo] = [data.issueNum];
        stale.closeStaleIssues(data.owner, issueData, data.recipient);
      }
 
      //If user chooses to ignore stale issue reminder
      if(req_body.context.action === "STALE_IGNORE")
      {
        var data = req_body.context;
        stale.ignoreAll(data.recipient);
      }
    }

    console.log(JSON.stringify(req_body));
    res.send(`Received trigger. ${JSON.stringify(req.body)}`);

});
/*
//"* * * * *" for every min===>demo purposes
// "59 59 23 * * *" for every 23:59:59 seconds
cron.schedule("* * * * *", function(){
  console.log("Running CronJob, Initiating stale Issues check");
  (async () => {			
    await stale.Stale_Issues();
  
    })()
});

app.listen(port, () => console.log(`NoMatterBot server listening on port ${port}!\n`));

function shutDown()
{
  dbConnManager.endDBConn();
  process.exit(1);
}

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);
}); 
*/
app.listen(port, () => console.log(`NoMatterBot server listening on port ${port}!\n`))
