const express = require("express");
const { buysell } = require("../models/buysell");
const router = express.Router();

const secretKey = "secret";

exports.addItem = (req ,res) => {
    console.log(req.body)
    const { item } = req.body;
    let newItem = buysell(item);
    newItem.save(function(err,items){
        if(err){
            console.log("error occured");}
        else{
            console.log("item added succedully");
            console.log(items );
        }
    });
};

exports.myItem = (req ,res) => {
    const { user } = req.body;
    let myitemarr;
    buysell.find({email: user.email}).exec((err,arr) => {
        if(err)
        {
            console.log("error occured");
        }
        if(arr)
        {   console.log("some items are found");
            myitemarr = arr;
        }
    })

    return myitemarr;
};