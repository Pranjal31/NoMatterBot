function getIssues(){

    const data = require("../code/mockStaleIssues.json");
    return data;
}

var request = require('request');

const chalk  = require('chalk');



//var data = require("./mock.json")

var library = require('./library');

//console.log(data);

var urlRoot = "https://api.github.ncsu.edu";
// NCSU Enterprise endpoint:
//var urlRoot = "https://api.github.ncsu.edu";

var config = {};
// Retrieve our api token from the environment variables.
config.token = process.env.GITHUBTOKEN;

if( !config.token )
{
	console.log(chalk`{red.bold GITHUBTOKEN is not defined!}`);
	console.log(`Please set your environment variables with appropriate token.`);
	console.log(chalk`{italic You may need to refresh your shell in order for your changes to take place.}`);
	process.exit(1);
}

//console.log(chalk.green(`Your token is: ${config.token.substring(0,4)}...`));
//console.log("Calling main");
//main();

//In full Implementation, a timer based event will call Stale_Issues() periodically for every 24 hours.
if (process.env.NODE_ENV != 'test')
{
	(async () => {


        //var userId = "vbbhadra";
        //var newrepo = "bfs";
        //var issue_number = "19"

		
				
	await Stale_Issues();
    //var status = await library.close_stale();
    //console.log(status);

	})()
}

function getDefaultOptions(endpoint, method)
{
	var options = {
		url: urlRoot + endpoint,
		method: method,
		headers: {
			"User-Agent": "CSC510-REST-WORKSHOP",
			"content-type": "application/json",
			"Authorization": `token ${config.token}`
		}
	};
	return options;
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
    old = sixMonthsPrior(present);                                   
            

    var map1 = new Map();
    var str = "";          
  
    var obj = getIssues();                          //Get Issues currently reading from mockIssues.json
		
	for( var i = 0; i < obj.length; i++ )
	{
        var title = obj[i].title;
        var updated = obj[i].updated_at;
        var state =  obj[i].state;

        lm = Date.parse(updated);             //last_modified date of Git hub issue
               
        th=old;                              //Threshold /6 months/ date set
               
            
        if(th>lm)                               //compare threshold and last modified
        {
            list.push(obj[i].title);
            map1.set(obj[i].title,obj[i].number);
            str += obj[i].title + "\t: " + obj[i].number + '\n'
        }
    }
 
        var channel_id = await library.createChannel();
    
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
                                         "url":library.config.server + "/triggers/",
                                         "context": {
                                            "action": "STALE_CLOSE",
                                            "issue_ids": list
                                          }

                                     }
                                 },
                                 {
                                     "name": "Ignore",
                                     "integration":{
                                         "url":library.config.server + "/triggers/",
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

            respBody = await library.sendResponse(payload);
            
            return respBody.id;
            
}

module.exports.Stale_Issues = Stale_Issues;
module.exports.getIssues = getIssues;





