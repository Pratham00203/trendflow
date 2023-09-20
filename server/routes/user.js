const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Follow = require("../models/Follow");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

// @route    GET api/user/search/
// @desc     Search user
// @access   Private
router.get("/search", auth, async (req, res) => {
  try {
    // Create Query received from request into regular expression
    const query = new RegExp(req.query.q, "gi");

    // Search regular expression in user tables
    const users = await User.find(
      { username: query },
      { username: 1, profile_pic: 1, default_pic: 1, bio: 1 }
    );

    // return users matching regular expression query
    return res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// @route    GET api/user/me/profile/
// @desc     Get a current user's profile
// @access   Private
router.get("/me/profile/", auth, async (req, res) => {
  try {
    // Find user by userid and return
    const followingCount = await Follow.countDocuments({
      follower_id: req.user.id,
    });
    const followersCount = await Follow.countDocuments({
      following_id: req.user.id,
    });

    const userId = new mongoose.Types.ObjectId(req.user.id);
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
          "userInfo.password": 0,
          "userInfo.email": 0,
          "userInfo.bio": 0,
          "userInfo.interests": 0,
          "userInfo.createdAt": 0,
        },
      },
    ]).limit(5);
    const user = await User.findById(req.user.id, {
      password: 0,
      email: 0,
      createdAt: 0,
      interests: 0,
    });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    return res.status(200).json({
      user,
      followersCount,
      followingCount,
      following,
      hasMoreFollowing: followingCount > 5 ? true : false,
    });
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
    // Find user by userid and return
    const followingCount = await Follow.countDocuments({
      follower_id: req.params.userid,
    });
    const followersCount = await Follow.countDocuments({
      following_id: req.params.userid,
    });

    const userId = new mongoose.Types.ObjectId(req.params.userid);

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
          "userInfo.password": 0,
          "userInfo.email": 0,
          "userInfo.bio": 0,
          "userInfo.interests": 0,
          "userInfo.createdAt": 0,
        },
      },
    ]).limit(5);

    const isFollowingCheck = await Follow.findOne({
      follower_id: req.user.id,
      following_id: req.params.userid,
    });

    let isFollowing = null;
    isFollowingCheck ? (isFollowing = true) : (isFollowing = false);

    const user = await User.findById(req.params.userid, {
      password: 0,
      email: 0,
      createdAt: 0,
      interests: 0,
    });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    return res.status(200).json({
      user,
      followersCount,
      followingCount,
      isFollowing,
      following,
      hasMoreFollowing: followersCount > 5 ? true : false,
    });
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
    // Get user details from request body
    const { username, email, bio, interests } = req.body;
    let user = await User.findById(req.user.id).select("-password");
    // Update fields
    user.username = username;
    user.email = email;
    user.bio = bio;
    user.interests = interests;

    // If profile pic is uploaded by user then fetch it, store in public/uploads folder and save file url in user record in database
    if (req.files) {
      const { profile_pic } = req.files;
      if (!/^image/.test(profile_pic.mimetype)) {
        return res
          .status(400)
          .json({ error: "Only image format is supported" });
      } else {
        // Remove previously uploaded pic
        if (user.profile_pic) {
          let currentPic = user.profile_pic.split("/").join("\\");
          fs.unlink(path.join(path.resolve("./"), currentPic), function (err) {
            if (err) throw err;
          });
        }
        const imageName = req.user.id + new Date().getTime() + profile_pic.name;
        profile_pic.mv(
          path.join(path.resolve("./", "public/uploads"), imageName)
        );

        user.profile_pic = `public/uploads/${imageName}`;
      }
    }

    await user.save();
    return res.status(200).json({ msg: "User details updated", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// @route    DELETE api/user//delete/profile-pic/me
// @desc     Delete current user's profile pic
// @access   Private
router.delete("/delete/profile-pic/me", auth, async (req, res) => {
  try {
    let user = await User.findById(req.user.id, { profile_pic: 1 });
    if (user.profile_pic) {
      let currentPic = user.profile_pic.split("/").join("\\");
      fs.unlink(path.join(path.resolve("./"), currentPic), function (err) {
        if (err) throw err;
      });
    }
    user.profile_pic = null;
    await user.save();
    return res.status(200).json({ msg: "User profile pic removed" });
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
    // Delete comments, follows, posts made by user
    await Comment.deleteMany({ user_id: req.user.id });
    await Follow.deleteMany({
      $or: [{ following_id: req.user.id }, { follower_id: req.user.id }],
    });
    await Post.deleteMany({ user_id: req.user.id });

    let user = await User.findById(req.user.id, { profile_pic: 1 });
    // Delete profile pic from storage
    if (user.profile_pic) {
      let currentPic = user.profile_pic.split("/").join("\\");
      fs.unlink(path.join(path.resolve("./"), currentPic), function (err) {
        if (err) throw err;
      });
    }

    // Delete user
    await User.findByIdAndDelete(req.user.id);
    return res.status(200).json({ msg: "User account deleted!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
