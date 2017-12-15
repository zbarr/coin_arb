const request = require('request');
const gdaxApi = require('gdax');
const btrxApi = require('node-bittrex-api');

const websocket = new gdaxApi.WebsocketClient(['BTC-USD', 'ETH-USD'])


exports.startPriceFeeder = function(exchange) {
    websocket.on('message', data => {
        if (data.type = "received") {
            try {
                product_id = data.product_id
                exchange.products[product_id].lastTradeTime = data.time
                exchange.products[product_id].lastTradePrice = data.price
            }
            catch(err) {
                console.log(err)
            }
        }
    })
}
