const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");

require("dotenv").config();

// @route    GET api/auth/
// @desc     Get Current User details
// @access   Private
router.get("/", auth, async (req, res) => {
  try {
    // Find current user based on his/her id received from token
    const user = await User.findById(req.user.id).select("-password");
    // Return user details
    if (!user) {
      return res.status(400).json({ error: "Your account not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// @route    POST api/auth/login
// @desc     Login a user
// @access   Public
router.post("/login", async (req, res) => {
  try {
    // Get email, password from request body
    const { email, password } = req.body;
    // Find the user based on email
    const user = await User.findOne({ email });

    // If user is not found
    if (!user) {
      return res.status(400).json({ error: "User account not found!" });
    }

    // If found check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    // Generate and return token
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5 days" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// @route    POST api/auth/register
// @desc     Register a user
// @access   Public
router.post("/register", async (req, res) => {
  try {
    // Get user details from request body
    const { username, email, password, bio, interests } = req.body;

    // Find user account if already exists based on email
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User account already exists" });
    }

    // Generate hashed password
    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user record
    user = new User({
      username,
      email,
      password: hashedPassword,
      bio,
      interests,
    });

    await user.save();

    // If profile pic is uploaded by user then fetch it, store in public/uploads folder and save file url in user record in database
    if (req.files !== null) {
      const { profile_pic } = req.files;
      if (!/^image/.test(profile_pic.mimetype)) {
        return res
          .status(400)
          .json({ error: "Only image format is supported" });
      } else {
        const imageName = user.id + new Date().getTime() + profile_pic.name;
        profile_pic.mv(
          path.join(path.resolve("./", "public/uploads"), imageName)
        );

        await User.findByIdAndUpdate(user.id, {
          profile_pic: `public/uploads/${imageName}`,
        });
      }
    }

    // Generate and return token
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5 days" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
