const router = require("express").Router();
const auth = require("../middleware/auth");

// @route    GET api/follow/followers/me
// @desc     Get a current user's followers
// @access   Private
router.get("/followers/me", auth, async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// @route    GET api/follow/following/me
// @desc     Get a current user's following
// @access   Private
router.get("/following/me", auth, async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// @route    PUT api/follow/user/:userid/follow/
// @desc     Follow a User
// @access   Private
router.put("/user/:userid/follow/", auth, async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// @route    PUT api/follow/user/:userid/unfollow/
// @desc     Unfollow a User
// @access   Private
router.put("/user/:userid/unfollow/", auth, async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
