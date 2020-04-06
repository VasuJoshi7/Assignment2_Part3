const express = require('express');
const router = express.Router();
const Task = require('../model/task');
var ObjectId = require("mongoose").Types.ObjectId;
var isLoggedIn = require("../auth");
var { taskValidation } = require("../validation")
var User = require("../model/User");



//Save New Task
router.post('/create_task', isLoggedIn, async (req, res) => {
    try {

        var { error } = taskValidation(req.body);
        if (error != null) res.render("create_task", { user: req.user, errorMessage: error });

        var userId;
        await User.findOne({ username: req.session.passport.user.username }, function (error, doc) {
            if (error) {
                res.render("create_task", { user: req.user, errorMessage: error });
            }
            else {
                userId = doc._id;
                console.log(userId);
                console.log("Saving Task");
                const task = new Task({
                    name: req.body.name,
                    description: req.body.description,
                    createdBy: userId,
                    createdDate: Date.now().toString(),
                    modifiedDate: Date.now(),
                    status: "Pending"
                });
                task.save();
                res.render("create_task", { user: req.user, errorMessage: "Data Saved Sucessfully." });
            }
        });
    }
    catch (error) {
        res.render("create_task", { user: req.user, errorMessage: error });
    }
});

//Update Task By Specific id
router.post('/edit_task/:taskId', isLoggedIn, async (req, res) => {
    console.log(req.body);
    let error = "";
    try {
        const taskUpdate = await Task.updateOne({ _id: req.params.taskId },
            {
                $set: {
                    'name': req.body.name,
                    'description': req.body.description,
                    'modifiedDate': Date.now(),
                    'status': req.body.status
                }
            })
        const taskDetails = await Task.findById(req.params.taskId);
        res.render("edit_task", { user: req.user, title: "Edit Task", task: taskDetails, errorMessage: "Updated Sucessfully" })
    } catch (err) {
        error = err.message;
        res.render("edit_task", { user: req.user, title: "Edit Task", task: req.body, errorMessage: error })
    }

})

//Delete Task By Specific id
router.delete('/:taskId', isLoggedIn, async (req, res) => {
    console.log(req.params.taskId);
    try {
        const taskList = await Task.deleteOne({ "_id": ObjectId(req.params.taskId) });
        console.log(taskList);
        if (taskList.deletedCount > 0)
            res.json({ message: "Event sucessfully Deleted", status: 200 });
        else
            res.json({ message: "Event not deleted", status: 500 });
    } catch (error) {
        console.log(error);
        res.json({ message: "Failed to Delete", status: 500 });
    }
});
module.exports = router;