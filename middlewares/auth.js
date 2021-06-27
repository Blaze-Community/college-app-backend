const jwt = require("jsonwebtoken");

// const ACCESS_TOKEN_SECRET = "thisIsAccessTokenSecretKey";
// const REFRESH_TOKEN_SECRET = "thisIsRefreshTokenSecretKey";

exports.requireSignin = (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(
            token,
            ACCESS_TOKEN_SECRET,
            async (err, user) => {
                if (user) {
                    req.user = user.user;
                } else if (err.message === "jwt expired") {
                    return res.json({
                        success: false,
                        msg: "Access token expired",
                    });
                }
            }
        );
    } else {
        return res.status(400).json({ error: "Authorization required" });
    }
    next();
};
