const express = require('express');
const { createClass } = require('../controllers/class');
const { validateLoginRequest, isRequestValidated, validateRegisterRequest } = require('../validators/auth');
const router = express.Router();

router.post("/createClass",isRequestValidated, createClass);

module.exports = router;