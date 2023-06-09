
const jwt = require("jsonwebtoken");

module.exports= async function isAuthenticated(req, res, next) {
    const token = req.headers["authorization"].split(" ")[1];
    jwt.verify(token, "secret", (err, user) => {
        if (err) res.json({message:err});
        req.user = user;
        next();
    })
}