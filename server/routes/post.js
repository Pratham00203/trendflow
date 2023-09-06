const router = require("express").Router();
const auth = require("../middleware/auth");

// @route    GET api/post/feed/interests
// @desc     Get posts according to user's interests
// @access   Private
router.get("/feed/interests/", auth, async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// @route    GET api/post/feed/following
// @desc     Get posts according to user's following
// @access   Private
router.get("/feed/following/", auth, async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// @route    GET api/post/all/me
// @desc     Get current user's posts
// @access   Private
router.get("/all/me", auth, async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// @route    GET api/post/get/:userid/posts
// @desc     Get a user's posts
// @access   Private
router.get("/get/:userid/posts", auth, async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// @route    POST api/post/create/me
// @desc     Create a post
// @access   Private
router.post("/create/me", auth, async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// @route    PUT api/post/update/:postid/me
// @desc     Update a post
// @access   Private
router.put("/update/:postid/me", auth, async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// @route    PUT api/post/upvote/:postid
// @desc     Upvote a post
// @access   Private
router.put("/upvote/:postid/", auth, async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// @route    PUT api/post/downvote/:postid
// @desc     Downvote a post
// @access   Private
router.put("/downvote/:postid/", auth, async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// @route    DELETE api/post/delete/:postid/me
// @desc     Delete a post
// @access   Private
router.delete("/delete/:postid/me", auth, async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
