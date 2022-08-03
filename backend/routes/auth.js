const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const JWT_secret = "priyansh$200205";
const fetchUser = require("../middleware/fetchUser");

//ROUTE 1 : create a user using: POST "/api/auth/createuser". no login required.

router.post(
  "/createuser",
  [
    body("name", "enter a valid name").isLength({ min: 3 }),
    body("email", "enter a valid email").isEmail(),
    body("password", "enter a valid password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    //if error occurs, return bad request and the err.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    //check whether the user exist with this email already.
    try {
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        return res
          .status(400)
          .json({
            success,
            error: "sorry a user with this email already exist.",
          });
      }

      var salt = await bcrypt.genSaltSync(10);
      securePassword = await bcrypt.hash(req.body.password, salt);

      // Create user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePassword,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_secret);

      success = true;
      res.json({ success, authToken });
      //res.json(user);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Internal server error occured");
    }
  }
);

//ROUTE 2 : Authenticate a user using: POST "/api/auth/login". no login required.

router.post(
  "/login",
  [
    body("email", "enter a valid email...!!").isEmail(),
    body("password", "password  cannot be empty...!!").exists(),
  ],
  async (req, res) => {
    let success = false;
    //if error occurs, return bad request and the err.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // destructuring
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res
          .status(400)
          .json({ error: "Please try to login with correct Credentials" });
      }
      //comparing passwords
      const passwordCompare = await bcrypt.compare(password, user.password);

      if (!passwordCompare) {
        success = false;
        return res
          .status(400)
          .json({
            success,
            error: "Please try to login with correct Credentials",
          });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_secret);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      success = false;
      console.log(error.message);
      res.status(500).send("Internal server error occured");
    }
  }
);

//ROUTE 3 : get logged in User  details using: POST "/api/auth/getuser". login required.

router.post("/getuser", fetchUser, async (req, res) => {
  try {
    userId = req.user.id;

    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error occured");
  }
});

module.exports = router;
