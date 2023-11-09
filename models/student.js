
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create a new schema with the updated names
const studentSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    type: { type: String, required: true },
  },

  { timestamps: true }
);

// Update the existing model
const Student = mongoose.model("student", studentSchema);

module.exports = Student;
