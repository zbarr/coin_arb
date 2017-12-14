const request = require('request');
const gdaxApi = require('gdax');
const btrxApi = require('node-bittrex-api');

const websocket = new gdaxApi.WebsocketClient(['BTC-USD', 'ETH-USD'])

const exchanges = ['gdax']

var prices = new Object()

export.start = function(exchange) {
    initPrices(prices)
    startPriceFeeder(exchange)
}

function startPriceFeeder(exchange) {
    websocket.on('message', data => {
        if (data.type = "received") {
            try {
                exchange.products[data.product_id] =
            }
        }
        for (product in exchange.products) {
            if (data.product_id == product.id) {
                if
            }
        }
        exchange.product.lastTradeTime = data.time
        exchange.productlastTradePrice = data.price
    });
}


function initPrices(prices) {
    for (exchange in exchanges) {
        prices.exchange = exchange
        prices.exchange.time = null
        prices.exchange.price = null
    }
}
