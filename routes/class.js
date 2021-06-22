const express = require('express');
const { createClass,joinClass,studentClasses,teacherClasses } = require('../controllers/class');
const { validateLoginRequest, isRequestValidated, validateRegisterRequest } = require('../validators/auth');
const router = express.Router();

router.post("/createClass",isRequestValidated, createClass);
router.post("/joinClass",isRequestValidated, joinClass);
router.get("/studentClasses",isRequestValidated, studentClasses);
router.get("/teacherClasses",isRequestValidated, teacherClasses);

module.exports = router;