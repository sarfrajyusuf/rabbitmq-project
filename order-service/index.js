const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 9090;
const mongoose = require("mongoose");
const Order = require("./Order");
const amqp = require("amqplib");
const isAuthenticated = require("../isAuthenticated");

var channel, connection;

app.use(express.json());

var channel, connection;
mongoose.connect("mongodb+srv://sarfrajy21:kvNmJacRreewB2hN@cluster0.m8klzx2.mongodb.net/authDB?retryWrites=true&w=majority", { useNewUrlParser: true }).then(()=>{
    console.log("mongodb is connected");
}).catch((error)=>{
    console.log("mondb not connected");
    console.log(error);
});


function createOrder(products, userEmail) {
    let total = 0;
    for (let t = 0; t < products.length; ++t) {
        total += products[t].price;
    }
    const newOrder = new Order({
        products,
        user: userEmail,
        total_price: total,
    });
    newOrder.save();
    return newOrder;
}

async function connect() {
    const amqpServer = "amqp://localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("ORDER");
}
connect().then(() => {
    channel.consume("ORDER", (data) => {
        console.log("Consuming ORDER service");
        const { products, userEmail } = JSON.parse(data.content);
        console.log("consuming order queue...")
        console.log(products);
        const newOrder = createOrder(products, userEmail);
        channel.ack(data);
        channel.sendToQueue(
            "PRODUCT",
            Buffer.from(JSON.stringify({ newOrder }))
        );
    });
});



//create product


app.listen(PORT,()=> console.log(`Order-Services at ${PORT}` )
)
//kvNmJacRreewB2hN