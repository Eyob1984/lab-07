'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

const PORT = process.env.PORT;
const app = express();
app.use(cors());

//this is our grouping of .get's that will grab our information
app.get('/location', locationHandler);
// app.get('/weather', weatherHandler);

function locationHandler(request, response) {
  try{
    // let city = request.query.city;
    // let key = process.env.GEOCODE_API_KEY;
    const url =`https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${request.query.city}&format=json&limit=1`;

    superagent.get(url)
      .then(data => {
        console.log(data)
        const geoData = data.body[0];
        const locationData = new Location(request.query.city, geoData);
        response.send(locationData);
      })
      .catch(() => {
        errorHandler('location superagent broke', request, response);
      });
  }
  catch(error){
    errorHandler(error, request, response);
  }
}

// app.get('/weather', (request, response) => {
//   try{
//     const weatherData = require('./data/darksky.json');
//     const forecastData = weatherData.daily.data.map(day => new Weather(day));
//     response.send(forecastData);
//   }
//   catch(error){
//     errorHandler('We are so SOOORRRRRY...something went wrong....', request, response);
//   }
// });
// function Weather(day) {
//   this.time = new Date(day.time*1000).toString().slice(0,15);
//   this.forecast = day.summary;
// }
function Location(query, geoData){
  this.search_query = query;
  this.formatted_query = geoData.display_name;
  this.latitude = geoData.lat;
  this.longitude = geoData.lon;
}

function errorHandler(error, request, response) {
  response.status(500).send(error);
}
app.listen(PORT, () => console.log(`Server up on port ${PORT}`));





