const axios = require('axios');
var fahrenheitToCelsius = require('fahrenheit-to-celsius');

const mapBoxApiKey = "pk.eyJ1IjoiZnJpdHpzaWUiLCJhIjoiY2pzcmNwd2M4MTRucDQzbzBmZWRsbGZyaSJ9.k8JevUSR2rlQpjD-1o3Klg";
const weatherApiKey = '2837a087f2b105bcb4918e3434897843';

const getWeatherData = (address) => {
    address = encodeURI(address);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?limit=1&access_token=${mapBoxApiKey}`;
  
    let weatherData = {};

    return new Promise((resolve, reject) => {

        axios.get(url).then(( {data} ) => {
            console.log(data.features.length === 0 );
             if(data.features.length === 0 ){
              reject('Cannot find this location');
             }
            if (data.features[0].relevance < 1 || data.features.length === 0) {
               reject('Cannot find this location');
            }
             weatherData.locationConfidence = data.features[0].relevance;  
            const lat =  data.features[0].center[1];
            const long = data.features[0].center[0];
            
            const weatherUrl = `https://api.darksky.net/forecast/${weatherApiKey}/${lat},${long}`;
            console.log(weatherUrl)
            weatherData.location = data.features[0].place_name;
          
            return axios.get(weatherUrl);
        }).then(({ data }) => {
            weatherData.temperatur = Math.round(fahrenheitToCelsius(data.currently.temperature));
            weatherData.apperentTemp = Math.round(fahrenheitToCelsius(data.currently.apparentTemperature));
            weatherData.forecast = data.daily.summary;
            resolve(weatherData);
        })
            .catch((e) => {
                if (e.code === 'ENOTFOUND') {
                    reject({ error: 'Unable to connect to api servers' });
                }
            });
    });
};

const printMsg = ({ location, temperatur, apperentTemp }) => {
    console.log('Ort: ', location);
    console.log('Temperatur: ', Math.round(fahrenheitToCelsius(temperatur)));
    console.log('Gefühlte Temperatur: ', Math.round(fahrenheitToCelsius(apperentTemp)));
};

module.exports = {
    getWeatherData
};