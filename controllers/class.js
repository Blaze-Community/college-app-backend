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

exports.joinClass = (req, res) =>	{
		const enrolKey = req.body.enrolKey;
		const studentId = req.body.studentId;
		classroom.findOne({enrolKey:enrolKey}).exec((error, existingClass) =>{
			if (error) {
	        	 res.status(400).json({ error });
	    	}
	    	else{
	    		existingClass.enrollStudents.push(studentId);
			    existingClass.save((err, updateClass) => {
					if (err) {
					    res.status(400).json({ success: false, msg: "Failed to Enrol the student" });
					} else {
						res.status(200).json({ success: true, msg: "Student Enrol Successfully",updateClass: updateClass});
					    }
				});
	    	}
		});
   };

exports.studentClasses = (req, res) =>	{
		const studentId = req.params.studentId;
		classroom.find({enrollStudents:studentId}).populate("collegeUser").exec((error, studentClasses) => {
			if (error) {
	        	 res.status(400).json({ error });
	    	}
	    	else{
	    		res.status(200).json({ success: true, msg: "Student Classes",studentClasses: studentClasses});
	    	}
		});
   };
exports.teacherClasses = (req, res) =>	{
		const teacherId = req.params.teacherId;
		classroom.find({createdBy:teacherId}).populate("collegeUser").exec((error, teacherClasses) => {
			if (error) {
	        	 res.status(400).json({ error });
	    	}
	    	else{
	    		res.status(200).json({ success: true, msg: "Teacher Classes",teacherClasses: teacherClasses});
	    	}
		});
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
						res.status(200).json({ success: true, msg: "Assignment Upload Successfully",existingClass: existingClass});
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
						res.status(200).json({ success: true, msg: "Result Upload Successfully",existingClass: existingClass});
					    }
				});
	    	}
		});
   };
exports.classAssignments = (req, res) =>	{

		const classId = req.params.classId;
		classroom.findById(classId).exec((error, existingClass) =>{
			if (error) {
	        	 res.status(400).json({ error });
	    	}
	    	else{
	    		let assignmentList = existingClass.assignments;
				res.status(200).json({ success: true, msg: "Assignments fetch Successfully",assignmentList:assignmentList});
	    	}
		});
   };
exports.classResults = (req, res) =>	{

		const classId = req.params.classId;
		classroom.findById(classId).exec((error, existingClass) =>{
			if (error) {
	        	 res.status(400).json({ error });
	    	}
	    	else{
	    		let resultList = existingClass.results;
				res.status(200).json({ success: true, msg: "Assignments fetch Successfully",resultList:resultList});
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