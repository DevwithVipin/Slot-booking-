const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config();

const app = express();

//middlewares
app.use(cors());
app.use(express.json());

//mongo boilerplate
const uri = process.env.ATLAS_URI;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.error(err);
  });

//routes
const studentRouter = require("./routes/student");
app.use("/students", studentRouter);

const deanRouter = require("./routes/dean");
app.use("/deans", deanRouter);

const bookings = require("./routes/booking");
app.use("/bookings", bookings);


const sd = require("./routes/slotsdata");
app.use("/slotdata", sd);

const port = process.env.PORT || 8281;

app.listen(port, () => {
  console.log(`listening at port ${port}`);
});
