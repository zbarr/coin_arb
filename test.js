const wsClient = require('websocket').client

wsUrl = "wss://stream.binance.com:9443/ws/ltcbtc@aggTrade"

var bnncClient = new wsClient();






var gdaxClient = new wsClient()
gdaxClient.connect('wss://ws-feed.gdax.com', {"type": "subscribe", "product_ids": ["LTC-BTC"], "channels": [{"name": "ticker"}]})

gdaxClient.on('connectFailed', function(err) {
    console.log(err)
})

gdaxClient.on('connect', function(connection) {
    console.log('GDAX Websocket connected.')

    connection.on('open', function(open) {
        console.log(open)
    })

    //console.log(connection)

    connection.on('subscriptions', function(message) {
        console.log(message)
    })
    connection.on('error', function(err) {
        console.log(err)
    })
})

/**
gdaxClient.on('open', function(open) {
    console.log('GDAX Websocket connected.')
})

websocket.on('close', function(close) {
    console.log('GDAX Websocket closed.')
})

websocket.on('error', function(err) {
    console.log('ERROR: ' + err)
})

websocket.on('message', data => {
    if (data.type == "done" && data.reason == "filled" && data.hasOwnProperty("price")) {

        try {
            console.log(data)
            exchange.products[data.product_id].lastTradeTime = data.time
            exchange.products[data.product_id].lastTradePrice = data.price
        }
        catch(err) {
            console.log(err)
        }
    }
})
**/









/**


const btrxApi = require('node-bittrex-api')

btrxApi.websockets.client(function() {
    console.log('BTRX Websocket connected.');
    btrxApi.websockets.subscribe(['BTC-LTC'], function(data) {
        if (data.M === 'updateExchangeState') {
            data.A.forEach(function(data_for) {
                if (data_for.Fills.length > 0) {
                    try {
                        //console.log(data)
                        //exchange.products[reverseString(data_for.MarketName)].lastTradeTime = data_for.Fills[0].TimeStamp
                        //exchange.products[reverseString(data_for.MarketName)].lastTradePrice = data_for.Fills[0].Rate
                        console.log(data_for.Fills[0].TimeStamp)
                        console.log(data_for.Fills[0].Rate)

                    }
                    catch(err) {
                        console.log(err)
                    }
                }

            });
        }
    });
});
**/
