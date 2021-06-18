const mongoose = require("mongoose");
const studentSchema = mongoose.Schema(
    {
        profileName: {
            type: String,
            trim: true,
        },
        profilePhotoUri:{
            type: String,
            trim: true,
        },
        e_card: {
            type: String,
            trim: true,
        },
        role: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            unique: 1,
        },
        password: {
            type: String,
            trim: true,
        },
        batch: {
            type: String,
            trim: true,
        },
        rollno: {
            type: String,
            trim: true,
        },
        branch: {
            type: String,
            trim: true,
        },
        section: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);
const teacherSchema = mongoose.Schema(
    {
        profileName: {
            type: String,
            trim: true,
        },
        profilePhotoUri: {
            type: String,
            trim: true,
        },
        role: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            unique: 1,
        },
        password: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);
var student = mongoose.model('student', studentSchema, 'Users');
var teacher = mongoose.model('teacher', teacherSchema, 'Users');

module.exports = {
  student:student,
  teacher:teacher
}