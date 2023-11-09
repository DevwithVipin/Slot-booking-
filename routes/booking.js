const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");
const Slots = require("../models/Slot");

// Get all available slots
router.get("/check", async (req, res) => {
  try {
    const existingSlots = await Slots.find();
    res.json(existingSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/all", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.json({ message: err });
  }
});

// Search bookings by email
router.get("/search/:email", async (req, res) => {
  let regex = new
 
RegExp(req.params.email, "i");
  try {
    const bookingByEmail = await Booking.find({ email: regex });
    res.json(bookingByEmail);
  } catch (err) {
    res.json({ message: err });
  }
});

// Register bookings
router.post("/add", async (req, res) => {
  const newBooking = new Booking({
    name: req.body.name,
    email: req.body.email,
    time: req.body.time,
    date: req.body.date,
    isBooked: req.body.isBooked,
  });

  const dateObject = new Date(req.body.date);
  const currentDate = new Date();
  const available = await Slots.find({ date: req.body.date });
  if (available == 0) {
    return res.json({ status: "error", error: "No available slots for this date" });
  }

  if (dateObject <= currentDate) {
    return res.json({ status: "error", error: "Booking cannot be done for past dates" });
  }

  const validDay = dateObject.getDay() === 4 || dateObject.getDay() === 5; // 4 for Thursday, 5 for Friday
  const validTime = newBooking.time === "10:00";

  if (!validDay || !validTime) {
    return res.json({ status: "error", error: "Booking is not allowed for this day or time" });
  }

  const existingBookings = await Booking.find({ date: req.body.date });
  if (existingBookings.length > 0) {
    return res.json({ status: "error", error: "The date is already booked" });
  }

  try {
    const savedBooking = await newBooking.save();
    // Remove the slot from available slots
    await Slots.deleteOne({ _id: savedBooking._id });

    res.json(savedBooking);

  } catch (error) {
    if (error.code === 11000) {
      return res.json({ status: "error", error: "Booking cannot be done" });
    }
  }
});


// Fetch all bookings and delete bookings with past dates
router.get("/fetch-and-delete-past", async (req, res) => {
  try {
    const currentDate = new Date();
    const futureBookings = await Booking.find({ date: { $gte: currentDate } });

    for (const futureBooking of futureBookings) {
      if (futureBooking.date < currentDate) {
        await Booking.findByIdAndRemove(futureBooking._id);
      }
    }

    const remainingBookings = await Booking.find();
    res.json({
      message: "Past bookings have been deleted successfully",
      remainingBookings: remainingBookings,
    });
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
