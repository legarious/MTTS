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
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var request = require('request');
var path = require('path');

//##############################################################
//Load mongoose model
require('./model/User');
require('./model/map');
require('./model/map1');
var User = mongoose.model('accounts');
var map = mongoose.model('car1');
var map1 = mongoose.model('car2');
//Load routes
var index = require('./routes/index');
// var routes = require('./routes/imagefile');
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
app.use(cookieParser('PJtheBest'));
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
    store: new MongoStore({ mongooseConnection: mongoose.connection })
    //cookie: { secure: true }
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new LocalStrategy(function(username, password, done) {
    console.log(username, password);
    User.findOne({ Username: username, Password: password }, function(
      err,
      user
    ) {
      //console.log(user);
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      // if (!user.validPassword(password)) {
      //   return done(null, false);
      // }
      return done(null, user);
    });
  })
);
passport.serializeUser(function(user, done) {
  //console.log(user.id);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  //console.log(id);
  User.findById(id, function(err, user) {
    //console.log(user);
    done(err, user);
  });
});
//use routes
app.use('/', index);
// app.use('/image', routes);
//count staff
io.on('connection', function(socket) {
  User.count({ Type: 'Staff' }, function(err, countpeople) {
    //console.log(countpeople);
    io.emit('h', countpeople);
  });
});
//count Driver
io.on('connection', function(socket) {
  User.count({ Type: 'Driver' }, function(err, countpeople1) {
    // console.log(countpeople1);
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
var result1, result2;
const random = (car1, xx, yy) => {
  xx = Number(`${xx}${Math.floor(Math.random() * 1000000 + 1)}`);
  yy = Number(`${yy}${Math.floor(Math.random() * 1000000 + 1)}`);
  db.collection('car1').save({
    id: 'ID1',
    x: xx,
    y: yy
  });
  map
    .findOne({ id: 'ID1' }, function(err, data) {
      result1 = data.x;
      result2 = data.y;
      // console.log(result1);
      // console.log(result2);
      // console.log(typeof data);
    })
    .sort([['_id', -1]]);
  return {
    result1,
    result2
  };
};
//Fake Coordinate X and Y
(function loop() {
  setInterval(function() {
    io.emit('c', random('car1', 14.061, 100.601));
  }, 1090);
})();
var result3, result4;
const random1 = (car2, x1, y1) => {
  x1 = Number(`${x1}${Math.floor(Math.random() * 1000000 + 1)}`);
  y1 = Number(`${y1}${Math.floor(Math.random() * 1000000 + 1)}`);
  db.collection('car2').save({
    id: 'ID2',
    x: x1,
    y: y1
  });
  map1
    .findOne({ id: 'ID2' }, function(err, data1) {
      result3 = data1.x;
      result4 = data1.y;
      console.log(result3);
      console.log(result4);

      console.log(typeof data1);
    })
    .sort([['_id', -1]]);
  return {
    result3,
    result4
  };
};
//Fake Coordinate X and Y
(function loop() {
  setInterval(function() {
    io.emit('co', random1('car2', 14.064, 100.611));
  }, 1090);
})();
