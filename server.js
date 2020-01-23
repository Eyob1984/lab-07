'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT;
const app = express();
app.use(cors());
//this is our grouping of .get's that will grab our information
app.get('/', (request, response) => {
  response.send('This is our Home Page');
});
app.get('/wrong', (request, response) => {
  response.send('OOPS! You did it again. Wrong route.');
});
app.get('/location', (request, response) => {
  try{
    const geoData = require('./data/geo.json');
    const city = request.query.city;
    const locationData = new Location(city, geoData);
    response.send(locationData);
  }
  catch(error){
    errorHandler('We are so SOOORRRRRY...something went wrong....', request, response);
  }
});
app.get('/weather', (request, response) => {
  try{
    const weatherData = require('./data/darksky.json');
    const forecastData = weatherData.daily.data.map(day => new Weather(day));
    response.send(forecastData);
  }
  catch(error){
    errorHandler('We are so SOOORRRRRY...something went wrong....', request, response);
  }
});
function Weather(day) {
  this.time = new Date(day.time*1000).toString().slice(0,15);
  this.forecast = day.summary;
}
function Location(city, geoData){
  this.searchQuery = city;
  this.formattedQuery = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}
function errorHandler(error, request, response) {
  response.status(500).send(error);
}
app.listen(PORT, () => console.log(`Server up on port ${PORT}`));





