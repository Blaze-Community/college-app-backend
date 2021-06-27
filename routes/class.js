const express = require('express');
const { createClass,joinClass,classes,uploadAssignment,uploadResult,classInfo,deleteClass} = require('../controllers/class');
const { isRequestValidated } = require('../validators/auth');
const { requireSignin } = require("../middlewares/auth");
const router = express.Router();

router.post("/createClass",isRequestValidated, requireSignin ,createClass);
router.post("/joinClass",isRequestValidated, requireSignin ,joinClass);
router.get("/classes",isRequestValidated, requireSignin ,classes);
router.post("/uploadAssignment",isRequestValidated, requireSignin , uploadAssignment);
router.post("/uploadResult",isRequestValidated, requireSignin ,uploadResult);
router.get("/classInfo/:classId",isRequestValidated, requireSignin ,classInfo);
router.delete("/deleteClass",isRequestValidated, requireSignin ,deleteClass);

module.exports = router;