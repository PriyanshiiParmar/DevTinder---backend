const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    reciever: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is an invalid status type`,
      },
    },
  },
  { timestamps: true }
);

// Compound index for better querying
connectionRequestSchema.index({ sender: 1, reciever: 1 });

// Prevent sending request to yourself
connectionRequestSchema.pre("save", function (next) {
  if (this.reciever.equals(this.sender)) {
    throw new Error("You cannot send a request to yourself");
  }

  next();
});

const ConnectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
