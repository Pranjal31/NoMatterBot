function main(){

    getStaleIssues();

}


function getStaleIssues(){

    console.log("Getting stale Issues")
    getIssues();

}

function getIssues(){



}


function close(){


}

function Ignore(){



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

console.log(chalk.green(`Your token is: ${config.token.substring(0,4)}...`));
console.log("Calling main");
main();

if (process.env.NODE_ENV != 'test')
{
	(async () => {

		
				
		await ListIssues();


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
    //Get current data
    var d = new Date(date);
    // Get month
    var m = d.getMonth();
    // Subtract 6 months
    d.setMonth(d.getMonth() - 6);
    // If the new month number isn't m - 6, set to last day of previous month
    // Allow for cases where m < 6
    var diff = (m + 12 - d.getMonth()) % 12;
    if (diff < 6) d.setDate(0)
    
    return d;
  }

  function formatDate(d) {
    return d.toLocaleString(undefined, {day:'2-digit', month:'short', year:'numeric'});
  }

async function ListIssues()
{
    let options = getDefaultOptions("/issues", "GET");

    var list = [];
    
	// Send a http request to url and specify a callback that will be called upon its return.
	return new Promise(function(resolve, reject)
	{
		request(options, async function (error, response, body) 
		{
			if( error )
			{
				console.log( chalk.red( error ));
				reject(error);
				return; // Terminate execution.
			}


            present = Date();

            //old = sixMonthsPrior(present);
            old = Date.parse('2019-10-20T16:51:17.000Z');
            console.log(present);
            console.log(old);
            //console.log(typeof(sixMonthsPrior(present)));
            //console.log(formatDate(sixMonthsPrior(present)));

            var map1 = new Map();
            
            //var map1 = new Map(["Issue Number","Title"]);

			var obj = JSON.parse(body);
			console.log("List of Repositories for user are as follows:")
			for( var i = 0; i < obj.length; i++ )
			{
                var title = obj[i].title;
                var updated = obj[i].updated_at;
                var state =  obj[i].state;

                lm = Date.parse(updated);
               // th = Date.parse(old);
                th=old;
                console.log("last modified:");
                console.log(lm);

                console.log("Threshold 6 months date");
                console.log(th);
            
                if(th>lm)
                {
                    console.log("yup");
                    console.log(title);
                    
                    list.push(obj[i].title);
                    map1.set(obj[i].title,obj[i].number);
                    console.log(obj[i].number);

                }
            }

            console.log("Here");
            //console.log(list);
            var map;

           //map1 = JSON.stringify(list);
           console.log(map1);
           map = JSON.stringify(list);

           

            

            var channel_id = await library.createChannel();
            
            console.log(channel_id);
            
            var payload = {
                "channel_id": channel_id,
                 "message": "Hola, The following issue have no activity on them from 6 months ",
                 //"elements": "list", 
                 //"body":"map",
                 "props": {
                     "attachments": [
                         {
                             "pretext": "Here is the list",
                             "text": map,
                             
                             "actions": [
                                 {
                                     "name": "Close All these Issues",
                                     "integration": {
                                         "url":"http://3f4a49b2.ngrok.io/triggers/",
                                         "context": {
                                            "action": "close",
                                            "issue_ids": list
                                          }

                                     }
                                 },
                                 {
                                     "name": "Ignore All",
                                     "integration":{
                                         "url":"http://3f4a49b2.ngrok.io/triggers/",
                                         "context":{
                                             "action":"ignore"
                                         }
                                     }
                                 }
                             ]
                         }
                     ]
                 }
            }

            library.sendResponse(payload);
            
            
            

			// Return object for people calling our method.
			resolve( obj );
		});
	});

}



module.exports.ListIssues = ListIssues;


