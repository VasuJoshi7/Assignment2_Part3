var express = require('express');
var router = express.Router();
var Users = require("../models/user");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title:"Home" });
});

router.get('/login', function (req, res, next) {
  res.render('login', { title:"Login" });
});

router.post('/login', function (req, res, next) {
  console.log(req.body);
  const user = Users.findOne({ email: req.body.email, password: req.body.password });
  res.render("taskList");

});

router.get('/register', function (req, res, next) {
  res.render('register_form', { title: 'New Account' });
});


module.exports = router;
