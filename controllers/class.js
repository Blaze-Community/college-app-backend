const express = require("express");
const { classroom } = require("../models/class");
const { v4: uuidv4 } = require("uuid");

exports.createClass = (req, res) =>	{
		const { clas } = req.body;
    	let newClass;
    	console.log(clas);
	    let enrolKey = uuidv4();
		newClass = classroom({
			enrolKey: enrolKey,
			branch:clas.branch,
			section:clas.section,
			subject:clas.subject,
			batch:clas.batch,
			createdBy:clas.createdBy
		});
		newClass.save((err, newClass) => {
			if (err) {
			    res.status(400).json({ success: false, msg: "Failed to create the class" });
			} else {
				res.status(200).json({ success: true, msg: "Successfully created",class: newClass});
			      	}
		});
   };
