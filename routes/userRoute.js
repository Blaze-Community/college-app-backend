const express = require("express");
const { student, teacher } = require("../models/user");
const jwt = require("jwt-simple");
const router = express.Router();

const secretKey = "secret";

router.get("/", (req, res) => {
  res.send("hello user");
});

router.post("/adduser", (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.json({ success: false, msg: "Enter email, password and role" });
  } else {
    let newUser;
    if (req.body.role == "student") {
      newUser = student({
        profileName: req.body.profileName,
        profilePhotoUri: req.body.profilePhotoUri,
        e_card: req.body.e_card,
        role: req.body.role,
        email: req.body.email,
        password: req.body.password,
        batch: req.body.batch,
        rollno: req.body.rollno,
        branch: req.body.branch,
        section: req.body.section,
      });
    } else {
      newUser = teacher({
        profileName: req.body.profileName,
        profilePhotoUri: req.body.profilePhotoUri,
        role: req.body.role,
        email: req.body.email,
        password: req.body.password,
      });
    }
    newUser.save((err, newUser) => {
      if (err) {
        res.json({ success: false, msg: "Failed to save" });
      } else {
        res.json({ success: true, msg: "Successfully saved" });
      }
    });
  }
});

router.post("/authenticate", (req, res) => {
  if (req.body.role == "student") {
    student.findOne(
      {
        email: req.body.email,
      },
      (err, user) => {
        if (err) throw err;
        if (!user) {
          res.status(403).send({
            success: false,
            msg: "Authentication Failed, User not found",
          });
        } else {
          user.comparePassword(req.body.password, (err, isMatch) => {
            if (isMatch && !err) {
              const token = jwt.encode(user, secretKey);
              res.json({ success: true, token: token });
            } else {
              return res.status(403).send({
                success: false,
                msg: "Authentication failed, wrong password",
              });
            }
          });
        }
      }
    );
  } else {
    teacher.findOne(
      {
        email: req.body.email,
      },
      (err, user) => {
        if (err) throw err;
        if (!user) {
          res.status(403).send({
            success: false,
            msg: "Authentication Failed, User not found",
          });
        } else {
          user.comparePassword(req.body.password, (err, isMatch) => {
            if (isMatch && !err) {
              const token = jwt.encode(user, secretKey);
              res.json({ success: true, token: token });
            } else {
              return res.status(403).send({
                success: false,
                msg: "Authentication failed, wrong password",
              });
            }
          });
        }
      }
    );
  }
});

router.get("/getinfo", (req, res) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedtoken = jwt.decode(token, secretKey);
    if (decodedtoken.role == "student") {
      return res.json({
        profileName: decodedtoken.profileName,
        profilePhotoUri: decodedtoken.profilePhotoUri,
        e_card: decodedtoken.e_card,
        role: decodedtoken.role,
        email: decodedtoken.email,
        password: decodedtoken.password,
        batch: decodedtoken.batch,
        rollno: decodedtoken.rollno,
        branch: decodedtoken.branch,
        section: decodedtoken.section,
      });
    } else {
      return res.json({
        profileName: decodedtoken.profileName,
        profilePhotoUri: decodedtoken.profilePhotoUri,
        role: decodedtoken.role,
        email: decodedtoken.email,
        password: decodedtoken.password,
      });
    }
  } else {
    return res.json({ success: false, msg: "No Headers" });
  }
});

module.exports = router;
