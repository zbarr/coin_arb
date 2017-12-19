const gdaxApi = require('gdax');
const btrxApi = require('node-bittrex-api')
const wsClient = require('websocket').client

bnncWsUrl = "wss://stream.binance.com:9443/ws/ltcbtc@aggTrade"

var gdaxMakerFee = 0
var gdaxTakerFee = .0025

var btrxTakerFee = .0025
var btrxMakerFee = .0025

var bnncTakerFee = .001
var bnncMakerFee = .001

var gdax = new Exchange('gdax', gdaxMakerFee, gdaxTakerFee)
var btrx = new Exchange('btrx', btrxMakerFee, btrxTakerFee)
var bnnc = new Exchange('bnnc', bnncMakerFee, bnncTakerFee)

//var priceFeeder = require("./priceFeeder.js")
var gdaxProducts = require("./products/gdaxProducts.json")
var btrxProducts = require("./products/btrxProducts.json")
var bnncProducts = require("./products/bnncProducts.json")



initProducts(gdax, ['LTC-BTC'])
console.log(gdax)
initProducts(btrx, ['LTC-BTC'])
console.log(btrx)
initProducts(bnnc, ['LTC-BTC'])
console.log(bnnc)

startPriceFeeder(gdax)
startPriceFeeder(btrx)
//startPriceFeeder(bnnc)

setInterval(printer, 1000);


function printer() {
    getExchangeRatios(gdax, btrx, 'LTC-BTC')
    console.log("BNNC Last Price for LTC-BTC: " + bnnc.products['LTC-BTC'].lastTradePrice)
    //console.log(bnnc)
}

function getExchangeRatios(exchange1, exchange2, product) {
    console.log(exchange1.name + " Last Price for " + product + ": " + exchange1.products[product].lastTradePrice)
    console.log(exchange2.name + " Last Price for " + product + ": " + exchange2.products[product].lastTradePrice)
    console.log("Price Ratio (" + exchange1.name + "/" + exchange2.name + "): " + btrx.products['LTC-BTC'].lastTradePrice / gdax.products['LTC-BTC'].lastTradePrice + "\n")
    //console.log("Moving Average Price Ratio: ")
}


function Exchange(name, makerFee, takerFee) {
    this.name = name
    this.products = {}
    this.makerFee = makerFee
    this.takerFee = takerFee
}

function Product(exchangeProductName, baseCurrency, quoteCurrency) {
    this.exchangeProductName = exchangeProductName
    this.baseCurrency = baseCurrency
    this.quoteCurrency = quoteCurrency
    this.lastTradeTime = null
    this.lastTradePrice = null
}

function initProducts(exchange, activeProductIds) {

    var products = {}

    if (exchange.name == 'gdax') {
        for (i = 0; i < gdaxProducts.length; i++) {
            productId = gdaxProducts[i].id
            products[productId] = gdaxProducts[i]
        }

        for (i = 0; i < activeProductIds.length; i++) {
            exchange.products[activeProductIds[i]] = new Product(activeProductIds[i], products[activeProductIds[i]].base_currency, products[activeProductIds[i]].quote_currency)
        }
    }
    else if (exchange.name == 'btrx') {
        for (i = 0; i < btrxProducts.length; i++) {
            productId = reverseString(btrxProducts[i].MarketName)
            products[productId] = btrxProducts[i]
        }

        for (i = 0; i < activeProductIds.length; i++) {
            exchange.products[activeProductIds[i]] = new Product(products[activeProductIds[i]].MarketName, products[activeProductIds[i]].MarketCurrency, products[activeProductIds[i]].BaseCurrency)
        }
    }
    else if (exchange.name == 'bnnc') {
        for (i = 0; i < bnncProducts.length; i++) {
            productId = (bnncProducts[i].baseAsset + "-" + bnncProducts[i].quoteAsset)
            products[productId] = bnncProducts[i]
        }

        for (i = 0; i < activeProductIds.length; i++) {
            exchange.products[activeProductIds[i]] = new Product(products[activeProductIds[i]].symbol, products[activeProductIds[i]].baseAsset, products[activeProductIds[i]].quoteAsset)
        }
    }
    else {
        console.log("Invalid Exchange.")
    }
}

function startPriceFeeder(exchange) {
    /** Creating Array of Exchange Product Names **/
    productArray = []
    for (product in exchange.products) {
        productArray.push(exchange.products[product].exchangeProductName)
    }


    if (exchange.name == 'gdax') {
        const websocket = new gdaxApi.WebsocketClient(productArray)
        console.log('GDAX Websocket connected.')
        websocket.on('message', data => {
            if (data.type == "done" && data.reason == "filled" && data.hasOwnProperty("price")) {
                try {
                    //console.log(data)
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
            console.log('BTRX Websocket connected.');
            btrxApi.websockets.subscribe(productArray, function(data) {
                if (data.M === 'updateExchangeState') {
                    data.A.forEach(function(data_for) {
                        if (data_for.Fills.length > 0) {
                            try {
                                console.log(data)
                                exchange.products[reverseString(data_for.MarketName)].lastTradeTime = data_for.Fills[0].TimeStamp
                                exchange.products[reverseString(data_for.MarketName)].lastTradePrice = data_for.Fills[0].Rate
                            }
                            catch(err) {
                                console.log(err)
                            }
                        }

                    });
                }
            });
        });
    }
    else if (exchange.name = 'bnnc') {
        var bnncClient = new wsClient()
        bnncClient.connect(bnncWsUrl)

        bnncClient.on('connectFailed', function(err) {
            console.log('ERROR: ' + err)
        })

        bnncClient.on('connect', function(connection) {
            console.log('BNNC Websocket connected.')

            connection.on('error', function(err) {
                console.log("ERROR[connection]: " + err)
            })

            connection.on('close', function() {
                console.log('BNNC Websocket connection closed.')
            })

            connection.on('message', function(message) {
                data = JSON.parse(message.utf8Data)
                /**
                for (product in exchange.products) {
                    if (exchange.products[product].exchangeProductName == data.s) {
                        try {
                            exchange.products[product].lastTradeTime = data.T
                            exchange.products[product].lastTradePrice = data.p
                        }
                        catch (err) {
                            console.log(err)
                        }
                    }

                }
                **/
            })
        })
    }
    else {
        console.log("Invalid exchange.")
    }
}

function reverseString(str) {
    stringArray = str.split("-")
    return (stringArray[1] + "-" + stringArray[0])
}

function reverseStringArray(stringArray) {
    for (i = 0; i < stringArray.length; i++) {
        stringArray[i] = reverseString(stringArray[i])
    }
}
