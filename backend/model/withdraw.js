const mongoose = require("mongoose");

const withdrawSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true } // This will add createdAt and updatedAt fields
);

module.exports = mongoose.model("Withdraw", withdrawSchema);
