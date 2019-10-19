var lib = require('./lib');

var data = {
	"channel_id": "hjt7ckj1ubbfdjoffzdr3j3wjw",
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