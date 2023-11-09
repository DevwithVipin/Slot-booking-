const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");




let Student = require("../models/student");
const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bdbskjdjkbfksfuadufguGFUFJAJFjabjfFfq'

//get the students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.json({ message: err });
  }
});

//register students

router.post("/add", async (req, res) => {
  const newStudent = new Student({
    name: req.body.name,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, 10),
    type: "student",
  });

  if (req.body.password.length < 6) {
    return res.json({
      status: "error",
      error: "Password too small. Should be atleast 6 characters",
    });
  }

  try {
    const savedStudent = await newStudent.save();
    res.json(savedStudent);
  } catch (error) {
    if (error.code === 11000) {
      // duplicate key
      return res.json({ status: "error", error: "Username already in use" });
    }
  }
});

//students login
router.post('/login', async (req, res) => {
  // const { username, password } = req.body

  const { email, password } = req.body
  const student = await Student.findOne({ email }).lean()

  if (!student) {
    return res.json({ status: 'error', error: 'Invalid email/password' })
  }
try{
    if ( await bcrypt.compare(password, student.password)) {
    // the username, password combination is successful

    const token = jwt.sign(
      {
        id: student._id,
        email: student.email
      },
      JWT_SECRET
    )

    return res.json({ 
      status: 'ok', 
      data: token,
      name: student.name,
      role: student.type,
      email: student.email 
    })
  }else{
        res.json({ status: 'error', error: 'Invalid password' })
    }
}catch(error){
    res.json({ status: 'error', error: 'Invalid email/password' })

}
  

});

module.exports = router;
