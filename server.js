/*eslint no-undef: "error"*/
/*eslint-env node*/
var http = require('http');
var express = require('express');
var router = express.Router();
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var hbs = require('express-handlebars');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');

//##############################################################
//Load mongoose model
require('./model/User');
var User = mongoose.model('accounts');
//Load routes
var index = require('./routes/index');
// Database connect
var url = 'mongodb://Test1:12345@ds253889.mlab.com:53889/mtts';
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Database connect successfully!!');
});

dbName = 'mtts';
//Handlebars middleware
app.engine(
  '.hbs',
  hbs({
    extname: '.hbs',
    defaultLayout: 'main'
  })
);

app.set('view engine', '.hbs');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
//express read file in public
app.use(express.static(__dirname + '/public'));
//session use
app.use(
  session({
    secret: 'PJtheBest',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { secure: true }
  })
);
//use routes
app.use('/', index);

//Get Data

//Update Data

//count staff
io.on('connection', function(socket) {
  User.count({ Type: 'Staff' }, function(err, countpeople) {
    console.log(countpeople);
    io.emit('h', countpeople);
  });
});
//count Driver
io.on('connection', function(socket) {
  User.count({ Type: 'Driver' }, function(err, countpeople1) {
    console.log(countpeople1);
    io.emit('hh', countpeople1);
  });
});

// Change the 404 message modifing the middleware
app.use(function(req, res) {
  res.status(404).send("Sorry, that route doesn't exist.");
});
// People online in the system
var online = 0;
io.on('connection', function(socket) {
  online = online + 1;
  io.emit('d', online);
});
io.on('disconnect', function(socket) {
  online = online - 1;
  io.emit('d', online);
});

// start the server in the port 3000 !
server.listen(3000, function() {
  console.log('Example app Running on port 3000.');
});

const random = (x, y) => {
  return {
    x: Number(`${x}.${Math.floor(Math.random() * 1000000 + 1)}`),
    y: Number(`${y}.${Math.floor(Math.random() * 1000000 + 1)}`)
  };
};
//Fake Coordinate X and Y
(function loop() {
  setInterval(function() {
    io.emit('c', random(14, 100));
  }, 1090);
})();
