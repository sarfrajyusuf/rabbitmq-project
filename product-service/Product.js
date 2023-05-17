const mongoose = require("mongoose");

const Product = new mongoose.Schema({
    name: {
        type:String
    },

    description:{type:String} ,
    price:{type: Number},
    
}, {
    timestamps:true
});

module.exports =new  mongoose.model("product", Product);