var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const session = require('express-session');
var cookieParser = require('cookie-parser');
var moment = require('moment');

var url = 'mongodb://Test1:12345@ds253889.mlab.com:53889/mtts';
mongoose.connect(url);
var db = mongoose.connection;

//Load mongoose model
require('../model/User');
var User = mongoose.model('accounts');

//Authentication and Authorization Middleware
//Auth Admin
// var authadmin = function(req, res, next) {
//   console.log(req.session);
//   if (!req.session.user) {
//     res.redirect('login');
//   } else if (req.session.type == 'Admin') {
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

router.post('/login', function(req, res) {
  //console.log(req.body);
  var user = req.body.loginUsername;
  var pass = req.body.loginPassword;
  db
    .collection('accounts')
    .findOne({ Username: user, Password: pass }, function(err, data) {
      if (data) {
        console.log('Post from login page---------------------');
        console.log(data);
        //login pass
        req.session.Data = data;
        req.session.Firstname = data.Firstname;
        req.session.user = data.ID;
        req.session.type = data.Type;
        console.log(req.session.user);
        res.cookie('user', req.session.ID, {
          maxAge: 30000
        });
        res.cookie('type', req.session.Type, {
          maxAge: 30000
        });
        console.log(data.Type);
        console.log('Cookies: ', req.cookies);
        if (data.Type == 'Admin') {
          res.render('admin', {
            name: req.session.Firstname,
            [req.session.type]: true
          });
        } else if (data.Type == 'Staff') {
          res.render('staff', {
            name: req.session.Firstname,
            [req.session.type]: true
          });
        } else if (data.Type == 'Guard') {
          res.render('guard', {
            name: req.session.Firstname,
            [req.session.type]: true
          });
        }
      } else {
        res.render('login');
      }
    });
});
router.get('/logout', function(req, res) {
  req.session.destroy();
  res.render('login', {
    layout: false
  });
});
//Admin index---------------------------------------

/** Before
 * app.get('/admin', (req, res) => {
 *   res.render('adminhome'); <- ก่อนหน้านี้เราไม่ได้ส่งค่าไป
 * });
 */
// After
router.get('/admin', (req, res) => {
  console.log(req.session);
  User.find({ Type: 'Driver' }, function(err, docs) {
    res.render('admin', {
      user: docs,
      [req.session.type]: true,
      name: req.session.Firstname
    });
  });

  // User.find({ Type: 'Driver' }).then(user => {
  //   res.render('admin', {
  //     user,
  //     admin: true
  //   });
  // });
});

/**
 * ค่าสามารถส่งไปเป็นอะไรก็ได้ แล้วเราก็สามารถเอาไปใช้ได้
 * เช่น ส่ง user: 'Pojop P.'
 * ก็สามารถเอา user ไปใส่ใน sidebar ตรงที่เป็นชื่อคนได้
 * ---------- sidebar/*.hbs ----------
 *  ===== Before =====
 *  5 <div class="title">
 *  6   <h1 class="h4">{{user}}</h1>
 *  7    <p>Staff</p>
 *  8 </div>
 *  ===== After =====
 *  5 <div class="title">
 *  6   <h1 class="h4">Pojop P.</h1> | ใน {{user}} ก็จะถูกแทนที่ด้วย Pojop P. ที่เราส่งมาตอน render
 *  7    <p>Staff</p>
 *  8 </div>
 */
// router.get('/adminedit', (req, res) => {
//   res.render('adminedit', {
//     admin: 'Pojop P.' // ลองเข้าไปดู Line: 7 ใน sidebar/_admin.hbs
//   });
// });

router.get('/adminedit', (req, res) => {
  // var aloha = db.collection('accounts').find({ Type: { $not: /^A.*/ } });
  User.find({}, function(err, docs) {
    res.render('adminedit', {
      user: docs,
      [req.session.type]: true,
      name: req.session.Firstname
    });
  });
});

router.post('/edit', (req, res) => {
  User.update(req.body, function(err, data) {
    res.redirect('back');
  });
});
router.get('/adminstat', (req, res) => {
  res.render('adminstat', {
    [req.session.type]: true,
    name: req.session.Firstname // ลองเข้าไปดู Line: 7 ใน sidebar/_admin.hbs
  });
});
router.get('/deleteuser', (req, res) => {
  User.remove({ ID: req.query.user }, function(err, data) {
    res.redirect('back');
  });
});

router.get('/edit', (req, res) => {
  User.findOne({ ID: req.query.user }, function(err, data) {
    res.render('edit', {
      [req.session.type]: true,
      data: data
    });
  });
});
router.get('/adminbio', (req, res) => {
  res.render('adminbio', {
    [req.session.type]: true,
    name: req.session.Firstname,
    userbio: req.session.Data,
    Hdate: moment(req.session.Data.Hdate).format('DD MMMM YYYY'),
    Bdate: moment(req.session.Data.BirthDate).format('DD MMMM YYYY') // ลองเข้าไปดู Line: 7 ใน sidebar/_admin.hbs
  });
});

router.get('/adminnoti', (req, res) => {
  res.render('adminnoti', {
    [req.session.type]: true,
    name: req.session.Firstname // ลองเข้าไปดู Line: 7 ใน sidebar/_admin.hbs
  });
});
//Staff index---------------------------------------------------------
router.get('/staff', (req, res) => {
  res.render('staff', {
    name: req.session.Firstname,
    [req.session.type]: true
  });
});

router.get('/staffbio', (req, res) => {
  res.render('staffbio', {
    name: req.session.Firstname,
    [req.session.type]: true
  });
});

router.get('/staffnoti', (req, res) => {
  res.render('staffnoti', {
    name: req.session.Firstname,
    [req.session.type]: true
  });
});

router.get('/staffmap', (req, res) => {
  res.render('staffmap', {
    name: req.session.Firstname,
    [req.session.type]: true
  });
});
//Guard index---------------------------------------------------------
router.get('/guard', (req, res) => {
  res.render('guard', {
    name: req.session.Firstname,
    [req.session.type]: true
  });
});

router.get('/guardbio', (req, res) => {
  res.render('guardbio', {
    name: req.session.Firstname,
    [req.session.type]: true
  });
});

module.exports = router;
