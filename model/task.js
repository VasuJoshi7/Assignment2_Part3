const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdBy: {
        type: Number,
        required: true
    },
    createdDate: {
        type: Date,
        defualt: Date.now
    },
    modifiedDate: {
        type: Date,
        defualt: Date.now
    },
    status: {
        type: String,
        defualt: "Pending"
    }
});

module.exports = mongoose.model('Tasks', TaskSchema)