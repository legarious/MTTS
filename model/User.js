var mongoose = require('mongoose');

var Schema = mongoose.Schema;
//Schema
var accountSchema = new Schema({
  Type: { type: String, required: true },
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Company: { type: String, required: true },
  Plate: { type: String },
  ID: { type: String },
  Firstname: { type: String, required: true },
  Lastname: { type: String, required: true },
  BirthDate: { type: Date },
  Age: { type: Number },
  Sex: { type: String },
  HDate: { type: Date, required: true },
  POS: { type: String },
  HAddress: { type: String, required: true },
  MPhone: { type: Number },
  HPhone: { type: Number }
});

mongoose.model('accounts', accountSchema);
