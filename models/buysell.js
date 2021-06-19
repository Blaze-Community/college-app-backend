const mongoose = require("mongoose");
const buysellSchema = mongoose.Schema(
    {
        itemName: {
            type: String,
            trim: true,
        },
        itemPrice:{
            type: String,
            trim: true,
        },
        itemPrice: {
            type: String,
            trim: true,
        },
        sellerName: {
            type: String,
            trim: true,
        },
        sellerRoom: {
            type: String,
            trim: true,
            unique: 1,
        },
        sellerContact: {
            type: String,
            trim: true,
        },
        uid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        },
    },
    { timestamps: true }
);
var student = mongoose.model('student', studentSchema, 'Users');

module.exports = {
  student:student,
  teacher:teacher
}