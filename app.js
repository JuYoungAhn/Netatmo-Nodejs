/**
    Netatmo API Using Node js
    By JuYoungAhn
    Contact
    https://github.com/JuYoungAhn
*/
var express = require('express');
var http = require('http');
var url = require('url')
var request = require('request')
var app = express();

app.locals.pretty = true;
app.set('view engine', 'jade');
app.set('views', './views');
app.use(express.static('public'));

// Main Page
app.get('/', function(req, res){
  res.render('index')
})

/**
    Get Access Token From User Information
*/
app.get('/access_token', function(req, res){
  var access_token = null // access_token
  var device_id = req.param('device_id') // device_id
  /**
    Reference :
    https://dev.netatmo.com/dev/resources/technical/guides/authentication/clientcredentials
  */

  // make request options
  var headers = {
      'Host': 'api.netatmo.com',
      'Content-Type':     'application/x-www-form-urlencoded',
      'charset': 'UTF-8'
  }
  var options = {
      url: 'https://api.netatmo.com/oauth2/token',
      method: 'POST',
      headers: headers,
      form: {
        'grant_type': 'password',
        'username': req.param('id'), // login id
        'password' : req.param('password'), // login password
        'client_id': req.param('client_id'), // app client_id
        'client_secret': req.param('client_secret'), // app secret
        'redirect_uri' : req.param('redirect_uri'), // redirect_url : dashboard
        'device_id' : req.param('device_id'), // device_id
        'scope' : req.param('scope') // scope
      }
  }

  // request access_token
  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("Success")
        json = JSON.parse(body) // parse data to json
        access_token = json.access_token // get accee_token
        res.render('access_token', {access_token : access_token, device_id : device_id})
      }
      else {
        console.log("Fail : "+response.statusCode)
        console.log(body)
      }
  })
})
app.get('/dashboard', function(req, res){
  var access_token = req.param('access_token')
  var device_id = req.param('device_id')

  /**
      Reference :
      https://dev.netatmo.com/dev/resources/technical/reference/weatherstation/getstationsdata
  */

  // make request options
  var headers = {
      'Host': 'api.netatmo.com',
      'Content-Type':     'application/x-www-form-urlencoded',
      'charset': 'UTF-8'
  }
  var options = {
      url: 'https://api.netatmo.com/api/getstationsdata',
      method: 'POST',
      headers: headers,
      form: {
        "access_token" : access_token,
        "device_id" : '70:ee:50:02:f5:36',
        "get_favorites" : false
      }
  }

  // request station data
  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("Success")
        console.log(body)
        result = JSON.parse(body)

        console.log("Result : ")
        console.log(result)

        console.log("Devices : ")
        console.log(result.body.devices)

        // make data
        var data = {
                    'timestamp' : result.time_server,
                    'humidity' : result.body.devices[0].dashboard_data.Humidity,
                    'temperature' : result.body.devices[0].dashboard_data.Temperature,
                    'CO2' : result.body.devices[0].dashboard_data.CO2,
                    'noise' : result.body.devices[0].dashboard_data.Noise,
                    'pressure' : result.body.devices[0].dashboard_data.Pressure
        }

        var module_name = result.body.devices[0].module_name
        var station_name = result.body.devices[0].station_name
        var place = {
          'altitude' : result.body.devices[0].place.altitude,
          'city' : result.body.devices[0].place.city,
          'country' : result.body.devices[0].place.country,
          'timezone' : result.body.devices[0].place.timezone,
          'location' : result.body.devices[0].place.location
        }

        res.render('dashboard', {data : data, access_token : access_token, device_id : device_id,
        module_name : module_name, station_name : station_name, place : place})
      }
      else {
        console.log("Fail : "+response.statusCode)
        console.log(body)
      }
  })
})
app.listen(3000, function(){
    console.log('Conneted 3000 port!')
})
