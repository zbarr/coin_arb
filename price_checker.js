const request = require('request');
const gdaxApi = require('gdax');
const btrxApi = require('node-bittrex-api');

const btrx_url = "https://bittrex.com/api/v1.1/public/getticker/";

var gdaxPrices = {}
var btrxPrices = {}
var gdaxSymbols = ['LTC-BTC', 'ETH-BTC', 'LTC-USD', 'BTC-USD', 'ETH-USD']
var btrxSymbols = ['BTC-LTC', 'BTC-ETH', 'USDT-LTC', 'USDT-BTC', 'USDT-ETH', 'ETH-LTC']

var tradeMatrix


var gdax = new Object()
gdax.symbols = gdaxSymbols
gdax.prices = gdaxPrices
gdax.takerFee = .0025
gdax.makerFee = 0

var btrx = new Object()
btrx.symbols = btrxSymbols
btrx.prices = btrxPrices
btrx.takerFee = .0025
btrx.makerFee = .0025

var count = 0

//var lbTrade = (getLastPrice(gdax, 'LTC-BTC')/getLastPrice(btrx, 'BTC-LTC'))*.9975*.9975

init();
setInterval(printer, 5000);


function init() {
    initPrices(gdax);
    initPrices(btrx);
}

function printer() {
    //Running
    fetchExchangePrices(gdax)
    fetchExchangePrices(btrx)

    //Printing
    if (count > 0) {
        console.log("\n----- GDAX Prices -----")
        console.log(getLastPrices(gdax))
        console.log("\n----- BTRX Prices -----")
        console.log(getLastPrices(btrx))
        console.log("\nGDAX/BTRX LTC/BTC Ratio: " + getDiscrepency(0))
        console.log("\nRound Trip $200 LTC Profit (No fees): " + ((200 * getDiscrepency(0))-200))
        console.log("\nRound Trip $1000 LTC Profit (No fees): " + ((1000 * getDiscrepency(0))-1000))

        console.log("\n3 Trip $200 USD-(LTC-BTC-LTC)*3-USD Trade (No Fees): " + ((200 / getLastPrice(gdax, 'LTC-USD')) * .9975) * getLbTrade()*getLbTrade()*getLbTrade() * getLastPrice(gdax, 'LTC-USD'))
        console.log("\n3 Trip $1000 USD-(LTC-BTC-LTC)*3-USD Trade (No Fees): " + (1000 / getLastPrice(gdax, 'LTC-USD')) * getLbTrade()*getLbTrade()*getLbTrade() * getLastPrice(gdax, 'LTC-USD'))

        console.log("\nRound Trip $200 USD-LTC-BTC-LTC-USD Trade (With Taker Fees): " + (((((((200 / getLastPrice(gdax, 'LTC-USD')) * .9975) * getLastPrice(gdax, 'LTC-BTC')) * .9975) / getLastPrice(btrx, 'BTC-LTC')) * .9975) * getLastPrice(gdax, 'LTC-USD')) * .9975)
        console.log("\nRound Trip $1000 USD-LTC-BTC-LTC-USD Trade (With Taker Fees): " + (((((((1000 / getLastPrice(gdax, 'LTC-USD')) * .9975) * getLastPrice(gdax, 'LTC-BTC')) * .9975) / getLastPrice(btrx, 'BTC-LTC')) * .9975) * getLastPrice(gdax, 'LTC-USD')) * .9975)

        console.log("\n3 Trip $200 USD-(LTC-BTC-LTC)*3-USD Trade (With Taker Fees): " + (((200 / getLastPrice(gdax, 'LTC-USD')) * .9975) * getLbTrade(true)*getLbTrade(true)*getLbTrade(true) * getLastPrice(gdax, 'LTC-USD')) * .9975)
        console.log("\n3 Trip $1000 USD-(LTC-BTC-LTC)*3-USD Trade (With Taker Fees): " + (((1000 / getLastPrice(gdax, 'LTC-USD')) * .9975) * getLbTrade(true)*getLbTrade(true)*getLbTrade(true) * getLastPrice(gdax, 'LTC-USD')) * .9975)

        console.log("\n3 Trip $200 USD-(LTC-BTC-LTC)*3-USD Trade (With Taker Fees): " + (((200 / getLastPrice(gdax, 'LTC-USD')) * .9975) * getLbTrade(true)*getLbTrade(true)*getLbTrade(true) * getLastPrice(gdax, 'LTC-USD')) * .9975)
        console.log("\n3 Trip $1000 USD-(LTC-BTC-LTC)*3-USD Trade (With Taker Fees): " + (((1000 / getLastPrice(gdax, 'LTC-USD')) * .9975) * getLbTrade(true)*getLbTrade(true)*getLbTrade(true) * getLastPrice(gdax, 'LTC-USD')) * .9975)

        //console.log("\nGDAX Round Trip $200 Trade (With fees): " + (((((200 / getLastPrice(gdax, 'BTC-USD')) * .9975) / getLastPrice(gdax, 'LTC-BTC')) * .9975) * getLastPrice(gdax, 'LTC-USD')))
        //console.log("\nGDAX/BTRX ETH/BTC Ratio: " + getDiscrepency(1))

    }
    count++;
}

function getLbTrade(fees) {
    if (fees = true) {
        return (getLastPrice(gdax, 'LTC-BTC')/getLastPrice(btrx, 'BTC-LTC'))*.9975*.9975
    }
    else {
        return (getLastPrice(gdax, 'LTC-BTC')/getLastPrice(btrx, 'BTC-LTC'))
    }
}

function initPrices(exchange) {
    for (i = 0; i < exchange.symbols.length; i++) {
        exchange.prices[exchange.symbols[i]] = []
    }
}

function fetchPrice(exchange, symbol) {
    if (exchange == gdax) {
        fetchGdaxPrice(symbol)
    }
    else if (exchange == btrx){
        fetchBtrxPrice(symbol)
    }
    else console.log("Invalid Exchange")
}


function fetchExchangePrices(exchange) {
    for (i = 0; i < exchange.symbols.length; i++) {
        fetchPrice(exchange, exchange.symbols[i])
    }
}

function fetchGdaxPrice(symbol) {
    var publicClient = new gdaxApi.PublicClient(symbol);
    publicClient.getProductTicker(function(error, response, data) {
        gdaxPrices[symbol].push(data.price)
        //console.log(symbol + ": " + gdaxPrices[symbol])
    })
}

function fetchBtrxPrice(symbol) {
    btrxApi.getticker({ market : symbol }, function(data, error) {
        btrxPrices[symbol].push(data.result.Last);
        //console.log(symbol + ": " + btrxPrices[symbol])
    })
}

function getLastPrice(exchange, symbol) {
    return exchange.prices[symbol][exchange.prices[symbol].length - 1]
}

function getLastPrices(exchange) {
    tempArray = {}
    for (symbol in exchange.prices) {
        tempArray[symbol] = getLastPrice(exchange, symbol)
    }
    return tempArray
}

function getDiscrepency(symbolIndex) {
    return (getLastPrice(gdax, gdax.symbols[symbolIndex])/getLastPrice(btrx, btrx.symbols[symbolIndex]))
}

/**

function getPrices() {
    console.log("GDAX/BTFX LTC/BTC Ratio: " + gdax_ltc_price / btfx_ltc_price);
    console.log("GDAX/BTFX ETH/BTC Ratio: " + gdax_eth_price / btfx_eth_price);
  	console.log("Round Trip $1000 LTC Profit (No fees): " + (1000 * (gdax_ltc_price / btfx_ltc_price) - 1000));
  	setTimeout(getPrices, 10000);

}

**/
