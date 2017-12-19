const request = require('request')
const gdaxApi = require('gdax')
const btrxApi = require('node-bittrex-api')
const fs = require('fs')

const btrxUrl = "https://bittrex.com/api/v1.1/public/"
const btrxUrl2 = "https://bittrex.com/Api/v2.0/pub/market/GetTicks?marketName=BTC-LTC&tickInterval="

//startDate = '2017-11-19T00:00:00+00:00'
//endDate = '2017-12-19T00:00:00+00:00'
//1512432000000
startDate = 1512460800000 //12/05
endDate = 1513641600000 //12/19

granularity = 3600

tickInterval = "hour"


getGdaxData(startDate, endDate, granularity, 'gdax')
getBtrxData(tickInterval, "btrx")

function getGdaxData(startDate, endDate, granularity, filename) {

    var start = startDate
    var interval = (granularity*1000*199)
    var end = start + interval
    var requests = 0
    var publicClient = new gdaxApi.PublicClient('LTC-BTC')
    for (i = start; i < endDate; i += interval) {
        publicClient.getProductHistoricRates({'start': new Date(i), 'end': new Date(end), 'granularity': granularity}, function(err, response, data) {
            if (err) {
                console.log("ERROR: " + err)
            }
            else {
                console.log(data)
                arraysToCSV(data, filename + "_" + requests)
                requests++
            }
        })
        end += interval
    }
    console.log("Number of requests: " + requests)
}

function getBtrxData(tickInterval, filename) {
    btrxApi.sendCustomRequest(btrxUrl2 + tickInterval, function(data, err) {
        if (err) {
            console.log("ERROR: " + err)
        }
        else {
            console.log(data)
            console.log(data.result.length)
            objectsToCSV(data.result, filename)
        }
    })
}

function objectsToCSV(objectArray, filename) {

    var keys = Object.keys(objectArray[0])

    var result = keys.join(",") + "\n"

    objectArray.forEach(function(obj) {
        keys.forEach(function(currentValue, index) {
            if (index) result += ","
            result += obj[currentValue]
        })
        result += "\n"
    })
    fs.writeFile("./data/" + filename + ".csv", result, function(err) {
        if (err)  {
            console.log("ERROR: " + err)
        }
    })
}

function arraysToCSV(arrayArray, filename) {
    var result = ""

    for (i = 0; i < arrayArray.length; i ++) {
        for (j = 0; j < arrayArray[i].length; j ++) {
            if (j) result += ","
            result += arrayArray[i][j]
        }
        result += "\n"
    }
    fs.writeFile("./data/" + filename + ".csv", result, function(err) {
        if (err) {
            console.log("ERROR: " + err)
        }
    })
}
