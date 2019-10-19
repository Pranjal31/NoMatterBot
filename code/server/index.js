const express = require('express')
const app = express()
const port = 3000

// express configuration
app.use(express.json({type: '*/*'}));

// set routes
app.post('/events/', function (req, res) {
    var req_body = req.body
    //console.log(JSON.stringify(req.body))
    //console.log(req.body.repository.owner)

    if (req_body.pull_request) {
        var repo_name = req_body.pull_request.head.repo.name
        var issue_num = req_body.pull_request.title.split('-')[0]

        if (req_body.action === 'opened'){
            // delete existing labels

        } else if(req_body.action === 'closed') {

        }

    }

    //console.log(req_body)
    res.send(`Received event. ${JSON.stringify(req.body)}`);
});

app.listen(port, () => console.log(`NoMatterBot server listening on port ${port}!\n`))