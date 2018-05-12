var mongoose = require('mongoose');

var Schema = mongoose.Schema;
//Schema
var accountSchema = new Schema({
  Type: { type: String, required: true },
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Company: { type: String },
  Plate: { type: String },
  ID: { type: String },
  Firstname: { type: String, required: true },
  Lastname: { type: String, required: true },
  BirthDate: { type: Date },
  Age: { type: Number },
  Sex: { type: String },
  HireDate: { type: Date, default: Date.now },
  Dept: { type: String, required: true },
  POS: { type: String },
  HAddress: { type: String, required: true },
  MPhone: { type: Number },
  HPhone: { type: Number }
});

mongoose.model('accounts', accountSchema);
