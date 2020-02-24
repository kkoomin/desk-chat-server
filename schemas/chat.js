const mongoose = require("mongoose");

const { Schema } = mongoose;
const {
  Types: { ObjectId }
} = Schema;

const chatSchema = new Schema({
  message: {
    type: String,
    required: true
  },
  author: {
    type: ObjectId,
    required: true,
    ref: "User"
  },
  // room_id: {
  //   type: ObjectId,
  //   required: true,
  //   ref: "Room"
  // },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Chat", chatSchema);
