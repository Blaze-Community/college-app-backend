const express = require('express');
const { createClass,joinClass,studentClasses,teacherClasses,uploadAssignment,uploadResult,classAssignments,classResults,deleteClass} = require('../controllers/class');
const { validateLoginRequest, isRequestValidated, validateRegisterRequest } = require('../validators/auth');
const router = express.Router();

router.post("/createClass",isRequestValidated, createClass);
router.post("/joinClass",isRequestValidated, joinClass);
router.get("/studentClasses",isRequestValidated, studentClasses);
router.get("/teacherClasses",isRequestValidated, teacherClasses);
router.post("/uploadAssignment",isRequestValidated, uploadAssignment);
router.post("/uploadResult",isRequestValidated, uploadResult);
router.get("/classAssignments",isRequestValidated, classAssignments);
router.get("/classResults",isRequestValidated, classResults);
router.delete("/deleteClass",isRequestValidated, deleteClass);

module.exports = router;