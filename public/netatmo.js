/**
  login to get access token
*/
function login(){
  client_id = $(".client_id").val()
  client_secret = $(".client_secret").val()
  id = $(".id").val()
  password = $(".password").val()
  scope = $(".scope").val()
  redirect_uri = $(".redirect_uri").val()
  device_id = $(".device_id").val()

  url = 'access_token?'+'client_id='+client_id+'&client_secret='+client_secret+'&id='+id+'&password='+password+'&scope='+scope+'&redirect_uri='+redirect_uri+'&device_id='+device_id

  location.href = url
}
/**
  getRealTimeData
*/
function getRealTimeData(access_token, device_id){
  $.ajax({
    method: "GET",
    dataType: 'json',
    url: 'https://api.netatmo.com/api/getstationsdata?access_token='+access_token+'&device_id='+device_id,
    success : function(result){
      var data = {
                  'timestamp' : result.time_server,
                  'humidity' : result.body.devices[0].dashboard_data.Humidity,
                  'temperature' : result.body.devices[0].dashboard_data.Temperature,
                  'CO2' : result.body.devices[0].dashboard_data.CO2,
                  'noise' : result.body.devices[0].dashboard_data.Noise,
                  'pressure' : result.body.devices[0].dashboard_data.Pressure
      }

      $('.realtimeTable').append(`
      <tr>
      <td>${data.timestamp}</td>
      <td>${data.temperature}°C</td>
      <td>${data.humidity}%</td>
      <td>${data.noise}dB</td>
      <td>${data.pressure}mbar</td>
      <td>${data.CO2}ppm</td>
      </tr>`)

    },
    error : function(r, e){
      alert("statusCode : "+e.statusCode);
    }
  });
}
