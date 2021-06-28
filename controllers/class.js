const express = require("express");
const { classroom } = require("../models/class");
const { v4: uuidv4 } = require("uuid");

exports.createClass = (req, res) =>	{
		const { clas } = req.body;
    	let newClass;
	    let enrolKey = uuidv4();
		newClass = classroom({
			enrolKey: enrolKey,
			branch:clas.branch,
			section:clas.section,
			subject:clas.subject,
			batch:clas.batch,
			createdBy:req.user._id
		});
		newClass.save((err, newClass) => {
			if (err) {
			    res.status(400).json({ error:err, success: false, msg: "Failed to create the class" });
			} else {
				res.status(200).json({ success: true, msg: "Successfully created"});
			      	}
		});
   };

exports.joinClass = (req, res) =>	{
		const enrolKey = req.body.enrolKey;
		const studentId = req.user._id;
		classroom.findOne({enrolKey:enrolKey}).exec((error, existingClass) =>{
			if (error) {
	        	 res.status(400).json({ error });
	    	}
	    	else{

	    		if(existingClass.enrollStudents.includes(studentId)){
	    			return res.status(400).json({ error: "Student Already Enrolled"});
	    		}
	    		else{
			    		existingClass.enrollStudents.push(studentId);
					    existingClass.save((err, updateClass) => {
							if (err) {
							    res.status(400).json({ success: false, msg: "Failed to Enrol the student" });
							} else {
								res.status(200).json({ success: true, msg: "Student Enrol Successfully"});
							    }
						});
	    		}
	    	}
		});
   };

exports.classes = (req, res) =>	{
		console.log(req.user);
		if(req.user.role == "student"){
			const studentId = req.user._id;
			classroom.find({enrollStudents:studentId}).populate("enrollStudents").populate("createdBy").exec((error, studentClasses) => {
				if (error) {
		        	 res.status(400).json({ error });
		    	}
		    	else{
		    		res.status(200).json({ success: true, msg: "Student Classes",classes: studentClasses});
		    	}
			});
		}
		else{
			const teacherId = req.user._id;
			classroom.find({createdBy:teacherId}).populate("enrollStudents").populate("createdBy").exec((error, teacherClasses) => {
				if (error) {
		        	 res.status(400).json({ error });
		    	}
		    	else{
		    		res.status(200).json({ success: true, msg: "Teacher Classes",classes: teacherClasses});
		    	}
			});
		}
   };

exports.uploadAssignment = (req, res) =>	{

		const { assignment } = req.body;
		const classId = req.body.classId;
		classroom.findById(classId).exec((error, existingClass) =>{
			if (error) {
	        	 res.status(400).json({ error });
	    	}
	    	else{
	    		existingClass.assignments.push(assignment);
			    existingClass.save((err, updateClass) => {
					if (err) {
					    res.status(400).json({ success: false, msg: "Failed to upload the assignment" });
					} else {
						res.status(200).json({ success: true, msg: "Assignment Upload Successfully"});
					    }
				});
	    	}
		});
   };
exports.uploadResult = (req, res) =>	{

		const { result } = req.body;
		const classId = req.body.classId;
		classroom.findById(classId).exec((error, existingClass) =>{
			if (error) {
	        	 res.status(400).json({ error });
	    	}
	    	else{
	    		existingClass.results.push(result);
			    existingClass.save((err, updateClass) => {
					if (err) {
					    res.status(400).json({ success: false, msg: "Failed to upload the result" });
					} else {
						res.status(200).json({ success: true, msg: "Result Upload Successfully"});
					    }
				});
	    	}
		});
   };
exports.classInfo = (req, res) =>	{

		const classId = req.params.classId;
		classroom.findById(classId).populate("enrollStudents").populate("createdBy").exec((error, existingClass) =>{
			if (error) {
	        	 res.status(400).json({ error });
	    	}
	    	else{
				res.status(200).json({ success: true, msg: "classInfo fetch Successfully",classInfo:existingClass});
	    	}
		});
   };

exports.deleteClass = (req, res) =>	{
		const classId = req.body.classId;
		classroom.findByIdAndDelete(classId).exec((error, deleteClass) =>{
			if (error) {
	        	 res.status(400).json({ error });
	    	}
	    	else{
				res.status(200).json({ success: true, msg: "Class delete Successfully"});
	    	}
		});
   };