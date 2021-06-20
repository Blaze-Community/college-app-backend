const express = require("express");
const router = express.Router();
var request = require('request');

router.get("/", function(req,res){
  res.send("hello");
});

router.get("/timtable", function(req,res){
  request('https://firebasestorage.googleapis.com/v0/b/our-e-college-app-909e3.appspot.com/o/Batch%2F2019-2023%2FBranch%2FCSE%2FSection%2FA%2FTimetable%2FCSE-A.json?alt=media&token=50d1a49e-0665-461f-9926-8d6c44ea3756',
  function(err,response,body){
    console.log("some one is fetching time table");
    if(err)
    {
      res.send('something went wrong');
    }
    else{
      var data = JSON.parse(body);
      res.send(body);
    }
  })
});


module.exports = router;