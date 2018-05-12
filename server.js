/*eslint no-undef: "error"*/
/*eslint-env node*/

var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var hbs = require('express-handlebars');
//##############################################################

// Database connect
var url = 'mongodb://Test1:12345@ds253889.mlab.com:53889/mtts';
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log('Database Created!');
  db.close;
});

dbName = 'mtts';
//for insert data to mongodb
app.engine(
  '.hbs',
  hbs({
    extname: '.hbs',
    defaultLayout: 'main'
  })
);
app.set('view engine', '.hbs');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
//express read file in public
app.use(express.static(__dirname + '/public'));
// route redirect to login
app.get('/', function(req, res) {
  res.render('login');
});

//Get Data

//Update Data

io.on('connection', function(socket) {
  var countpeople;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    dbo
      .collection('accounts')
      .count({ Type: 'Staff' })
      .then(function(countpeople) {
        console.log(countpeople);
        io.emit('h', countpeople);
        db.close();
      });
  });
});

//insert from AdminEdit
app.post('/insert', function(req, res) {
  console.log(req.body);
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    var myobj = req.body;
    var Type = req.body.Type;
    var accounts = dbo.collection('accounts');

    dbo
      .collection('accounts')
      .findOne({ ID: req.body.ID }, function(err, data) {
        if (data) {
          res.redirect('/AdminEdit.html');
          console.log('This ID already exist');
        } else {
          dbo.collection('accounts').save(req.body, function(err2, data2) {
            res.redirect('/AdminEdit.html');
            console.log('ID Added');
          });
        }
      });
  });
});

// Change the 404 message modifing the middleware
app.use(function(req, res) {
  res.status(404).send("Sorry, that route doesn't exist.");
});
// send 'hello' to road A
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
