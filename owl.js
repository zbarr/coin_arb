const gdaxApi = require('gdax');
const btrxApi = require('node-bittrex-api')
const wsClient = require('websocket').client
const webSocketServer = require('ws').Server
const express = require('express')
const fs = require('fs')

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

var exchanges = [gdax, btrx, bnnc]

initProducts(gdax, ['LTC-BTC'])
console.log(gdax)
initProducts(btrx, ['LTC-BTC'])
console.log(btrx)
initProducts(bnnc, ['LTC-BTC'])
console.log(bnnc)

startFeeder(gdax)
startFeeder(btrx)
startFeeder(bnnc)


var app = express()

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/data.html')
})
/**
app.get(path, function (req, res) {
    res.sendfile(__dirname + '/frontend.js')
})
**/

app.listen(8080, function () {
    console.log((new Date()) + ' Server is listening on port 8080')
})

wss = new webSocketServer({port: 8081})

wss.on('connection', function(ws) {
    ws.on('message', function(message) {
        console.log('received: %s', message)
    })
    setInterval(function() {
        //ws.send(`${new Date()}`)
        ws.send(JSON.stringify({"date": new Date()}))
    }, 1000)

    ws.on('close', function(close) {
        return
    })
})

function gridPrinter(exchanges, products) {
    getExchangeRatios(exchanges, 'LTC-BTC')
}

function getExchangeRatios(exchanges, product) {
    for (i = 0; i < exchanges.length; i++ ) {
        console.log("\n----- " + exchanges[i].name + " -----")
        console.log(exchanges[i].name + " Last Price for " + product + ": " + exchanges[i].products[product].lastTradePrice)
        for (j = 0; j < exchanges.length; j++ ) {
            if (j != i) {
                console.log("Price Ratio (" + exchanges[i].name + "/" + exchanges[j].name + "): " + exchanges[i].products[product].lastTradePrice / exchanges[j].products[product].lastTradePrice)
            }
        }
    }
}

function updateCallback(exchange, product, time, price) {
    exchange.products[product].lastTradeTime = time
    exchange.products[product].lastTradePrice = price
    getExchangeRatios(exchanges, product)
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

function startFeeder(exchange) {
    /** Creating Array of Exchange Product Names **/
    productArray = []
    for (product in exchange.products) {
        productArray.push(exchange.products[product].exchangeProductName)
    }


    if (exchange.name == 'gdax') {
        startGdaxFeeder(exchange, productArray)
    }
    else if (exchange.name == 'btrx') {
        startBtrxFeeder(exchange, productArray)
    }
    else if (exchange.name == 'bnnc') {
        startBnncFeeder(exchange)
    }
    else {
        console.log("Invalid exchange.")
    }
}

function startGdaxFeeder(exchange, productArray) {
    const websocket = new gdaxApi.WebsocketClient(productArray)
    websocket.on('open', function(open) {
        console.log('GDAX Websocket connected.')
    })

    websocket.on('close', function(close) {
        console.log('GDAX Websocket closed.')
    })

    websocket.on('error', function(err) {
        console.log('ERROR: ' + err)
    })

    websocket.on('message', function(data) {
        if (data.type == "done" && data.reason == "filled" && data.hasOwnProperty("price")) {
            try {
                updateCallback(gdax, data.product_id, data.time, data.price)
            }
            catch(err) {
                console.log("ERROR: " + err)
            }
        }
    })
}

function startBtrxFeeder(exchange, productArray) {
    btrxApi.websockets.client(function() {
        console.log('BTRX Websocket connected.');
        btrxApi.websockets.subscribe(productArray, function(btrxData) {
            if (btrxData.M == 'updateExchangeState') {
                btrxData.A.forEach(function(data_for) {
                    if (data_for.Fills.length > 0) {
                        try {
                            updateCallback(exchange, reverseString(data_for.MarketName), data_for.Fills[0].TimeStamp, data_for.Fills[0].Rate)
                        }
                        catch (err) {
                            console.log("ERROR: " + err)
                        }
                    }
                })
            }
        })
    })
}

function startBnncFeeder(exchange) {
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
            for (product in exchange.products) {
                if (exchange.products[product].exchangeProductName == data.s) {
                    try {
                        updateCallback(exchange, product, data.T, data.p)
                    }
                    catch (err) {
                        console.log("ERROR: " + err)
                    }
                }
            }
        })
    })
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
