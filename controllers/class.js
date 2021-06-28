const express = require("express");
const { classroom } = require("../models/class");
const { v4: uuidv4 } = require("uuid");

exports.createClass = (req, res) =>	{
	    console.log(req.body);
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
			    res.status(400).json({ error:err, success: false, msg: "Failed to create the class" });
			} else {
				res.status(200).json({ success: true, msg: "Successfully created"});
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
	    		existingClass.findOne({enrollStudents:studentId}).exec((error, existingUser) => {
					if (error) {
			        	 return res.status(400).json({ error });
			    	}
			    	if(existingUser)
			    	{
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
				});
	    	}
		});
   };

exports.studentClasses = (req, res) =>	{
		const studentId = req.params.studentId;
		classroom.find({enrollStudents:studentId}).populate("enrollStudents").populate("createdBy").exec((error, studentClasses) => {
			if (error) {
	        	 res.status(400).json({ error });
	    	}
	    	else{
	    		res.status(200).json({ success: true, msg: "Student Classes",classes: studentClasses});
	    	}
		});
   };
exports.teacherClasses = (req, res) =>	{
		const teacherId = req.params.teacherId;
		classroom.find({createdBy:teacherId}).populate("enrollStudents").populate("createdBy").exec((error, teacherClasses) => {
			if (error) {
	        	 res.status(400).json({ error });
	    	}
	    	else{
	    		res.status(200).json({ success: true, msg: "Teacher Classes",classes: teacherClasses});
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

exports.uploadMessage = (req ,res) => {
	const message = { message : req.body.message };
	const classId = req.body.classId;
	classroom.findById(classId).exec((error, existingClass) =>{
		if (error) {
			 res.status(400).json({ error });
		}
		else{
			existingClass.messages.push(message);
			existingClass.save((err, updateClass) => {
				if (err) {
					res.status(400).json({ success: false, msg: "Failed to upload the message" });
				} else {
					res.status(200).json({ success: true, msg: "message Upload Successfully"});
					}
			});
		}
	});
}
exports.deleteAssignment = (req,res) => {
	const assignmentId = req.body.assignmentId;
	const classId = req.body.classId;
	classroom.findById(classId).exec((error,existingClass) => {
		if(error)
		{
			res.status(400).json({ error });
		}
		else{
			existingClass.assignments.pull({"_id":assignmentId});
			existingClass.save((err, updateClass) => {
				if (err) {
					res.status(400).json({ success: false, msg: "Failed to delete the assignment" });
				} else {
					res.status(200).json({ success: true, msg: "assignment deleted Successfully"});
					}
			})
		}
	});
}

exports.deleteResult = (req,res) => {
	const resultId = req.body.resultId;
	const classId = req.body.classId;
	classroom.findById(classId).exec((error,existingClass) => {
		if(error)
		{
			res.status(400).json({ error });
		}
		else{
			existingClass.results.pull({"_id":resultId});
			existingClass.save((err, updateClass) => {
				if (err) {
					res.status(400).json({ success: false, msg: "Failed to delete the message" });
				} else {
					res.status(200).json({ success: true, msg: "message deleted Successfully"});
					}
			})
		}
	});
}

exports.deleteMessage = (req,res) => {
	const msgId = req.body.msgId;
	const classId = req.body.classId;
	classroom.findById(classId).exec((error,existingClass) => {
		if(error)
		{
			res.status(400).json({ error });
		}
		else{
			existingClass.messages.pull({"_id":msgId});
			existingClass.save((err, updateClass) => {
				if (err) {
					res.status(400).json({ success: false, msg: "Failed to delete the message" });
				} else {
					res.status(200).json({ success: true, msg: "message deleted Successfully"});
					}
			})
		}
	});
}