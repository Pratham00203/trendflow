const mongoose = require("mongoose");

const ReportSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
  },
  reason: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("report", ReportSchema);
