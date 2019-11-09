var mongoose = require('mongoose');

var ContactPerson = new mongoose.Schema({
  name: { type: String, required: true },
  position: String,
  email: String,
  phones: [String]
});

module.exports = ContactPerson;
