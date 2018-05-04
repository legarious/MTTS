var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
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

/** Before
 * app.get('/admin', (req, res) => {
 *   res.render('adminhome'); <- ก่อนหน้านี้เราไม่ได้ส่งค่าไป
 * });
 */
// After
router.get('/admin', (req, res) => {
  res.render('admin', {
    admin: true // ตอนนี้เราส่งค่า admin ไปเป็น true ทำให้ตอน render มัน render sidebar ของ admin
  });
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
router.get('/adminedit', (req, res) => {
  res.render('adminedit', {
    admin: 'Pojop P.' // ลองเข้าไปดู Line: 7 ใน sidebar/_admin.hbs
  });
});

router.get('/adminstat', (req, res) => {
  res.render('adminstat', {
    admin: 'Pojop P.' // ลองเข้าไปดู Line: 7 ใน sidebar/_admin.hbs
  });
});

router.get('/adminbio', (req, res) => {
  res.render('adminbio', {
    admin: 'Pojop P.' // ลองเข้าไปดู Line: 7 ใน sidebar/_admin.hbs
  });
});

router.get('/adminnoti', (req, res) => {
  res.render('adminnoti', {
    admin: 'Pojop P.' // ลองเข้าไปดู Line: 7 ใน sidebar/_admin.hbs
  });
});
//Staff index----------------------------------------
router.get('/staff', (req, res) => {
  res.render('staff', {
    staff: true
  });
});

router.get('/staffbio', (req, res) => {
  res.render('staffbio', {
    staff: true
  });
});

router.get('/staffnoti', (req, res) => {
  res.render('staffnoti', {
    staff: true
  });
});

router.get('/staffmap', (req, res) => {
  res.render('staffmap', {
    staff: true
  });
});
//Guard index----------------------------------------
router.get('/guard', (req, res) => {
  res.render('guard', {
    guard: true
  });
});

router.get('/guardbio', (req, res) => {
  res.render('guardbio', {
    guard: true
  });
});

// TESTING------------------------------------------
router.get('/home', (req, res) => {
  res.render('home');
});

module.exports = router;
