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

//Fake Coordinate X and Y
function loop() {
  var data000000 = { x: 14.065656, y: 100.600456 };
  var data00000 = { x: 14.065625, y: 100.601968 };
  var data0000 = { x: 14.065562, y: 100.603717 };
  var data000 = { x: 14.065599, y: 100.605175 };
  var data00 = { x: 14.065479, y: 100.606839 };
  var data0 = { x: 14.065469, y: 100.608159 };
  var data1 = { x: 14.06533, y: 100.609797 };
  var data2 = { x: 14.064997, y: 100.611256 };
  var data3 = { x: 14.064997, y: 100.612544 };
  var data4 = { x: 14.064914, y: 100.613488 };
  var data5 = { x: 14.065208, y: 100.614149 };
  var data6 = { x: 14.065208, y: 100.615007 };
  var data7 = { x: 14.06475, y: 100.615822 };
  var data8 = { x: 14.064071, y: 100.615694 };
  var data10 = { x: 14.064571, y: 100.614599 };
  var data11 = { x: 14.064966, y: 100.613548 };
  var data12 = { x: 14.06507, y: 100.611574 };
  var data13 = { x: 14.065008, y: 100.609814 };
  var data14 = { x: 14.065112, y: 100.608355 };
  var data15 = { x: 14.065133, y: 100.606767 };
  var data16 = { x: 14.065133, y: 100.605088 };
  var data17 = { x: 14.065195, y: 100.603392 };
  var data18 = { x: 14.065006, y: 100.600069 };
  var data19 = { x: 14.065278, y: 100.5988 };
  var data20 = { x: 14.065006, y: 100.597601 };
  var data = data000000;
  setInterval(function() {
    // do your thing
    if (data === data000000) {
      io.emit('c', data000000);
      data = data00000;
    } else if (data === data00000) {
      io.emit('c', data00000);
      data = data0000;
    } else if (data === data0000) {
      io.emit('c', data0000);
      data = data000;
    } else if (data === data000) {
      io.emit('c', data000);
      data = data00;
    } else if (data === data00) {
      io.emit('c', data00);
      data = data0;
    } else if (data === data0) {
      io.emit('c', data0);
      data = data1;
    } else if (data === data1) {
      io.emit('c', data1);
      data = data2;
    } else if (data === data2) {
      io.emit('c', data2);
      data = data3;
    } else if (data === data3) {
      io.emit('c', data3);
      data = data4;
    } else if (data === data4) {
      io.emit('c', data4);
      data = data5;
    } else if (data === data5) {
      io.emit('c', data5);
      data = data6;
    } else if (data === data6) {
      io.emit('c', data6);
      data = data7;
    } else if (data === data7) {
      io.emit('c', data7);
      data = data8;
    } else if (data === data8) {
      io.emit('c', data8);
      data = data10;
    } else if (data === data10) {
      io.emit('c', data10);
      data = data11;
    } else if (data === data11) {
      io.emit('c', data11);
      data = data12;
    } else if (data === data12) {
      io.emit('c', data12);
      data = data13;
    } else if (data === data13) {
      io.emit('c', data13);
      data = data14;
    } else if (data === data14) {
      io.emit('c', data14);
      data = data15;
    } else if (data === data15) {
      io.emit('c', data15);
      data = data16;
    } else if (data === data16) {
      io.emit('c', data16);
      data = data17;
    } else if (data === data17) {
      io.emit('c', data17);
      data = data18;
    } else if (data === data18) {
      io.emit('c', data18);
      data = data19;
    } else if (data === data20) {
      io.emit('c', data20);
    }
  }, 1090);
}
loop();
