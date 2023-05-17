const mongoose = require('mongoose');

const User = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim:true
    },
    email: {
        type: String,
        unique: true,
        required:true
    },

    password: {
        type: String,
        required:true
    }
}, {
    timestamps:true
})
module.exports = new mongoose.model("user", User);