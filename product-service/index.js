const express = require('express');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const amqp = require('amqplib');
const isAuthenticated = require('../isAuthenticated')
const Product=require('./Product')
const PORT = process.env.PORT_ONE || 8080;
const app = express();
app.use(express.json());

var channel, connection;
mongoose.connect("mongodb+srv://sarfrajy21:kvNmJacRreewB2hN@cluster0.m8klzx2.mongodb.net/authDB?retryWrites=true&w=majority", { useNewUrlParser: true }).then(()=>{
    console.log("mongodb is connected");
}).catch((error)=>{
    console.log("mondb not connected");
    console.log(error);
});


//rabbitMq
async function connect() {
    const amqpServer = "amqp://localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("PRODUCT")
    
}

connect();


app.post("/product/buy", isAuthenticated, async (req, res) => {
    const { ids } = req.body;
    const products = await Product.find({ _id: { $in: ids } });
    channel.sendToQueue(
        "ORDER",
        Buffer.from(
            JSON.stringify({
                products,
                userEmail: req.user.email,
            })
        )
    );
    channel.consume("PRODUCT", (data) => {
        order = JSON.parse(data.content);
    });
    return res.json(order);
});

app.post("/product/create", isAuthenticated, async (req, res) => {
    const { name, description, price } = req.body;
    const newProduct = new Product({
        name,
        description,
        price,
    });
    newProduct.save();
    return res.json(newProduct);
});


app.listen(PORT, () => {
    console.log(`Product-Service at ${PORT}`);
});
//kvNmJacRreewB2hN