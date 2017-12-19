const request = require('request')
const gdaxApi = require('gdax')
const btrxApi = require('node-bittrex-api')
const fs = require('fs')

const btrxUrl = "https://bittrex.com/api/v1.1/public/"
const bnncUrl = "https://api.binance.com/api/v1/exchangeInfo"

fetchGdaxProducts()
fetchBtrxProducts()
fetchBnncProducts()

function fetchGdaxProducts() {
    var publicClient = new gdaxApi.PublicClient()
    publicClient.getProducts(function (err, response, data) {
        if (err) {
            console.log("ERROR: " + err)
        }
        else {
            fs.writeFile("./products/gdaxProducts.json", JSON.stringify(data), function(err) {
                if (err) {
                    console.log("ERROR: " + err)
                }
            })
        }
    })
}

function fetchBtrxProducts() {
    btrxApi.sendCustomRequest(btrxUrl + "getmarkets", function(data, err) {
        if (err) {
            console.log("ERROR: " + err)
        }
        else {
            fs.writeFile("./products/btrxProducts.json", JSON.stringify(data.result), function(err) {
                if (err) {
                    console.log("ERROR: " + err)
                }
            })
        }
    })
}

function fetchBnncProducts() {
    request(bnncUrl, function(err, response, data) {
        if (err) {
            console.log("ERROR: " + err)
        }
        else {
            fs.writeFile("./products/bnncProducts.json", JSON.stringify(JSON.parse(data).symbols), function(err) {
                if (err) {
                    console.log("ERROR: " + err)
                }
            })
        }
    })
}
