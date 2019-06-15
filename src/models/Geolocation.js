var mongoose = require('mongoose');

var GeolocationSchema = new mongoose.Schema({
  lat: String,
  lng: String
});

module.exports = GeolocationSchema;
