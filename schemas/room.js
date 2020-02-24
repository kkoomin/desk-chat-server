const mongoose = require("mongoose");

const { Schema } = mongoose;

const roomSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  code: {
    type: Number,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Room", roomSchema);
