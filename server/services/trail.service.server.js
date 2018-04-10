const weatherKey = "b012af5c98c960b4c44662551d3830bd";
const weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?";
const key = "e55af6a71db15349e0eff7663ed2dbfce8657bf6f82c836a36858e6e9ef90230";
const trailsUrl = "https://api.transitandtrails.org/api/v1/";
const axios = require('axios');

module.exports = function (app, model) {
  app.get('/api/trail/:lng/:lat', searchTrailsNear);
  app.get('/api/trail/:id', getTrailById);
  app.get('/api/trails/:id/attributes', getTrailAttributes);
  app.get('/api/trails/photos/:id', getTrailPhotos);
  app.get('/api/trails/maps/:id', getTrailMaps);
  app.get('/api/trails/weather/:lat/:lng', getWeatherData);

  function searchTrailsNear(req, res) {
    const lng = req.params.lng;
    const lat = req.params.lat;
    const url = trailsUrl + "trailheads?" + "distance=30&longitude=" + lng + "&latitude=" + lat + "&key=" + key;

    axios.get(url).then(response => res.send(response.data));
  }

  function getTrailById(req, res) {
    const trailId = req.params.id;
    const url = trailsUrl + "trailheads?id=" + trailId + "&key=" + key;
    axios.get(url).then(response => res.send(response.data));
  }

  function getTrailAttributes(req, res) {
    const trailId = req.params.id;
    const url = trailsUrl + "trailheads/" + trailId + "/attributes" + "?key=" + key;
    axios.get(url).then(response => res.send(response.data));
  }

  function getTrailPhotos(req, res) {
    const trailId = req.params.id;
    const url = trailsUrl + "trailheads/" + trailId + "/photos" + "?key=" + key;
    axios.get(url).then(response => res.send(response.data));
  }

  function getTrailMaps(req, res) {
    const trailId = req.params.id;
    const url = trailsUrl + "trailheads/" + trailId + "/maps" + "?key=" + key;
    axios.get(url).then(response => res.send(response.data));
  }

  function getWeatherData(req, res) {
    const lat = req.params.lat;
    const lng = req.params.lng;
    const url = weatherUrl + "lat=" + lat + "&lon=" + lng + "&units=imperial" + "&appid=" + weatherKey;
    axios.get(url).then(response => res.send(response.data));
  }
};