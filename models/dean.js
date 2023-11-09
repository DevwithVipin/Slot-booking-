const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deanSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    type: { type: String, required: true },
  },

  { timestamps: true }
);

const Dean= mongoose.model("dean",deanSchema);

module.exports = Dean;
