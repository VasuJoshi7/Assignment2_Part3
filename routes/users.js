var express = require('express');
var router = express.Router();
var Users = require("../model/User")


module.exports = function (passport) {
  router.post('/register', function (req, res, next) {
    console.log(req.body);
    var body = req.body,
      Fullname = req.body.fullname,
      Username = req.body.username,
      Password = req.body.password;
    Users.findOne({ username: Username }, function (error, doc) {
      if (error) {
        res.status(500).render('register', { User: req.body, message: 'error occured' })
      } else {
        if (doc) {
          res.status(500).render('register', { User: req.body, message: "Email address alredy exists" })
        } else {
          var record = new Users();
          record.fullname = Fullname;
          record.username = Username;
          record.password = record.hashPassword(Password);
          record.save(function (error, user) {
            if (error) {
              console.log(error);
              res.status(500).send("connectivity error")
            } else {
              res.redirect('/login');
            }
          })
        }
      }
    })
  });


  router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/task',
  }), function (req, res) {
    res.send("hey");

  });
  return router;
};


