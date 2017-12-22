var home = 'ws://192.168.1.69:8081'
var away = 'ws://192.168.70.56:8081'

var ws = new WebSocket(away)

var messageCount = 0

document.getElementById('header').innerHTML = "Falcon"

ws.onopen = function() {
    console.log('Websocket connected...')
    ws.send('connected')
}

ws.onmessage = function (message) {

    var exchanges = JSON.parse(message.data)

    if (messageCount == 0) {
        createTable(exchanges, 'LTC-BTC')
    }

    updateTable(exchanges, 'LTC-BTC')
    console.log(message)
    messageCount++
}

function updateTable(exchanges, product) {
    table = document.getElementById('content').childNodes[0]

    for (i = 0; i < exchanges.length; i++) {
        for (j = 0; j < exchanges.length; j++) {
            if (i != j) {
                table.rows[i+1].cells[j+1].textContent = exchanges[i].products[product].lastTradePrice / exchanges[j].products[product].lastTradePrice
            }
            else {
                table.rows[i+1].cells[j+1].textContent = exchanges[i].products[product].lastTradePrice
            }
        }
    }
}

function createTable(exchanges, product) {
    var row = null, table = document.createElement("table")
    table.className = "table table-hover table-bordered"

    row = table.insertRow()
    row.insertCell().textContent = product

    for (k = 0; k < exchanges.length; k++) {
        row.insertCell().textContent = exchanges[k].name
    }

    for (i = 0; i < exchanges.length; i++) {
        row = table.insertRow()
        row.insertCell().textContent = exchanges[i].name

        for (j = 0; j < exchanges.length; j++) {
            if (i != j) {
                row.insertCell().textContent = exchanges[i].products[product].lastTradePrice / exchanges[j].products[product].lastTradePrice
            }
            else {
                row.insertCell().textContent = exchanges[i].products[product].lastTradePrice
            }
        }
    }
    document.getElementById('content').appendChild(table)
    //return table
}

function updateClock () {
  var currentTime = new Date ( );

  var currentHours = currentTime.getHours ( );
  var currentMinutes = currentTime.getMinutes ( );
  var currentSeconds = currentTime.getSeconds ( );

  // Pad the minutes and seconds with leading zeros, if required
  currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
  currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;

  // Choose either "AM" or "PM" as appropriate
  var timeOfDay = ( currentHours < 12 ) ? "AM" : "PM";

  // Convert the hours component to 12-hour format if needed
  //currentHours = ( currentHours > 12 ) ? currentHours - 12 : currentHours;

  // Convert an hours component of "0" to "12"
  //currentHours = ( currentHours == 0 ) ? 12 : currentHours;

  // Compose the string for display
  var currentTimeString = currentHours + ":" + currentMinutes + ":" + currentSeconds + " " + timeOfDay;

  // Update the time display
  document.getElementById("clock").innerHTML = currentTimeString;
}
