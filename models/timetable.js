const mongoose = require("mongoose");
const timetableSchema = mongoose.Schema(
    {
        batch:{
            type:String,
            trim:true,
        },
        branch:{
            type:String,
            trim:true
        },
        section:{
            type:String,
            trim:true
        },
        uri:{
            type:String,
            trim:true
        },
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model('timetable',timetableSchema);