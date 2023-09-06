const router = require("express").Router();
const auth = require("../middleware/auth");

// @route    GET api/auth/
// @desc     Get Current User details
// @access   Private
router.get("/", auth, async (req, res) => {
  try {
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
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
