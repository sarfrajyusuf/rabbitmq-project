const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

const Order = new mongoose.Schema({
    products: [
        {
            product_id: String,
        },
    ],
    user:{type: String},
    total_price:{type: Number},
   
}, {
    timestamps: true
});

module.exports =new mongoose.model("order", Order);