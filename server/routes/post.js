const router = require("express").Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");

// @route    GET api/post/feed/interests
// @desc     Get posts according to user's interests
// @access   Private
router.get("/feed/interests/", auth, async (req, res) => {
  try {
    const skip = parseInt(req.query.skip);
    const currentUserId = new mongoose.Types.ObjectId(req.user.id);
    const user = await User.findById(req.user.id, { interests: 1 });
    const posts = await Post.aggregate([
      {
        $match: {
          category: { $in: user.interests },
          user_id: { $ne: req.user.id },
        },
      },
      {
        $lookup: {
          from: "users", // The 'users' collection
          localField: "user_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $addFields: {
          score: { $subtract: ["$upvotes", "$downvotes"] },
        },
      },
      {
        $sort: {
          score: -1,
        },
      },
      {
        $project: {
          "userInfo.password": 0,
          "userInfo.email": 0,
          "userInfo.bio": 0,
          "userInfo.interests": 0,
          "userInfo.createdAt": 0,
        },
      },
    ])
      .skip(skip)
      .limit(10);

    return res.status(200).json({ posts });
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
    const skip = parseInt(req.query.skip);
    const currentUserId = new mongoose.Types.ObjectId(req.user.id);

    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "follows", // The 'follows' collection
          localField: "user_id",
          foreignField: "following_id", // Match with 'following_id'
          as: "followInfo",
        },
      },
      {
        $match: {
          "followInfo.follower_id": currentUserId, // Match the current user's ID as the 'follower_id'
        },
      },
      {
        $lookup: {
          from: "users", // The 'users' collection
          localField: "user_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $addFields: {
          userInfo: { $arrayElemAt: ["$userInfo", 0] },
          score: { $subtract: ["$upvotes", "$downvotes"] },
        },
      },
      {
        $project: {
          followInfo: 0,
          "userInfo.password": 0,
          "userInfo.email": 0,
          "userInfo.bio": 0,
          "userInfo.interests": 0,
          "userInfo.createdAt": 0,
        },
      },
      {
        $sort: {
          score: -1,
        },
      },
    ])
      .skip(skip)
      .limit(10);

    return res.status(200).json({ posts });
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
    const skip = req.query.skip;
    const posts = await Post.find({ user_id: req.user.id })
      .skip(skip)
      .limit(10);
    return res.status(200).json({ posts });
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
    const skip = req.query.skip;
    const posts = await Post.find({ user_id: req.params.userid })
      .skip(skip)
      .limit(10);
    return res.status(200).json({ posts });
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
    const { content, category } = req.body;
    let post = new Post({
      user_id: req.user.id,
      content,
      category,
    });

    await post.save();
    return res.status(200).json({ msg: "Post created" });
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
    const { content, category } = req.body;
    let post = await Post.findById(req.params.postid, { user_id: 1 });
    if (post.user_id.toString() === req.user.id.toString()) {
      await Post.findByIdAndUpdate(req.params.postid, {
        content,
        category,
        updatedAt: new Date().toISOString(),
      });
      return res.status(200).json({ msg: "Post updated" });
    } else {
      return res
        .status(400)
        .json({ error: "Not authorized to update this post" });
    }
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
    let post = await Post.findById(req.params.postid, { user_id: 1 });
    if (post.user_id.toString() !== req.user.id.toString()) {
      await Post.findByIdAndUpdate(req.params.postid, {
        $inc: { upvotes: 1 },
      });
      return res.status(200).json({ msg: "Upvoted" });
    }
    return res.status(400).json({ error: "Can't upvote your own post" });
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
    let post = await Post.findById(req.params.postid, { user_id: 1 });
    if (post.user_id.toString() !== req.user.id.toString()) {
      await Post.findByIdAndUpdate(req.params.postid, {
        $inc: { downvotes: 1 },
      });
      return res.status(200).json({ msg: "Downvoted" });
    }
    return res.status(400).json({ error: "Can't downvote your own post" });
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
    let post = await Post.findById(req.params.postid, { user_id: 1 });
    if (post.user_id.toString() === req.user.id.toString()) {
      await Comment.deleteMany({ post_id: req.params.postid });
      await Post.findByIdAndDelete(req.params.postid);
      return res.status(200).json({ msg: "Post deleted" });
    } else {
      return res
        .status(400)
        .json({ error: "Not authorized to delete this post" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
