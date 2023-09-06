const mongoose = require("mongoose");

const FollowSchema = mongoose.Schema({
  follower_id: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  following_id: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("follow", FollowSchema);
