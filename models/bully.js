const mongoose = require("mongoose");
const bullySchema = mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "collegeUser",
    },
    videoURI: {
      type: String,
      trim: true,
    },
    result: {
      type: String,
      enum: ["VIOLENCE", "NON-VIOLENCE"],
      trim: true,
    },
    percentage: {
      type: Number,
    },
  },
  { timestamps: true }
);

const bully = mongoose.model("bully", bullySchema, "Bully-Report");

module.exports = {
  bully: bully,
};
