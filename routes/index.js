var express = require('express');
var router = express.Router();

// route redirect to login
app.get('/', function(req, res) {
  res.render('login', {
    layout: false
  });
});

router.get('/logout', function(req, res) {
  res.render('login', {
    layout: false
  });
});
//Admin index---------------------------------------
router.get('/admin', (req, res) => {
  res.render('adminhome');
});

router.get('/adminedit', (req, res) => {
  res.render('adminedit');
});

//Staff index----------------------------------------
router.get('/staff', (req, res) => {
  res.render('staff');
});
//Guard index----------------------------------------
router.get('/guard', (req, res) => {
  res.render('guard');
});

// TESTING------------------------------------------
router.get('/home', (req, res) => {
  res.render('home');
});

module.exports = router;
