const express = require("express");
const { collegeUser } = require("../models/user");
const jwt = require("jwt-simple");

const secretKey = "secret";

exports.register = (req, res) => {
  const { user } = req.body;
  let newUser;
  collegeUser.findOne({ email: user.email }).exec((error, existingUser) => {
    if (error) {
      return res.status(400).json({ error });
    }
    if (existingUser) {
      return res.status(400).json({
        error: "User with that email already exist",
        existingUser: existingUser,
      });
    } else {
      if (user.role === "student") {
        newUser = collegeUser({
          profileName: user.profileName,
          profilePhotoUri: user.profilePhotoUri,
          e_card: user.e_card,
          role: user.role,
          email: user.email,
          password: user.password,
          batch: user.batch,
          rollno: user.rollno,
          branch: user.branch,
          section: user.section,
        });
      } else {
        newUser = collegeUser({
          profileName: user.profileName,
          profilePhotoUri: user.profilePhotoUri,
          role: user.role,
          email: user.email,
          password: user.password,
        });
      }
    }
    newUser.save((err, newUser) => {
      if (err) {
        res
          .status(400)
          .json({ success: false, msg: "Failed to save in Users" });
      } else {
        res.status(200).json({ success: true, msg: "Successfully saved" });
      }
    });
  });
};

exports.login = (req, res) => {
  const { user } = req.body;
  collegeUser.findOne(
    {
      email: user.email,
    },
    (err, userFound) => {
      if (err) throw err;
      if (!userFound) {
        res.status(400).send({
          success: false,
          msg: "Authentication Failed, User not found",
        });
      } else {
        userFound.comparePassword(user.password, (err, isMatch) => {
          if (isMatch && !err) {
            const token = jwt.encode(userFound, secretKey);
            res.json({ success: true, token: token });
          } else {
            return res.status(400).send({
              success: false,
              msg: "Authentication failed, wrong password",
            });
          }
        });
      }
    }
  );
};

exports.getInfo = (req, res) => {
  res.send(req.user);
};

exports.editProfile = (req, res) => {
  const newValues = {
    $set: {
      profilePhotoUri: req.body.profilePhotoUri,
      profileName: req.body.profileName,
    },
  };
  collegeUser.updateOne({ email: req.user.email }, newValues, (err, res) => {
    if (err) throw err;
    console.log("profile updated");
  });
  res.send({
    status: "profile updated",
    info: {
      profileName: req.body.profileName,
      profilePhotoUri: req.body.profilePhotoUri,
    },
  });
};
