const express = require('express')
const app = express()
const port = 3000

// express configuration
app.use(express.json({type: '*/*'}));

// set routes
app.post('/events/', function (req, res) {
    console.log(JSON.stringify(req.body))
    res.send(`Received event. ${JSON.stringify(req.body)}`);
});

app.listen(port, () => console.log(`NoMatterBot server listening on port ${port}!\n`))