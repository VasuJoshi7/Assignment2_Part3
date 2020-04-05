const express = require('express');
const router = express.Router();
const Task = require('../model/task');
var ObjectId = require("mongoose").Types.ObjectId;



//Save New Task
router.post('/create_task', async (req, res) => {
    console.log("req body : ")
    console.log(req.body);
    const task = new Task({
        name: req.body.name,
        description: req.body.description,
        createdBy: "1",
        createdDate: Date.now().toString(),
        modifiedDate: Date.now(),
        status: "Pending"
    });
    try {
        const savedTask = await task.save();
        console.log("task saved sucessfully");
        res.render("create_task", { errorMessage: "Data Saved Sucessfully." });
    }
    catch (error) {
        res.render("create_task", { errorMessage: error });
    }
});

//Update Task By Specific id
router.post('/edit_task/:taskId', async (req, res) => {
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
        res.render("edit_task", { title: "Edit Task", task: taskDetails, errorMessage: "Updated Sucessfully" })
    } catch (err) {
        error = err.message;
    }
    res.render("edit_task", { title: "Edit Task", task: req.body, errorMessage: error })
})

//Delete Task By Specific id
router.delete('/:taskId', async (req, res) => {
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