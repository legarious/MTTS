var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const session = require('express-session');
var cookieParser = require('cookie-parser');
var moment = require('moment');
var passport = require('passport');

var url = 'mongodb://Test1:12345@ds253889.mlab.com:53889/mtts';
mongoose.connect(url);
var db = mongoose.connection;

//Load mongoose model
require('../model/User');
var User = mongoose.model('accounts');
//insert data to database
router.post('/insert', function(req, res) {
  console.log(req.body);
  var newUser = new User({
    Type: req.body.Type,
    Username: req.body.Username,
    Password: req.body.Password,
    Company: req.body.Company,
    Plate: req.body.Plate,
    ID: req.body.ID,
    Firstname: req.body.Firstname,
    Lastname: req.body.Lastname,
    BirthDate: req.body.BirthDate,
    Age: req.body.Age,
    Sex: req.body.Sex,
    HDate: req.body.HDate,
    Dept: req.body.Dept,
    POS: req.body.POS,
    HAddress: req.body.HAddress,
    MPhone: req.body.MPhone,
    HPhone: req.body.HPhone
  });
  db.collection('accounts').findOne(
    {
      ID: req.body.ID
    },
    function(err, data) {
      if (data) {
        User.find({}, function(err, docs) {
          res.render('adminedit', {
            user: docs,
            [req.user.Type]: true,
            name: req.user.Firstname
          });
        });

        console.log('This ID already exist');
      } else {
        new User(req.body)
          .save()
          .then(doc => {
            User.find({}, function(err, back) {
              req.session.Alldata = back;
              res.render('adminedit', {
                user: back,
                [req.user.Type]: true,
                name: req.user.Firstname
              });
            });
            console.log('ID Added');
          })
          .catch(e => console.log(e));
      }
    }
  );
});

//Authentication and Authorization Middleware
//Auth Admin
// var authadmin = function(req, res, next) {
//   console.log(req.session);
//   if (!req.session.user) {
//     res.redirect('login');
//   } else if (req.session.T == 'Admin') {
//     console.log('oooo');
//     return next();
//   }
// };

// {
//   if (req.session.Type == 'Admin') {
//     console.log('oooo');
//     return next();
//   }
// }

// //Auth Staff
// var authstaff = function(req, res, next) {
//   if ((req.session.user = undefined)) {
//     res.redirect('login');
//   } else {
//     if (req.session.Type == 'Staff') {
//       return next();
//     }
//   }
// };
// //Auth Guard
// var authguard = function(req, res, next) {
//   if ((req.session.user = undefined)) {
//     res.render('login');
//   } else {
//     if (req.session.Type == 'Guard') {
//       return next();
//     }
//   }
// };

router.get('/', function(req, res) {
  res.render('login', {
    layout: false
  });
});
router.post('/newsadd', function(req, res) {
  console.log(req.body);
  var currenttime = new Date().getTime();

  console.log(currenttime);
  db.collection('addmessage').save({
    msgtype: req.body.msgtype,
    message: req.body.message,
    starttime: currenttime
  });
  res.redirect('/adminnoti');
});
router.post('/login', (req, res, next) => {
  console.log(req.body);
  User.findOne({ Username: req.body.username })
    .then(user => {
      if (user.Type === 'Admin') {
        passport.authenticate('local', {
          successRedirect: '/admin',
          failureRedirect: '/'
        })(req, res, next);
      } else if (user.Type === 'Staff') {
        passport.authenticate('local', {
          successRedirect: '/staff',
          failureRedirect: '/'
        })(req, res, next);
      } else if (user.Type === 'Guard') {
        passport.authenticate('local', {
          successRedirect: '/guard',
          failureRedirect: '/'
        })(req, res, next);
      }
    })
    .catch(e => {
      console.log(e);
      res.redirect('/');
    });
});
// router.post('/login', function(req, res) {
//   //console.log(req.body);
//   var user = req.body.loginUsername;
//   var pass = req.body.loginPassword;
//   db
//     .collection('accounts')
//     .findOne({ Username: user, Password: pass }, function(err, data) {
//       if (data) {
//         console.log('Post from login page---------------------');
//         console.log(data);
//         //login pass
//         req.session.Data = data;
//         req.session.Firstname = data.Firstname;
//         req.session.user = data.ID;
//         req.session.T = data.Type;
//         console.log(req.session.user);
//         res.cookie('user', req.session.ID, {
//           maxAge: 30000
//         });
//         res.cookie('type', req.session.Type, {
//           maxAge: 30000
//         });
//         console.log(data.Type);
//         console.log('Cookies: ', req.cookies);
//         console.log(req.session);
//         if (data.Type == 'Admin') {
//           res.render('admin', {
//             name: req.session.Firstname,
//             [req.session.type]: true
//           });
//         } else if (data.Type == 'Staff') {
//           res.render('staff', {
//             name: req.session.Firstname,
//             [req.session.type]: true
//           });
//         } else if (data.Type == 'Guard') {
//           res.render('guard', {
//             name: req.session.Firstname,
//             [req.session.type]: true
//           });
//         }
//       } else {
//         res.render('login');
//       }
//     });
// });
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});
//Admin index---------------------------------------
router.get('/admin', (req, res) => {
  console.log(req);
  User.find({ Type: 'Driver' }, function(err, docs) {
    res.render('admin', {
      user: docs,
      [req.user.Type]: true,
      name: req.user.Firstname
    });
  });
});
router.get('/snapshot', (req, res) => {
  res.render('snapshot', {
    [req.user.Type]: true,
    name: req.user.Firstname
  });
});

router.get('/adminedit', (req, res) => {
  User.find({}, function(err, docs) {
    res.render('adminedit', {
      user: docs,
      [req.user.Type]: true,
      name: req.user.Firstname
    });
  });
});
router.post('/edit', (req, res) => {
  User.update({ ID: req.body.ID }, req.body, function(err, data) {
    res.redirect('back');
  });
});
router.get('/adminstat', (req, res) => {
  res.render('adminstat', {
    [req.user.Type]: true,
    name: req.user.Firstname
  });
});
router.get('/deleteuser', (req, res) => {
  User.remove({ ID: req.query.user }, function(err, data) {
    User.find({}, function(err, docs) {
      res.render('adminedit', {
        user: docs,
        [req.user.Type]: true,
        name: req.user.Firstname
      });
    });
  });
});
router.get('/edit', (req, res) => {
  User.findOne({ ID: req.query.user }, function(err, data) {
    res.render('edit', {
      [req.user.Type]: true,
      data: data,
      date1: moment(data.BirthDate).format('DD MMMM YYYY'),
      date2: moment(data.HireDate).format('DD MMMM YYYY')
    });
  });
});
router.get('/adminbio', (req, res) => {
  console.log(req.user);
  res.render('adminbio', {
    [req.user.Type]: true,
    name: req.user.Firstname,
    userbio: req.user,
    name: req.user.Firstname,
    Hdate: moment(req.user.HDate).format('DD MMMM YYYY'),
    Bdate: moment(req.user.BirthDate).format('DD MMMM YYYY')
  });
});
router.get('/adminnoti', (req, res) => {
  db
    .collection('addmessage')
    .find()
    .sort([['_id', -1]])
    .limit(5)
    .toArray(function(err, data) {
      console.log(data);
      res.render('adminnoti', {
        [req.user.Type]: true,
        name: req.user.Firstname,
        msg: data
      });
    });
});
//Staff index---------------------------------------------------------
router.get('/staff', (req, res) => {
  db
    .collection('addmessage')
    .find({ msgtype: 'Staff' })
    .sort([['_id', -1]])
    .limit(5)
    .toArray(function(err, data) {
      console.log(data);
      var senddata = [];
      var endtime = 30000;
      var today = new Date().getTime();
      for (var i = 0; i < data.length; i++) {
        if (today - data[i].starttime < endtime) {
          senddata.push(data[i]);
        }
      }
      if (senddata.length == 0) {
        senddata = false;
      }
      console.log(senddata);
      res.render('staff', {
        [req.user.Type]: true,
        name: req.user.Firstname,
        msg: senddata
      });
    });
});

router.get('/staffbio', (req, res) => {
  console.log(req.user);
  res.render('staffbio', {
    [req.user.Type]: true,
    name: req.user.Firstname,
    userbio: req.user,
    name: req.user.Firstname,
    Hdate: moment(req.user.HDate).format('DD MMMM YYYY'),
    Bdate: moment(req.user.BirthDate).format('DD MMMM YYYY')
  });
});
router.get('/viewdriver', (req, res) => {
  User.find({ Type: 'Driver' }, function(err, data) {
    res.render('viewdriver', {
      [req.user.Type]: true,
      name: req.user.Firstname,
      userbio: req.user,
      name: req.user.Firstname,
      alldriver: data
    });
  });
});
router.get('/staffnoti', (req, res) => {
  res.render('staffnoti', {
    name: req.user.Firstname,
    [req.user.Type]: true
  });
});

router.get('/staffmap', (req, res) => {
  res.render('staffmap', {
    name: req.user.Firstname,
    [req.user.Type]: true
  });
});
//Guard index---------------------------------------------------------
router.get('/guard', (req, res) => {
  db
    .collection('addmessage')
    .find({ msgtype: 'Guard' })
    .sort([['_id', -1]])
    .limit(5)
    .toArray(function(err, data) {
      console.log(data);
      var senddata = [];
      var endtime = 30000;
      var today = new Date().getTime();
      for (var i = 0; i < data.length; i++) {
        if (today - data[i].starttime < endtime) {
          senddata.push(data[i]);
        }
      }
      if (senddata.length == 0) {
        senddata = false;
      }
      console.log(senddata);
      res.render('guard', {
        [req.user.Type]: true,
        name: req.user.Firstname,
        msg: senddata
      });
    });
});

router.get('/guardbio', (req, res) => {
  res.render('staffbio', {
    [req.user.Type]: true,
    name: req.user.Firstname,
    userbio: req.user,
    name: req.user.Firstname,
    Hdate: moment(req.user.HDate).format('DD MMMM YYYY'),
    Bdate: moment(req.user.BirthDate).format('DD MMMM YYYY')
  });
});

module.exports = router;
