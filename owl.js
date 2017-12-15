const gdaxApi = require('gdax');

const websocket = new gdaxApi.WebsocketClient(['LTC-BTC'])

var gdaxMakerFee = 0
var gdaxTakerFee = .0025

var btrxTakerFee = .0025
var btrxMakerFee = .0025

var gdax = new Exchange('gdax', gdaxMakerFee, gdaxTakerFee)
var btrx = new Exchange('btrx', btrxMakerFee, btrxTakerFee)

//var priceFeeder = require("./priceFeeder.js")
var gdaxProducts = require("./products/gdaxProducts.json")
var btrxProducts = require("./products/btrxProducts.json")



initProducts(gdax, ['LTC-BTC'])
console.log(gdax)
initProducts(btrx, ['LTC-BTC'])
console.log(btrx)


//priceFeeder.startPriceFeeder(gdax)
startPriceFeeder(gdax)
setInterval(function() {console.log(gdax)}, 1000);


function Exchange(name, makerFee, takerFee) {
    this.name = name
    this.products = {}
    this.makerFee = makerFee
    this.takerFee = takerFee
}

function Product(baseCurrency, quoteCurrency) {
    this.baseCurrency = baseCurrency
    this.quoteCurrency = quoteCurrency
    this.lastTradeTime = null
    this.lastTradePrice = null
}

function initProducts(exchange, activeProductIds) {

    var productArray = {}

    if (exchange.name == 'gdax') {
        for (i = 0; i < gdaxProducts.length; i++) {
            productId = gdaxProducts[i].base_currency + "-" + gdaxProducts[i].quote_currency
            productArray[productId] = gdaxProducts[i]
        }

        for (i = 0; i < activeProductIds.length; i++) {
            exchange.products[activeProductIds[i]] = new Product(productArray[activeProductIds[i]].base_currency, productArray[activeProductIds[i]].quote_currency)
        }
    }

    else if (exchange.name == 'btrx') {
        for (i = 0; i < btrxProducts.length; i++) {
            productId = btrxProducts[i].MarketCurrency + "-" + btrxProducts[i].BaseCurrency
            productArray[productId] = btrxProducts[i]
        }

        for (i = 0; i < activeProductIds.length; i++) {
            exchange.products[activeProductIds[i]] = new Product(productArray[activeProductIds[i]].MarketCurrency, productArray[activeProductIds[i]].BaseCurrency)
        }

    }
}

function startPriceFeeder(exchange) {
    if (exchange.name == 'gdax') {
        websocket.on('message', data => {
            if (data.type = "received") {
                try {
                    exchange.products[data.product_id].lastTradeTime = data.time
                    exchange.products[data.product_id].lastTradePrice = data.price
                }
                catch(err) {
                    console.log(err)
                }
            }
        })
    }
    else if (exchange.name == 'btrx') {
        btrxApi.websockets.client(function() {
            console.log('Websocket connected');
            btrxApi.websockets.subscribe(['BTC-LTC'], function(data) {
                if (data.M === 'updateExchangeState') {
                    data.A.forEach(function(data_for) {
                        console.log('Market Update for '+ data_for.MarketName, data_for);
                        exchange.products[]
                    });
                }
            });
        });
    }
}
