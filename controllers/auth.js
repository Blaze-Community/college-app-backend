const express = require("express");
const { collegeUser } = require("../models/user");
const jwt = require("jsonwebtoken");
const { hashPassword } = require("./hashPassword");

// const ACCESS_TOKEN_SECRET = "thisIsAccessTokenSecretKey";
// const REFRESH_TOKEN_SECRET = "thisIsRefreshTokenSecretKey";

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
                            { user: userFound },
                            process.env.ACCESS_TOKEN_SECRET,
                            {
                                expiresIn: "600s",
                            }
                        );

                        const refreshToken = jwt.sign(
                            { user: userFound },
                            process.env.REFRESH_TOKEN_SECRET,
                            {
                                expiresIn: "1y",
                            }
                        );
                        res.status(200).json({
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
        return res.json({ success: false, msg: "Refresh token not found." });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
        if (!err) {
            const accessToken = jwt.sign(
                { user: data.user },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: "600s",
                }
            );
            return res
                .status(200)
                .json({ success: true, accessToken: accessToken });
        } else if (err.message == "jwt expired") {
            return res.status(400).json({
                success: false,
                msg: "Refresh token expired, Please Login again!",
            });
        } else {
            return res.status(400).json({
                success: false,
                msg: "invalid refresh token",
            });
        }
    });
};

exports.userInfo = (req, res) => {
    console.log(req.user);
    collegeUser.findOne({ email: req.user.email }, (err, userFound) => {
        if (err) throw err;
        if (!userFound) {
            res.status(400).send({
                success: false,
                msg: "User not found",
            });
        } else {
            res.status(200).send(userFound);
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
    res.status(200).send({
        success: true,
        msg: "Profile Updated Successfully",
        info: {
            profileName: req.body.profileName,
            profilePhotoUri: req.body.profilePhotoUri,
        },
    });
};

exports.changePassword = (req, res) => {
    collegeUser.findOne(
        {
            email: req.user.email,
        },
        (err, userFound) => {
            if (err) {
                console.log(err);
                return res
                    .status(500)
                    .json({ success: true, msg: err.message });
            }
            if (!userFound) {
                res.status(400).send({
                    success: false,
                    msg: "Authentication Failed, User not found",
                });
            } else {
                userFound.comparePassword(
                    req.body.oldPassword,
                    async (err, isMatch) => {
                        if (isMatch && !err) {
                            const hashed = await hashPassword(
                                req.body.newPassword
                            );
                            const newValues = {
                                $set: {
                                    password: hashed,
                                },
                            };
                            collegeUser.updateOne(
                                { email: req.user.email },
                                newValues,
                                (err, res) => {
                                    if (err) {
                                        throw err;
                                    }
                                }
                            );
                            res.send({
                                success: true,
                                msg: "password changed",
                            });
                        } else {
                            return res.status(400).send({
                                success: false,
                                msg: "Old password you entered is wrong",
                            });
                        }
                    }
                );
            }
        }
    );
};
