var express = require('express');
var router = express.Router();
var User = require("../model/User");
var passport = require("passport")
const Task = require('../model/task');
var isLoggedIn = require("../auth");


router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express', user: req.user });
});

router.get('/login', function (req, res, next) {
  res.render("login", { username: "", password: "", message: '' });
});

router.get('/register', function (req, res, next) {
  var usr = new User();
  res.render("register", { User: usr });
});

router.get("/logout", function (req, res, next) {
  req.logOut();
  res.redirect('/')
});

router.get('/task', isLoggedIn, async (req, res) => {

  try {
    console.log("Retriving task list from database");
    await User.findOne({ username: req.session.passport.user.username }, (err, document) => {
      if (err) {
        res.render("error", { message: "Failed to load data, Please try to contact administrator" }); F
      }

      if (document) {
        Task.find({ 'createdBy': document._id }, (err, doc) => {
          console.log(doc);
          res.render("TaskList", { title: "All Events", taskList: doc, user: req.user });
        });
      }
      else {
        res.render("TaskList", { title: "All Events", taskList: doc, user: req.user });
      }
    });
  } catch (error) {
    console.log(error)
    res.render("TaskList", { title: "All Events", taskList: doc, user: req.user });

  }
})

//Create New Task
router.get('/create_task', isLoggedIn, async (req, res) => {
  res.render("create_task", { user: req.user });
});

//Get Task by Specific id
//Edit task
router.get('/edit_task/:taskId', isLoggedIn, async (req, res) => {
  try {
    const taskDetails = await Task.findById(req.params.taskId);
    res.render("edit_task", { title: "Edit Task", task: taskDetails, user: req.user })
  } catch (error) {
    // res.json({ message: error })
    console.log(error)
    res.render("edit_task", { title: "Edit Task", task: taskDetails, user: req.user })
  }
});


router.get('/google', passport.authenticate('google', {
  scope: ['profile']
}),
  (req, res, next) => { }
)

/* GET /google/callback */
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/login'
}),
  (req, res, next) => {
    res.redirect('/tasks')
  })


module.exports = router;
