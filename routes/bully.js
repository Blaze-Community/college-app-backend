const express = require("express");
const router = express.Router();
const { uploadVideo } = require("../controllers/bully");
const { requireSignin } = require("../middlewares/auth");
const { isRequestValidated } = require("../validators/auth");
const multer = require("multer");

const upload = multer();
router.put(
  "/bully/upload",
  requireSignin,
  isRequestValidated,
  upload.single("file"),
  uploadVideo
);

module.exports = router;
