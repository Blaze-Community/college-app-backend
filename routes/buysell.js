const express = require("express");
const router = express.Router();
const { addItem, myItems , allItems,deleteItem } = require('../controllers/buysell');
const { requireSignin } = require("../middlewares/auth");

router.post("/college-olx/addItem",requireSignin,addItem);
router.get("/college-olx/myItem",requireSignin,myItems);
router.get("/college-olx/allItems",requireSignin,allItems);
router.post("/college-olx/deleteItem",requireSignin,deleteItem);
