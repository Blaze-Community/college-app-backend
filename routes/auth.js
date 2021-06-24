const express = require("express");
const {
    login,
    register,
    refresh,
    getInfo,
    editProfile,
} = require("../controllers/auth");
const { requireSignin, upload } = require("../middlewares/auth");
const {
    validateLoginRequest,
    isRequestValidated,
    validateRegisterRequest,
} = require("../validators/auth");
const router = express.Router();

router.post("/login", validateLoginRequest, isRequestValidated, login);

router.post("/register", validateRegisterRequest, isRequestValidated, register);

router.post("/refresh", refresh);

router.get("/getinfo", requireSignin, getInfo);

router.post("/editprofile", requireSignin, editProfile);

module.exports = router;
