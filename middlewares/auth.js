const jwt = require("jsonwebtoken");
// const multer = require("multer");

// const fileStorageEngine = multer.diskStorage({
//   destination: (req, res, cb) => {
//     cb(null, "./images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "_" + file.originalname);
//   },
// });

// exports.upload = multer({ storage: fileStorageEngine });

exports.requireSignin = (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            async (err, user) => {
                if (user) {
                    req.user = user;
                } else if (err.message === "jwt expired") {
                    return res.json({
                        success: false,
                        message: "Access token expired",
                    });
                }
            }
        );
    } else {
        return res.status(400).json({ error: "Authorization required" });
    }
    next();
};
