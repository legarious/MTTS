var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var coorrSchema = new Schema({
  x: { type: Number },
  y: { type: Number }
});

mongoose.model('car2', coorrSchema);
