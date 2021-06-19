const jwt = require("jwt-simple");
const secretKey = "secret";

exports.requireSignin = (req, res, next) => {

    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        const user = jwt.decode(token, secretKey);
        req.user = user;
    } else {
        return res.status(400).json({ error: "Authorization required" });
    }
    next();
};