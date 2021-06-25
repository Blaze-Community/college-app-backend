const express = require("express");
const { collegeUser } = require("../models/user");
const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET = "thisIsAccessTokenSecretKey";
const REFRESH_TOKEN_SECRET = "thisIsRefreshTokenSecretKey";

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
                res.status(400).json({
                    success: false,
                    msg: "Failed to save in Users",
                });
            } else {
                res.status(200).json({
                    success: true,
                    msg: "Successfully saved",
                });
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
                        const accessToken = jwt.sign(
                            { email: userFound.email },
                            ACCESS_TOKEN_SECRET,
                            {
                                expiresIn: "600s",
                            }
                        );
                        const refreshToken = jwt.sign(
                            { email: userFound.email },
                            REFRESH_TOKEN_SECRET,
                            {
                                expiresIn: "7d",
                            }
                        );
                        res.json({
                            success: true,
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                        });
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

exports.refresh = (req, res, next) => {
    const refreshToken = req.body.token;
    if (!refreshToken) {
        return res.json({ succes: false, msg: "Refresh token not found." });
    }

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
        if (!err) {
            const accessToken = jwt.sign(
                { email: user.email },
                ACCESS_TOKEN_SECRET,
                {
                    expiresIn: "600s",
                }
            );
            return res.json({ success: true, accessToken: accessToken });
        } else {
            return res.json({
                success: false,
                msg: "invalid refresh token",
            });
        }
    });
};

exports.getInfo = (req, res) => {
    console.log(req.user);
    collegeUser.findOne({ email: req.user.email }, (err, userFound) => {
        if (err) throw err;
        if (!userFound) {
            res.status(400).send({
                success: false,
                msg: "User not found",
            });
        } else {
            res.send(userFound);
        }
    });
};

exports.editProfile = (req, res) => {
    const newValues = {
        $set: {
            profilePhotoUri: req.body.profilePhotoUri,
            profileName: req.body.profileName,
        },
    };
    collegeUser.updateOne({ email: req.user.email }, newValues, (err, res) => {
        if (err) {
            throw err;
        }
    });
    res.send({
        succes: true,
        info: {
            profileName: req.body.profileName,
            profilePhotoUri: req.body.profilePhotoUri,
        },
    });
};
