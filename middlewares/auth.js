const jwt = require("jwt-simple");
// const multer = require("multer");
const secretKey = "secret";

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
    const user = jwt.decode(token, secretKey);
    req.user = user;
  } else {
    return res.status(400).json({ error: "Authorization required" });
  }
  next();
};
