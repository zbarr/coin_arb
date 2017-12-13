const request = require('request');
const gdax = require('gdax');
const gdax_callback = (error, response, data) => {
    console.log(data.price);
}
const btfx_callback = (error, response, data) => {
    var btfx_obj = JSON.parse(data);
    console.log(btfx_obj);
}
const btfx_url = "https://api.bitfinex.com/v1";
var gdaxPriceArray = {}
var btfxPriceArray = {}
var gdaxProductArray = ['LTC-BTC', 'ETH-BTC', 'LTC-USD', 'BTC-USD', 'ETH-USD']
var btfxProductArray = [
    ['ltc', 'btc'],
    ['ltc', 'usd'],
    ['btc', 'usd'],
    ['eth', 'btc'],
    ['eth', 'usd']
]
initGdaxPriceArray();
initBtfxPriceArray();
setInterval(get_all_prices, 5000);

function initGdaxPriceArray() {
    for (i = 0; i < gdaxProductArray.length; i++) {
        gdaxPriceArray[gdaxProductArray[i]] = []
    }
}

function initBtfxPriceArray() {
    for (i = 0; i < btfxProductArray.length; i++) {
        btfxPriceArray[(btfxProductArray[i][0] + "-" + btfxProductArray[i][1]).toUpperCase()] = []
    }
}

function get_gdax_prices(product) {
    var publicClient = new gdax.PublicClient(product);
    publicClient.getProductTicker(function(error, response, data) {
        gdaxPriceArray[product].push(data.price)
    })
}

function get_btfx_prices(product) {
    request.get(btfx_url + '/pubticker/' + product[0] + "-" + product[1], function(error, response, data) {
        btfxPriceArray[(product[0] + "-" + product[1]).toUpperCase()].push(JSON.parse(data).last_price);
    })
}

function get_all_prices() {
    printAllPrices();
    /**
    for (i = 0; i < btfxProductArray.length; i++) {
        get_btfx_prices(btfxProductArray[i])
    };
    **/
    for (i = 0; i < gdaxProductArray.length; i++) {
        get_gdax_prices(gdaxProductArray[i])
    };
}

function printAllPrices() {
    console.log("----- GDAX -----");
    console.log(gdaxPriceArray);
    console.log("\n----- BTFX -----");
    console.log(btfxPriceArray);
}
/**

function getPrices() {

    console.log("----- PRICES -----");

    ltcPublicClient.getProductTicker(function(error, response, data) {

        gdax_ltc_price = data.price;

        console.log("GDAX LTC/BTC: " + gdax_ltc_price);

    });



    request.get(btfx_url + '/pubticker/ltcbtc', function(error, response, data) {

        btfx_ltc_price = JSON.parse(data).last_price;

        console.log("BTFX LTC/BTC: " + btfx_ltc_price);

    });



    ethPublicClient.getProductTicker(function(error, response, data) {

        gdax_eth_price = data.price;

        console.log("GDAX ETH/BTC: " + gdax_eth_price);

    });



    request.get(btfx_url + '/pubticker/ethbtc', function(error, response, data) {

        btfx_eth_price = JSON.parse(data).last_price;

        console.log("BTFX ETH/BTC: " + btfx_eth_price);

    });



    console.log("GDAX/BTFX LTC/BTC Ratio: " + gdax_ltc_price / btfx_ltc_price);

    console.log("GDAX/BTFX ETH/BTC Ratio: " + gdax_eth_price / btfx_eth_price);



  	console.log("Round Trip $1000 LTC Profit (No fees): " + (1000 * (gdax_ltc_price / btfx_ltc_price) - 1000));



  	setTimeout(getPrices, 10000);

}

**/
