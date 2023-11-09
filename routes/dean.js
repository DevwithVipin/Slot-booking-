const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bdbskjdjkbfksfuadufguGFUFJAJsdfsdfdfsdf'

let Dean = require("../models/dean");

//get the deans
router.get("/", async (req, res) => {
  try {
    const deans = await Dean.find();
    res.json(deans);
  } catch (err) {
    res.json({ message: err });
  }
});

//register the deans

router.post("/add", async (req, res) => {
  const newDean = new Dean({
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, 10),
    type: "dean",
  });

  if (req.body.password.length < 6) {
    return res.json({
      status: "error",
      error: "Password too small. Should be atleast 6 characters",
    });
  }

  try {
    const savedDean = await newDean.save();
    res.json(savedDean);
  } catch (error) {
    if (error.code === 11000) {
      // duplicate key
      return res.json({ status: "error", error: "Username already in use" });
    }
  }
});


//login the deans
router.post('/login', async (req, res) => {
  // const { username, password } = req.body

  const { email, password } = req.body
  const dean = await Dean.findOne({ email }).lean()

  if (!dean) {
    return res.json({ status: 'error', error: 'Invalid email/password' })
  }
try{
    if ( await bcrypt.compare(password, dean.password)) {
    // the username, password combination is successful

    const token = jwt.sign(
      {
        id: dean._id,
        email: dean.email
      },
      JWT_SECRET
    )

    return res.json({ 
      status: 'ok', 
      data: token,
      role: dean.type 
    })
  }else{
        res.json({ status: 'error', error: 'Invalid password' })
    }
}catch(error){
    res.json({ status: 'error', error: 'Invalid email/password' })

}
  

});

module.exports = router;