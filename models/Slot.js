const mongoose = require("mongoose");

const SlotSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true },
});

const Slot = mongoose.model("Slot", SlotSchema);

module.exports = Slot;
