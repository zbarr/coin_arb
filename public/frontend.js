var home = 'ws://192.168.1.69:8081'
var away = 'ws://192.168.70.56:8081'

var ws = new WebSocket(home)

ws.onopen = function() {
    console.log('websocket is connected ...')
    ws.send('connected')
}

ws.onmessage = function (message) {
    var data = JSON.parse(message.data)
    document.getElementById('content').innerHTML = "<h1>" + data.date + "</h1>"
    console.log(message)
}
