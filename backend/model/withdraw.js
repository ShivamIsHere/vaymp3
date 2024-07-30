const mongoose = require("mongoose");

const withdrawSchema = new mongoose.Schema({
  seller: {
    type: Object,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  upiId: {
    type: String,
    // required: true,
  },
  number: {
    type: String,
    // required: true,
  },
  status: {
    type: String,
    default: "Processing",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
  }
});

module.exports = mongoose.model("Withdraw", withdrawSchema);
