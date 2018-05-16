var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var coorSchema = new Schema({
  x: { type: Number },
  y: { type: Number }
});

mongoose.model('car1', coorSchema);
