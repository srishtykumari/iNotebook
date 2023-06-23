const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
var fetchuser = require ('../middleware/fetchuser');

const JWT_SECRET = "sweetyisagoodg$irl";

//Route:1 create a User using: POST "/api/auth/createuser". No login required
router.post("/createuser", async (req, res) => {
  console.log({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  try {
    let user = await User.findOne({ email: req.body.email });
    let success = false;
    if (user) {
      return res
        .status(400)
        .json({  success,  error: "Sorry a user with this email already exits" });
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    });
    const data = {
      user: {
        id: user.id,
      },
    };
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({success,authtoken });
  } catch (e) {
    console.log(e);
    res.status(500).send("some error occured");
  }

  // res.send(req.body);
});

//Route:2 Authentication a User using: POST "api/auth/login". No login required

router.post(
  "/login",
  [
    body("email", "Enter a Valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
   
    //if there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send(req.body);
    }

    const { email, password } = req.body;
    try {
      let success = true;
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({success, error: "please try to login with correct credentials" });
      }

      const passwordcompare = await bcrypt.compare(password, user.password);
      if (!passwordcompare) {
        return res
          .status(400)
          .json({ success, error: "please try to login with correct credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//Route:3 Get loggedin User Details using: POST "/api/auth/getuser". No login required

router.post(
  "/getuser", fetchuser , async (req, res) => {
    try {
   let  userId = req.user.id;
   const user = await User.findById(userId).select("-password"); 
  res.json({ user })
  
} catch (error) {
  console.error(error.message);
  res.status(500).send("Internal Server Error");
}
  })
module.exports = router;
