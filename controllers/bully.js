const express = require("express");
const bully = require("../models/bully");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");

exports.uploadVideo = async (req, res) => {
  const storage = getStorage();

  try {
    const storageRef = ref(
      storage,
      `Bully/${req.file.originalname + "" + Date.now()}`
    );

    // Create file metadata including the content type
    const metadata = {
      contentType: req.file.mimetype,
    };

    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );
    //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

    // Grab the public url
    const downloadURL = await getDownloadURL(snapshot.ref);

    let newItem = bully({
      senderId: req.user._id,
      videoURI: downloadURL,
    });
    newItem.save(function (err, item) {
      if (err) {
        res
          .status(400)
          .json({ success: false, msg: "Failed to save the item" });
      } else {
        res
          .status(200)
          .json({ success: true, msg: "Successfully Added", item: item });
      }
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .send({ success: false, msg: "failed to upload the video" });
  }
};

exports.updateVideoStatus = (req, res) => {
  const { bully_id, percentage, result } = req.body;

  const newValues = {
    $set: {
      percentage: percentage,
      result: result,
    },
  };
  bully.findByIdAndUpdate(bully_id, newValues, (err, res) => {
    if (err) {
      if (err) {
        throw err;
      }
    }
  });
  res.status(200).send({
    success: true,
    msg: "Status Updated Successfully",
  });
};

exports.allVideos = (req, res) => {
  bully.find({}).exec((err, list) => {
    if (err) {
      res
        .status(400)
        .json({ success: false, msg: "Failed to retrive the item" });
    } else {
      res.status(200).json({ success: true, list: list });
    }
  });
};
