const btrxApi = require('node-bittrex-api');
const gdaxApi = require('gdax')
/**
btrxApi.websockets.client(function() {
        console.log('Websocket connected');
        btrxApi.websockets.listen(function(data, client) {
            data.A.forEach(function(data_for) {
                console.log(data_for)
                data_for.Deltas.forEach(function(marketsDelta) {
                    console.log('Ticker Update for '+ marketsDelta.MarketName, marketsDelta);
                });
            });
        })
    }
)
**/

const websocket = new gdaxApi.WebsocketClient(['LTC-BTC'])
console.log('GDAX Websocket connected.')
websocket.on('message', data => {

    //if (data.type = "done") {
        try {
            console.log(data)
            /**
            exchange.products[data.product_id].lastTradeTime = data.time
            exchange.products[data.product_id].lastTradePrice = data.price
            **/
        }
        catch(err) {
            console.log(err)
        }
    //}
})

/**

btrxApi.websockets.client(function() {
    console.log('Websocket connected');
    btrxApi.websockets.subscribe(['BTC-LTC'], function(data) {
        if (data.M === 'updateExchangeState') {
            //console.log(data.A)
            data.A.forEach(function(data_for) {
                console.log('Market Update for '+ data_for.MarketName, data_for);
            });
        }
    });
});
**/
