const mongoose = require("mongoose");
const assignmentSchema = mongoose.Schema(
	{
	   	title: {
	      type: String,
	      trim: true,
	    },
	    uri: {
	      type: String,
	      trim: true,
	    },
	   	submissionDate: {
	      type: String,
	      trim: true,
	    },
	},
	 { timestamps: true }
);
const resultSchema = mongoose.Schema(
	{
	    title: {
	      type: String,
	      trim: true,
	    },
	    uri: {
	      type: String,
	      trim: true,
	    },

	},
	 { timestamps: true }
);
const classSchema = mongoose.Schema(
	{
	    enrolKey: {
	      type: String,
	      trim: true,
	      unique: 1
	    },
	   	branch: {
	      type: String,
	      trim: true,
	    },
	    assignments:[assignmentSchema],
	    results:[resultSchema],
	    enrollStudents:[{
	    	type: mongoose.Schema.Types.ObjectId,
            ref: "student",
	    }],
	    subject: {
	      type: String,
	      trim: true,
	    },
	    batch: {
	      type: String,
	      trim: true,
	    },
	   	section: {
	      type: String,
	      trim: true,
	    },
	   	createdBy: {
	    	type: mongoose.Schema.Types.ObjectId,
            ref: "teacher",
	    },

	},
	 { timestamps: true }
);
const classroom = mongoose.model("classroom", classSchema, "Classes");

module.exports = {
  classroom  : classroom 
};