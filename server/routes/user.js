const router = require("express").Router();
const auth = require("../middleware/auth");

// @route    GET api/user/search/
// @desc     Search user
// @access   Private
router.get("/search", auth, async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// @route    GET api/user/profile/:userid
// @desc     Get a User profile
// @access   Private
router.get("/profile/:userid", auth, async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// @route    PUT api/user/update/me
// @desc     Update current user's profile
// @access   Private
router.put("/update/me", auth, async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// @route    DELETE api/user/delete/me
// @desc     Delete current user's profile
// @access   Private
router.delete("/delete/me", auth, async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
