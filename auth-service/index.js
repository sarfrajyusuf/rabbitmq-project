const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const User = require('../auth-service/user');

mongoose.connect("mongodb+srv://sarfrajy21:kvNmJacRreewB2hN@cluster0.m8klzx2.mongodb.net/authDB?retryWrites=true&w=majority", { useNewUrlParser: true }).then(()=>{
    console.log("mongodb is connected");
}).catch((error)=>{
    console.log("mondb not connected");
    console.log(error);
});


const app = express();

app.use(express.json());

//Register
// app.post("/auth/register",async (req, res) => {
//     const { name, email, password } = req.body;
//     const isUserExist = await User.findOne({email:email});
//     const hashPassword = await bcrypt.hash(password, 10);
//     if (isUserExist) {
//         return res.json({ message: "User already exist" });
//     }
//     else {
//         const user = new User({ name, email, password:hashPassword });
//         user.save();
//         return res.json(user)
//     }
// })

//---------------------------------------------------------------------------------//
app.post("/auth/register", async (req, res) => {
    const { email, password, name } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.json({ message: "User already exists" });
    } else {
        const newUser = new User({
            email,
            name,
            password,
        });
        newUser.save();
        return res.json(newUser);
    }
});




//---------------------------------------------------------------------------------//


//login
// app.post("/auth/login", async(req, res) => {
//     const { email, password } = req.body;
//     const user = await User.find({ email });
//     if (!user) return res.json({ message: "User not Register!" });

//     const match = await bcrypt.compare(password,user.password);
//             if (match) {
//                 res.send("login successful")
//             }else{
//                 res.send("wrong password")
//             }
        
    

//     const payload = {
//         email,
//         name:user.name
//     }

//     jwt.sign(payload, "secret kry", (err, token) => {
//         if (err) console.log(err);
//         return res.json({token:token})
//     })


// })


app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.json({ message: "User doesn't exist" });
    } else {
        if (password !== user.password) {
            return res.json({ message: "Password Incorrect" });
        }
        const payload = {
            email,
            name: user.name
        };
        jwt.sign(payload, "secret", (err, token) => {
            if (err) console.log(err);
            else return res.json({ token: token });
        });
    }
});



app.get('/get', async(req, res) => {
    const getData = await User.find();
    console.log(getData)
})





//Login




const PORT = process.env.PORT_ONE || 3030;

app.listen(PORT,()=> console.log(`Auth-Service at ${PORT}` )
)
//kvNmJacRreewB2hN