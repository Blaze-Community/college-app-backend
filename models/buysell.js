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
        email: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);
const buysell =   mongoose.model('buysell', buysellSchema);
module.exports = buysell;
