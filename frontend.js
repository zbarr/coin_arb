var ws = new WebSocket('ws://192.168.70.56:8081')
ws.onopen = function() {
    console.log('websocket is connected ...')
    ws.send('connected')
}

ws.onmessage = function (message) {
    console.log(message)
}

/**
"use strict"
const contentElement = document.getElementById('content');
console.log("in frontend")
var connection = new WebSocket('ws://192.168.70.56:8080');

connection.addEventListener('open', function (err) {
    console.log("websocket opened")
}

connection.addEventListener('error', function (error) {
    contentElement.innerHTML = '<p>Sorry, but there\'s some problem with your connection or the sever is down.</p>'
})

connection.addEventListener('message', function (error)
    try {
        var json = JSON.parse(message.data);
        content.html(json)
        console.log("got message")
    }
    catch (err) {
        console.log('This doesn\'t look like a valid JSON: ', message.data);
        //return;
    }

    console.log("Received message.")
}
**/
