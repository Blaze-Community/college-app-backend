const express = require("express");
const buysell = require("../models/buysell");

exports.addItem = (req ,res) => {
    const { item } = req.body;
    console.log(item);
    let newItem = buysell({
        itemName:item.itemName,
        itemPrice:item.itemPrice,
        itemImageUri:item.itemImageUri,
        sellerName:item.sellerName,
        sellerRoom:item.sellerRoom,
        sellerContact:item.sellerContact,
        email:item.email
    });
    newItem.save(function(err,item){
        if(err){
            res.status(400).json({ success: false, msg: "Failed to save the item" });
        }
        else{
           res.status(200).json({ success: true, msg: "Successfully Added",item:item});
        }
    });
};

exports.myItems = (req ,res) => {
    const  email = req.body.email;
    let sellItemList;
    buysell.find({email: email}).exec((err,list) => {
        if(err)
        {
            res.status(400).json({ err });
        }
        else 
        {   res.status(200).json({ success: true, msg: "Successfully saved",list:list});
        }
    });
};