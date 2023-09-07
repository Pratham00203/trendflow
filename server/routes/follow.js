const router = require("express").Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const Follow = require("../models/Follow");

// @route    GET api/follow/followers/me
// @desc     Get a current user's followers
// @access   Private
router.get("/followers/me", auth, async (req, res) => {
  try {
    const skip = parseInt(req.query.skip);
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Get my followers and their user details as a join
    const followers = await Follow.aggregate([
      {
        $match: { following_id: userId },
      },
      {
        $lookup: {
          from: "users",
          localField: "follower_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $project: {
          follower_id: 1,
          following_id: 1,
          "userInfo.username": 1,
          "userInfo.profile_pic": 1,
          "userInfo.default_pic": 1,
        },
      },
    ])
      .skip(skip)
      .limit(10);

    return res.status(200).json({ followers });
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
    const skip = parseInt(req.query.skip);
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Get users that I follow (my following) and their user details as a join

    const following = await Follow.aggregate([
      {
        $match: { follower_id: userId },
      },
      {
        $lookup: {
          from: "users",
          localField: "following_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $project: {
          follower_id: 1,
          following_id: 1,
          "userInfo.username": 1,
          "userInfo.profile_pic": 1,
          "userInfo.default_pic": 1,
        },
      },
    ])
      .skip(skip)
      .limit(10);

    return res.status(200).json({ following });
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
    // Can't follow yourself
    if (req.user.id === req.params.userid) {
      return res.status(400).json({ error: "You can't follow yourself" });
    }

    // Check if already followed that user
    const isFollowing = await Follow.findOne({
      following_id: req.params.userid,
      follower_id: req.user.id,
    });

    if (isFollowing) {
      return res.status(400).json({ error: "Already followed" });
    }

    // Create a follow record
    let follow = new Follow({
      follower_id: req.user.id,
      following_id: req.params.userid,
    });

    await follow.save();
    return res.status(200).json({ msg: "Followed" });
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
    // Can't unfollow yourself
    if (req.user.id === req.params.userid) {
      return res.status(400).json({ error: "You can't unfollow yourself" });
    }

    // Check if already unfollowed
    const isFollowing = await Follow.findOne({
      following_id: req.params.userid,
      follower_id: req.user.id,
    });

    if (!isFollowing) {
      return res.status(400).json({ error: "Already unfollowed" });
    }

    // Remove follow entry to unfollow
    await Follow.findOneAndDelete({
      following_id: req.params.userid,
      follower_id: req.user.id,
    });

    return res.status(200).json({ msg: "Unfollowed" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
