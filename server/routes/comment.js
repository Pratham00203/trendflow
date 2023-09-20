const router = require("express").Router();
const auth = require("../middleware/auth");
const Comment = require("../models/Comment");
const mongoose = require("mongoose");

// @route    POST api/post/comment/:postid/create
// @desc     Create a comment
// @access   Private
router.post("/:postid/create", auth, async (req, res) => {
  try {
    //Get comment text from the request body
    const { text } = req.body;

    // Create comment record and save it in collection
    let comment = new Comment({
      user_id: req.user.id,
      text,
      post_id: req.params.postid,
    });

    await comment.save();
    const newCommentId = new mongoose.Types.ObjectId(comment._id);
    const newComment = await Comment.aggregate([
      {
        $match: { _id: newCommentId },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $project: {
          user_id: 1,
          parentComment_id: 1,
          text: 1,
          createdAt: 1,
          post_id: 1,
          "userInfo.username": 1,
          "userInfo.profile_pic": 1,
          "userInfo.default_pic": 1,
        },
      },
    ]);

    return res
      .status(200)
      .json({ msg: "Comment created", newComment: newComment[0] });
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
    //Get comment text from the request body

    const { text } = req.body;

    // Create comment record with parentComment_id to the comment which is replied
    let comment = new Comment({
      user_id: req.user.id,
      text,
      parentComment_id: req.params.commentid,
      post_id: req.params.postid,
    });

    await comment.save();
    return res.status(200).json({ msg: "Comment created" });
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
    const skip = parseInt(req.query.skip);
    const postId = new mongoose.Types.ObjectId(req.params.postid);
    const comments = await Comment.aggregate([
      {
        $match: { post_id: postId, parentComment_id: null },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $project: {
          user_id: 1,
          parentComment_id: 1,
          text: 1,
          createdAt: 1,
          post_id: 1,
          "userInfo.username": 1,
          "userInfo.profile_pic": 1,
          "userInfo.default_pic": 1,
        },
      },
    ])
      .skip(skip)
      .limit(5);
    return res.status(200).json({ comments });
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
    const skip = parseInt(req.query.skip);
    const postId = new mongoose.Types.ObjectId(req.params.postid);
    const commentId = new mongoose.Types.ObjectId(req.params.commentid);

    const replies = await Comment.aggregate([
      {
        $match: { post_id: postId, parentComment_id: commentId },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $project: {
          user_id: 1,
          parentComment_id: 1,
          text: 1,
          createdAt: 1,
          post_id: 1,
          "userInfo.username": 1,
          "userInfo.profile_pic": 1,
          "userInfo.default_pic": 1,
        },
      },
    ])
      .skip(skip)
      .limit(10);
    return res.status(200).json({ replies });
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
    await Comment.findByIdAndDelete(req.params.commentid);
    return res.status(200).json({ msg: "Comment deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
