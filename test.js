const wsClient = require('websocket').client

wsUrl = "wss://stream.binance.com:9443/ws/ltcbtc@aggTrade"

var bnncClient = new wsClient();

client.connect(wsUrl)

client.on('connectFailed', function(err) {
    console.log('ERROR: ' + error.toString())
})

client.on('connect', function(connection) {
    console.log('BNNC WebSocket Client Connected')

    connection.on('error', function(err) {
        console.log("Connection Error: " + err.toString())
    })

    connection.on('close', function() {
        console.log('connection closed.')
    })

    connection.on('message', function(message) {
        console.log(JSON.parse(message.utf8Data).T)
        console.log(JSON.parse(message.utf8Data).p)
    })
})
