const chalk  = require('chalk');
var lib = require('./lib');
var md = require('./messages');

if( !lib.config.gh_token )
{
	console.log(chalk`${md.msg.stale_gh_token}`);
	console.log(`${md.msg.lib_env_1}`);
	console.log(chalk`${md.msg.lib_env_2}`);
	process.exit(1);
}

function sixMonthsPrior(date) {
    //Today's date
    var d = new Date(date);
    // This Month
    var m = d.getMonth();
    // 6 months Prior
    d.setMonth(d.getMonth() - 6);
    // If the new month number isn't m - 6, set to last day of previous month
    // Allow for cases where m < 6
    var diff = (m + 12 - d.getMonth()) % 12;
    if (diff < 6) d.setDate(0)
    
    return d;
  }


async function Stale_Issues()
{
    var list = [];                     // To capture list of Stale Issues
    present = Date();                 //Todays date
    //old = sixMonthsPrior(present);                //Function to compute 6 months old date    
    
    //Un-Comment below line for treating all issues created before now as stale Issues. For Demonstration.
    old = Date.parse(present); 
    old = old - 120000;     // last two minutes
    
    //Un-comment below for treating 6 month old issues as stale issues
    //old = Date.parse(old);   

    var user = await lib.getUser();

    // get the list of repositories owned by the bot account
    var repos = await lib.getAccessibleRepos();
 
    var dict = {};            //{User:{rep:{issue num: issue name}}}
        
    //Loop across all repositories
        for(var repoid in repos){

            //Get Open Issues in each repository
            var obj = await lib.getOpenIssues(repos[repoid].owner.login, repos[repoid].name);
                        
            for( var i = 0; i < obj.length; i++ )
	        {
                if(obj[i].pull_request)
                {
                    continue;
                }
                var updated = obj[i].updated_at;
        
                lm = Date.parse(updated);             //last_modified date of Git hub issue
                  
                if(old>lm)                               //compare threshold and last modified
                {
                   var issue_number = obj[i].number;
                   var reponame= repos[repoid].name;
                   var issue_name = obj[i].title;
                   var repo_owner = obj[i].user.login;
                   var recipent;
                   
                   if(!obj[i].assignee)
                   {
                        recipent = obj[i].user.login;
                   }
                   else
                   {
                        recipent = obj[i].assignee.login;
                   }
                   

                  if(dict[recipent]===undefined)
                   {
                       dict[recipent]= {};
                   }

                   if(dict[recipent][reponame] === undefined)
                   {
                       dict[recipent][reponame] = {};
                       
                       
                   }
                  
                   if(dict[recipent][reponame][issue_number]===undefined)
                   {
                       dict[recipent][reponame][issue_number]= issue_name;
                   }
                }
            }            
    }

    //console.log(dict);            //For debugging

    //Iterate over every assignee in dict 
    for(recipient in dict)
    {
        var issueData = {};             //Used in Close_All

        var message = [];               //For the attachment sent in mattemost

        //Iterate over every Repository for the user in dict
        for(rep in dict[recipient])
        {
            var display;
            display = "Repository : "+ rep;
            issueData[rep] = [];


            for(issue in dict[recipient][rep])
            {
                issueData[rep].push(issue);
                var output="";

                output = "Issue Name : "+dict[recipient][rep][issue]+"     Issue Number : "+issue+"     "+ display;

                var body={
                    //"pretext": "Do you want to close the following issue?",
                    "text": output,   
                    "actions": //message2
                    
                    [
                        {
                            "name": "Close",
                            "integration": {
                                "url":lib.config.server + "/triggers/",
                                "context": {
                                   "action": "STALE_CLOSE",          //Action Item
                                   "repo": rep,                      //Repo name
                                   "issueNum": issue,                //Issue Number
                                   "recipient": recipient,             //Assignee of the issue (as of now. Could be owner if unassigned)
                                   "owner": user.login              //Owner of Repo
                                }
                                
                            } 
                        }
                        
                    ]
                    

                };

                message.push(body);
                 
            }

        }

        var close_all={
            //"pretext": "Click Below to close all the Issues",
            //"text": " Issue Numbers : " + issue_list +"\n Corresponding Repositories: " + repo_list,   
            "actions": //message2
            
            [
                {
                    "name": "Close all Issues",
                    "integration": {
                        "url":lib.config.server + "/triggers/",
                        "context": {
                           "action": "CLOSE_ALL",            //Action Item
                           "recipient": recipient,             //Assignee of the issue (as of now. Could be owner if unassigned)
                           "issueData": issueData,           //Map of {Dict,[list of issues]}
                           "owner": user.login
                         }

                    }
                },
                {
                    "name": "Ignore All",
                    "integration":{
                        "url":lib.config.server + "/triggers/",
                        "context":{
                            "action":"STALE_IGNORE",
                            "repo_name": rep,                //Repo name
                           "issue_number": issue,               //Issue Number
                           "recipient": recipient             //Assignee of the issue (as of now. Could be owner if unassigned)

                        }
                    }
                }
            ]
            

        };

        if(message.length>1)
        {
            message.push(close_all);
        }
        
        //console.log(message);          //For debugging

        //create a channel
        var channel_id = await lib.createChannel(recipient);

        //Create the payload for the message to be posted on Mattermost
        var payload = {
            "channel_id": channel_id,
             "message": md.msg.stale_message, 
             "props": {
                 "attachments": message
             }
            
             
        } 

        
        var respBody = await lib.postMessage(payload);


    }
          
}

function getIssues(){

    const data = require("../code/mockStaleIssues.json");
    return data;
}

//Function to send message to issue owner/assignee if (s)he ignores stale issues reminder
async function ignoreAll(recipient,postid)
{
    var channel_id = await lib.createChannel(recipient);
    var data = {
		"channel_id": channel_id,
	 	"message": md.msg.stale_ignore

    }
    await disableButtons(postid);
    var respBody = await lib.postMessage(data);
    return respBody.id;
}

async function disableButtons(postid)
{
    obj = JSON.parse(await lib.getMessage(postid));
    message = [];
    //Iterate for disabling close button
    for(var i = 0; i < obj.props.attachments.length-1; i++) {

        var body={
            "text": obj.props.attachments[i].text,   
            "actions": //message2
            [
                {
                    "name": "Close",
                    "integration": {
                        "url":"",
                        "context": {  
                        }       
                    } 
                }   
            ]
        };
        message.push(body);	
    }
//Disable the Close All Issues and Ignore All
    var close_all={
        "actions": //message2     
        [
            {
                "name": "Close all Issues",
                "integration": {
                    "url":"",
                    "context": {
                    }
                }
            },
            {
                "name": "Ignore All",
                "integration":{
                    "url":"",
                    "context":{
                    }
                }
            }
        ]
    };
    message.push(close_all)

    //Update the message on Mattermost
    var updated_body = {
        "id": postid,
        "message": md.msg.stale_message,
        "props": {
            "attachments": message
        }
    }
    lib.updateMessage(postid,updated_body);
}

//Function to close stale issues belonging to a user across repos
async function closeStaleIssues(owner, issueData,postid)
{
    var success = true;
    if(postid !== undefined)
    {
        await disableButtons(postid);
    }

    for (var [repo, staleIssueNums] of Object.entries(issueData))
    {
        for(var issueIdx in staleIssueNums)
        {
            var status = await lib.closeIssue(owner, repo, staleIssueNums[issueIdx]);
        }
    }
}


module.exports.ignoreAll = ignoreAll;
module.exports.closeStaleIssues = closeStaleIssues;
module.exports.Stale_Issues = Stale_Issues;
module.exports.getIssues = getIssues;





