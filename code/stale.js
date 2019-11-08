var request = require('request');
const chalk  = require('chalk');
var lib = require('./lib');
const nock = require("nock");

// lib.config.githubUrl, "/repos/" + owner + "/" + repo + "/issues/" + issue_number, "PATCH"


/* var mockService = nock("https://api.github.ncsu.edu")
.persist() // This will persist mock interception for lifetime of program.
.filteringPath(function(path){
    return "/";
})
.patch("/")
.reply(200, JSON.stringify("done")); */




if( !lib.config.gh_token )
{
	console.log(chalk`{red.bold GITHUBTOKEN is not defined!}`);
	console.log(`Please set your environment variables with appropriate token.`);
	console.log(chalk`{italic You may need to refresh your shell in order for your changes to take place.}`);
	process.exit(1);
}


//In full Implementation, a timer based event will call Stale_Issues() periodically for every 24 hours.
 /*if (process.env.NODE_ENV != 'test')
{
	(async () => {			
	await Stale_Issues();

	})()
}*/

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
    old = sixMonthsPrior(present);                //Function to compute 6 months old date    
    
    //Un-Comment below line for treating all issues created before now as stale Issues. For Demonstration.
    old = Date.parse(present); 
    
    //Un-comment below for treating 6 month old issues as stale issues
    //old = Date.parse(old);   

    var user = await lib.getUser();

    //Get the List of repositories owned, mentioned for Bot Account. API call: /user/repos?type=all
    var repos = await lib.getRepos(user.login); 
 
    var dict = {};            //{User:{rep:{issue num: issue name}}}
        
    //Loop across all repositories
        for(var repoid in repos){

            //Get Open Issues in each repository
            var obj = await lib.getOpenIssues(repos[repoid].owner.login, repos[repoid].name);
                        
            for( var i = 0; i < obj.length; i++ )
	        {
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
             "message": "Hey, Bot's up? \n The following open issues have had no activity in the last 6 months.", 
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

async function close_stale(owner,repo,issue_number)

{
    
    var mockService = nock("https://api.github.ncsu.edu")
    .patch("/repos/" + owner + "/" + repo + "/issues/" + issue_number)
    .reply(200, JSON.stringify("done"));
    
    var options = lib.getDefaultOptions(lib.config.githubUrl, "/repos/" + owner + "/" + repo + "/issues/" + issue_number, "PATCH");

	options.body = `{"state": "closed"}`;

	return new Promise(function(resolve, reject)
	{
		request(options, function (error, response, body) {

			if( error )
			{
				console.log( chalk.red( error ));
				reject(error);
				return; // Terminate execution.
			}

			resolve(response.statusCode);
		});
	});

}

async function ignore()
{
    var channel_id = await lib.createChannel();
    var data = {
		"channel_id": channel_id,
	 	"message": "Alright! These issues(s) have been ignored for a day.",

    }
    var respBody = await lib.postMessage(data);
    return respBody.id;

}

async function close_all()
{
    var channel_id = await lib.createChannel();

    var status = await close_stale();

    if(status == 200)
    {
        var data = {
            "channel_id": channel_id,
            "message": "Cool. It's done!"
        }

        var respBody = await lib.postMessage(data);
        return respBody.id;
    }
    else
    {
        var data ={
            "channel_id": channel_id,
            "message": "Sorry, Unable to complete task"
        }

        var respBody = await lib.postMessage(data);
        return respBody.id;
    }

    

}

module.exports.close_all = close_all;
module.exports.ignore = ignore;
module.exports.close_stale = close_stale;
module.exports.Stale_Issues = Stale_Issues;
module.exports.getIssues = getIssues;





