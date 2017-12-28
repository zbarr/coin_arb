const express = require('express')
var app = express()

//hooks up middleware
app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/data.html')
    console.log("just answered a request")
})

app.listen(8080, function () {
    console.log((new Date()) + ' Server is listening on port 8080')
})
