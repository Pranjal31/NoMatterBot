var lib = require('./lib');

var config = {};

// Retrieve our api token from the environment variables.
config.channel = process.env.CHANNELID;

var data = {
	"channel_id": config.channel,
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

lib.sendResponse("POST", data)