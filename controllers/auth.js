const express = require("express");
const { student, teacher , authentication } = require("../models/user");
const jwt = require("jwt-simple");
const router = express.Router();

const secretKey = "secret";

exports.register = (req, res) => {
	const { user } = req.body;
    let newUser;
   	student.findOne({ email: user.email }).exec((error, existingUser) => {
	    if (error) {
	        return res.status(400).json({ error });
	    }
	    if (existingUser) {
	        return res.status(400).json({ error: "User with that email already exist"});
	    }
	    else{
	    	if (user.role === "student") {
		      newUser = student({
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
	    	}
				 else {
		      newUser = teacher({
		        profileName: user.profileName,
		        profilePhotoUri: user.profilePhotoUri,
		        role: user.role,
		        email: user.email,
		        password: user.password,
		      });
				}
	    }
    authUser = authentication({
		  email: user.email,
		  password: user.password,
    });
    authUser.save((err, authUser) => {
      if (err) {
        return res.status(400).json({ success: false, msg: "Failed to save in Authentication" });
      } else {
            newUser.save((err, newUser) => {
			      if (err) {
			        res.status(400).json({ success: false, msg: "Failed to save in Users" });
			      } else {
			        res.status(200).json({ success: true, msg: "Successfully saved"});
			      }
			    });
      	}
    });
  });
};

exports.login = (req, res) => {
	const { user } = req.body;
			authentication.findOne(
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