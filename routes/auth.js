const express = require('express');
const { login, register } = require('../controllers/auth');
const { validateLoginRequest, isRequestValidated, validateRegisterRequest } = require('../validators/auth');
const router = express.Router();

router.post("/login",validateLoginRequest,isRequestValidated, login);

router.post("/register", validateRegisterRequest,isRequestValidated, register );

module.exports = router;