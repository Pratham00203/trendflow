const router = require("express").Router();
const auth = require("../middleware/auth");

// @route    POST api/post/comment/:postid/create
// @desc     Create a comment
// @access   Private
router.post("/:postid/create", auth, async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// @route    POST api/post/comment/:postid/:commentid/reply
// @desc     Reply to a comment
// @access   Private
router.post("/:postid/:commentid/reply", auth, async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// @route    GET api/post/comment/:postid/all
// @desc     Get all comments of post
// @access   Private
router.get("/:postid/all", auth, async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// @route    GET api/post/comment/:postid/:commentid/replies
// @desc     Get replies of a comment
// @access   Private
router.get("/:postid/:commentid/replies", auth, async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// @route    DELETE api/post/comment/:postid/:commentid/delete
// @desc     Delete a comment
// @access   Private
router.delete("/:postid/:commentid/delete", auth, async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
