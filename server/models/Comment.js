const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
  },
  parentComment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "comment",
    default: null,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("comment", CommentSchema);
