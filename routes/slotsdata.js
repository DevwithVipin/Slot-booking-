const express = require("express");
const router = express.Router();
const Slot = require("../models/Slot");

// Register a slot by admin
router.post("/register", async (req, res) => {

  const { date, time } = req.body;
  const newSlot = new Slot({ date, time });
  if (!date || !time) {
    return res.status(400).json({ message: "Invalid request body" });
    
  }
  const dateObject = new Date(req.body.date);
  const validDay = dateObject.getDay() === 4 || dateObject.getDay() === 5; // 4 for Thursday, 5 for Friday
  const validTime = newSlot.time === "10:00";

  if (!validDay || !validTime) {
    return res.json({ status: "error", error: "Slot is not allowed for this day or time" });
  }


  const existingSlot = await Slot.findOne({ date, time });
  if (existingSlot) {
    return res.status(409).json({ message: "Slot already exists" });
  }

  
  

  // Save the slot
  await newSlot.save();

  // Respond with the new slot
  res.json({ message: "Slot registered successfully", slot: newSlot });
});

module.exports = router;
