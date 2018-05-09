var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const session = require('express-session');

var url = 'mongodb://Test1:12345@ds253889.mlab.com:53889/mtts';
mongoose.connect(url);
var db = mongoose.connection;

//Load mongoose model
require('../model/User');
var User = mongoose.model('accounts');

//Authentication and Authorization Middleware
//Auth Admin
var authadmin = function(req, res, next) {
  console.log(req.session);
  if (req.session.user != undefined) {
    if (req.session.Type == 'Admin') {
      console.log('oooo');
      return next();
    }
  } else {
    res.render('login');
  }
};
//Auth Staff
var authstaff = function(req, res, next) {
  if (req.session.user != undefined) {
    if (req.session.Type == 'Staff') {
      return next();
    }
  } else {
    res.render('login');
  }
};
//Auth Guard
var authguard = function(req, res, next) {
  if (req.session.user != undefined) {
    if (req.session.Type == 'Guard') {
      return next();
    }
  } else {
    res.render('login');
  }
};

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
        req.session.user = data.ID;
        console.log(req.session.user);
        res.cookie('user', data.ID, {
          maxAge: 3000
        });
        req.session.type = data.Type;
        res.cookie('type', data.Type, {
          maxAge: 3000
        });
        console.log(data.Type);
        if (data.Type == 'Admin') {
          res.render('admin', {
            admin: true
          });
        } else if (data.Type == 'Staff') {
          res.render('staff', {
            staff: true
          });
        } else if (data.Type == 'Guard') {
          res.render('guard', {
            guard: true
          });
        }
      } else {
        res.send('not pass');
      }
    });
});
router.get('/logout', function(req, res) {
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
router.get('/admin', authadmin, (req, res) => {
  User.find({ Type: 'Driver' }, function(err, docs) {
    res.render('admin', {
      user: docs,
      admin: true
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

router.get('/adminedit', authadmin, (req, res) => {
  // var aloha = db.collection('accounts').find({ Type: { $not: /^A.*/ } });
  User.find({}, function(err, docs) {
    res.render('adminedit', {
      user: docs,
      admin: true
    });
  });
});

router.get('/adminstat', authadmin, (req, res) => {
  res.render('adminstat', {
    admin: 'Pojop P.' // ลองเข้าไปดู Line: 7 ใน sidebar/_admin.hbs
  });
});

router.get('/adminbio', (req, res) => {
  res.render('adminbio', {
    admin: 'Pojop P.' // ลองเข้าไปดู Line: 7 ใน sidebar/_admin.hbs
  });
});

router.get('/adminnoti', authadmin, (req, res) => {
  res.render('adminnoti', {
    admin: 'Pojop P.' // ลองเข้าไปดู Line: 7 ใน sidebar/_admin.hbs
  });
});
//Staff index---------------------------------------------------------
router.get('/staff', authstaff, (req, res) => {
  res.render('staff', {
    staff: true
  });
});

router.get('/staffbio', (req, res) => {
  res.render('staffbio', {
    staff: true
  });
});

router.get('/staffnoti', authstaff, (req, res) => {
  res.render('staffnoti', {
    staff: true
  });
});

router.get('/staffmap', authstaff, (req, res) => {
  res.render('staffmap', {
    staff: true
  });
});
//Guard index---------------------------------------------------------
router.get('/guard', authguard, (req, res) => {
  res.render('guard', {
    guard: true
  });
});

router.get('/guardbio', authguard, (req, res) => {
  res.render('guardbio', {
    guard: true
  });
});

module.exports = router;
