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
 if (process.env.NODE_ENV != 'test')
{
	(async () => {			
	await Stale_Issues();

	})()
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
    old = sixMonthsPrior(present);                //Function to compute 6 months old date                   
    
    //Un-Comment below line for treating all issues created before now as stale Issues. For Demonstration.
    old = Date.parse(present); 
    
    //Un-comment below for treating 6 month old issues as stale issues
    //old = Date.parse(old);   
    
    //Get the List of repositories owned, mentioned for Bot Account. API call: /user/repos?type=all
    var repos = await lib.getRepos();
    //console.log(repos);
        
    //Loop across all repositories
        for(var repoid in repos){

            //Get Open Issues in each repository
            var obj = await lib.getOpenIssues(repos[repoid].owner.login, repos[repoid].name);
            
            //console.log(repos[repoid].name);
            //console.log(repos[repoid].owner.login);
            
            
            //Intialse the String
            var str = "";
            for( var i = 0; i < obj.length; i++ )
	        {
                var updated = obj[i].updated_at;
                //console.log(obj[i].assignee);
        
                lm = Date.parse(updated);             //last_modified date of Git hub issue
               
                th=old;                              //Threshold /6 months/ date set
               
                //console.log(th);
                //console.log(lm);   
                if(th>lm)                               //compare threshold and last modified
                {
                    list.push(obj[i].title);
                    
                    str += obj[i].title + "\t: " + obj[i].number + '\n'
                }
            }

            //console.log(str);

            //Post to the Mattermost Channel of Issue Assignee if Issue has been identified as stale. 
            if(str != "")
            {
            //Create the channel as per the owner of the issue
            var channel_id = await lib.createChannel(repos[repoid].owner.login);
    
            var payload = {
                "channel_id": channel_id,
                 "message": "Hey, Bot's up? \n The following open issues have had no activity in the last 6 months.", 
                 "props": {
                     "attachments": [
                         {
                             "pretext": "Do you want to close them?",
                             "text": str,   
                             
                             "actions": [
                                 {
                                     "name": "Close All Issues",
                                     "integration": {
                                         "url":lib.config.server + "/triggers/",
                                         "context": {
                                            "action": "STALE_CLOSE",
                                            "issue_ids": list
                                          }

                                     }
                                 },
                                 {
                                     "name": "Ignore",
                                     "integration":{
                                         "url":lib.config.server + "/triggers/",
                                         "context":{
                                             "action":"STALE_IGNORE"
                                         }
                                     }
                                 }
                             ]
                         }
                     ]
                 }
            }

            var respBody = await lib.postMessage(payload);
        }
            
            //return respBody.id;
            
            
    }

//}

    

    
    //console.log(obj);

    
		
/*	for( var i = 0; i < obj.length; i++ )
	{
        var updated = obj[i].updated_at;
        
        lm = Date.parse(updated);             //last_modified date of Git hub issue
               
        th=old;                              //Threshold /6 months/ date set
               
         console.log(th);
         console.log(lm);   
        if(th>lm)                               //compare threshold and last modified
        {
            list.push(obj[i].title);
            map1.set(obj[i].title,obj[i].number);
            str += obj[i].title + "\t: " + obj[i].number + '\n'
        }
    }

    console.log(str);
 
        var channel_id = await lib.createChannel();
    
        var payload = {
                "channel_id": channel_id,
                 "message": "Hey, Bot's up? \n The following open issues have had no activity in the last 6 months.", 
                 "props": {
                     "attachments": [
                         {
                             "pretext": "Do you want to close them?",
                             "text": str,   
                             
                             "actions": [
                                 {
                                     "name": "Close All Issues",
                                     "integration": {
                                         "url":lib.config.server + "/triggers/",
                                         "context": {
                                            "action": "STALE_CLOSE",
                                            "issue_ids": list
                                          }

                                     }
                                 },
                                 {
                                     "name": "Ignore",
                                     "integration":{
                                         "url":lib.config.server + "/triggers/",
                                         "context":{
                                             "action":"STALE_IGNORE"
                                         }
                                     }
                                 }
                             ]
                         }
                     ]
                 }
            }

            var respBody = await lib.postMessage(payload);
            
            return respBody.id; */
            
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





