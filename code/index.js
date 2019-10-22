var lib = require('./lib');

var config = {};

// Retrieve our api token from the environment variables.
config.channel = process.env.CHANNELUSERID;

var channel_id = await lib.createChannel("xyz");

var data = {
	"channel_id": channel_idc,
 	"message": "This is a message from a bot",
 	"props": {
		"attachments": [
	     	{
				"pretext": "Look some text",
				"text": "This is text"
			}
		]
	}
}

lib.postMessage(data)