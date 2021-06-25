const express = require('express');
const { createClass,joinClass,studentClasses,teacherClasses,uploadAssignment,uploadResult,classInfo,deleteClass} = require('../controllers/class');
const { validateLoginRequest, isRequestValidated, validateRegisterRequest } = require('../validators/auth');
const router = express.Router();

router.post("/createClass",isRequestValidated, createClass);
router.post("/joinClass",isRequestValidated, joinClass);
router.get("/studentClasses/:studentId",isRequestValidated, studentClasses);
router.get("/teacherClasses/:teacherId",isRequestValidated, teacherClasses);
router.post("/uploadAssignment",isRequestValidated, uploadAssignment);
router.post("/uploadResult",isRequestValidated, uploadResult);
router.get("/classInfo/:classId",isRequestValidated, classInfo);
router.delete("/deleteClass",isRequestValidated, deleteClass);

module.exports = router;