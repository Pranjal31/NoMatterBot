var request = require('request');
const got  = require('got');
const nock = require("nock");

//const githubUrl = "https://api.github.ncsu.edu";
const chalk  = require('chalk');

var config = {};

// Retrieve our api tokens from the environment variables.
//config.channel = process.env.CHANNELID;
config.botaccess = process.env.BOTACCESSTOKEN;
config.mmurl = process.env.MATTERMOSTURL;
config.gh_token = process.env.GITHUBTOKEN;
config.githubUrl = process.env.GITHUBURL;
config.server = process.env.SERVERURL;
config.userchannelid = process.env.CHANNELUSERID;
config.botuserid = process.env.BOTUSERID;

if( !config.mmurl || !config.botaccess || !config.botuserid || !config.gh_token || !config.server || !config.userchannelid || !config.githubUrl )
{
	console.log(`Please set your environment variables with appropriate token.`);
	console.log(chalk`{italic You may need to refresh your shell in order for your changes to take place.}`);
	process.exit(1);
}


   var mockService = nock("https://api.github.ncsu.edu")
  .persist() // This will persist mock interception for lifetime of program.
  .filteringPath(function(path){
	  return "/";
  })
  .patch("/")
  .reply(200, JSON.stringify("done"));


async function createChannel() {

	//var mmuserid = storage_lib.get("tblGitMatter", githubUser);
	var mmuserid = config.userchannelid;

	var options = {
		url: config.mmurl + "/api/v4/channels/direct",
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${config.botaccess}`
		},
		json : [
		  config.botuserid,
		  mmuserid
		]
	};

	return new Promise(function(resolve, reject)
	{
		request(options, function (error, response, body) {

			if( error )
			{
				console.log( chalk.red( error ));
				reject(error);
				return; // Terminate execution.
			}
			resolve(response.body.id);
		});
	});
}

async function sendResponse(data) {
	var options = {
		url: config.mmurl + "/api/v4/posts",
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${config.botaccess}`
		},
		json : data
	};

	return new Promise(function(resolve, reject)
	{
		request(options, function (error, response, body) {

			if( error )
			{
				//console.log( chalk.red( error ));
				console.log("Error");
				reject(error);
				return; // Terminate execution.
			}

			resolve(response.body);
		});
	});
}


function getDefaultOptions(urlRoot, endpoint, method)
{
	var options = {
		url: urlRoot + endpoint,
		method: method,
		headers: {
			"User-Agent": "NoMatterBot",
			"content-type": "application/json",
			"Authorization": `token ${config.gh_token}`
		}
	};
	return options;
}


async function close_stale(owner,repo,issue_number)
{
	var options = getDefaultOptions(config.githubUrl, "/repos/" + owner + "/" + repo + "/issues/" + issue_number, "PATCH");

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
    var channel_id = await createChannel();
    var data = {
		"channel_id": channel_id,
	 	"message": "All those CPU cycles for nothing? Okay :(",

    }
	await sendResponse(data);

}

async function assign()
{
    var channel_id = await createChannel();

    var status = await close_stale();

    if(status == 200)
    {
        var data = {
            "channel_id": channel_id,
            "message": "Mischeif Managed"
        }

        await sendResponse(data);
    }
    else
    {
        var data ={
            "channel_id": channel_id,
            "message": "Sorry, Unable to complete task"
        }
	   await 
	   
	   sendResponse(data);
    }

    

}

module.exports.close_stale = close_stale;
module.exports.getDefaultOptions = getDefaultOptions;
module.exports.sendResponse = sendResponse;
module.exports.createChannel = createChannel;
module.exports.config = config;
module.exports.assign = assign;
module.exports.ignore = ignore;