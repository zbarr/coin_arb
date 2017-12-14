var gdaxMakerFee = 0
var gdaxTakerFee = .0025

var btrxTakerFee = .0025
var btrxMakerFee = .0025

var gdax = Exchange('gdax', gdaxMakerFee, gdaxTakerFee)
var btrx = Exchange('btrx', btrxMakerFee, btrxTakerFee)



var priceFeeder = require("./priceFeeder.js")
var gdaxProducts = require("./products/gdaxProducts.json")
var btrxProducts = require("./products/btrxProducts.json")

function Exchange(name, makerFee, takerFee) {
    this.name = name
    this.products = {}
    this.makerFee = makerFee
    this.takerFee = takerFee
}

function Product() {
    this.baseCurrency = null
    this.quoteCurrency = null
    this.lastTradeTime = null
    this.lastTradPrice = null
}

function initProducts(exchange, activeProducts) {
    if (exchange.name = 'gdax') {
        var getBaseCurrency = gdaxProducts.base_currency
    }
    for (product in activeProducts) {
        exchange.products[product] = Product()
        exchange.products[product].baseCurrency =
        exchange.products[product].quoteCurrency =
    }
}
