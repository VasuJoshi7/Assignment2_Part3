var express = require('express');
var router = express.Router();
var User = require("../model/User");
var passport = require("passport")
const Task = require('../model/task');

var isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    next()
  }
  else {
    res.redirect('/login');
  }
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
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
    var user = req.session.User;
    const tskList = await Task.find().lean();
    console.log(tskList);
    res.render("TaskList", { title: "All Events", taskList: tskList });
  } catch (error) {
    res.json({ message: error })

  }
})

//Create New Task
router.get('/create_task', isLoggedIn, async (req, res) => {
  res.render("create_task");
});

//Get Task by Specific id
//Edit task
router.get('/edit_task/:taskId', isLoggedIn, async (req, res) => {
  try {
    console.log("Retriving task data from database for task id:" + req.params.taskId);
    const taskDetails = await Task.findById(req.params.taskId);
    console.log(taskDetails);
    res.render("edit_task", { title: "Edit Task", task: taskDetails })
  } catch (error) {
    res.json({ message: error })
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
