/* eslint-disable no-unused-vars */
import { useParams } from "react-router-dom";
import Aside from "../layout/Aside";
import { useState, useEffect, useContext } from "react";
import PostsSection from "../layout/PostsSection";
import PostSkeleton from "../util/PostSkeleton";
import axios from "axios";
import UserContext from "../context/UserContext";
import FollowModal from "../layout/FollowModal";
import CommentModal from "../layout/CommentModal";

export default function UserProfile() {
  const { userid } = useParams();
  const { user } = useContext(UserContext);
  const [profile, setProfile] = useState({
    _id: "",
    username: "",
    bio: "",
    default_pic: "",
    profile_pic: "",
    followersCount: 0,
    followingCount: 0,
    isFollowing: false,
  });
  const [postLoading, setPostLoading] = useState(true);
  const [userPosts, setUserPosts] = useState([]);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [postSkip, setPostSkip] = useState(0);
  const [showFollowModal, setFollowModal] = useState(false);
  const [option, setOption] = useState("");
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState("");
  const [key, setKey] = useState(0);

  useEffect(() => {
    getUser();
    getUserPosts();
  }, []);

  const getUser = async () => {
    try {
      const url = userid
        ? `http://localhost:5000/api/user/profile/${userid}`
        : `http://localhost:5000/api/user/me/profile`;
      const res = await axios({
        method: "get",
        url: url,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      setProfile((prev) => {
        return {
          _id: res.data.user._id,
          username: res.data.user.username,
          bio: res.data.user.bio,
          default_pic: res.data.user.default_pic,
          profile_pic: res.data.user.profile_pic,
          followersCount: res.data.followersCount,
          followingCount: res.data.followingCount,
          isFollowing: res.data.isFollowing
            ? res.data.isFollowing
            : prev.isFollowing,
          following: res.data.following,
          hasMoreFollowing: res.data.hasMoreFollowing,
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getUserPosts = async () => {
    try {
      const url = userid
        ? `http://localhost:5000/api/post/get/${userid}/posts?skip=${postSkip}`
        : `http://localhost:5000/api/post/all/me?skip=${postSkip}`;
      const res = await axios({
        method: "GET",
        url: url,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      setUserPosts(res.data.posts);
      setPostSkip((prev) => prev + 10);
      setPostLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMorePosts = async () => {
    try {
      const url = userid
        ? `http://localhost:5000/api/post/get/${userid}/posts?skip=${postSkip}`
        : `http://localhost:5000/api/post/all/me?skip=${postSkip}`;
      const res = await axios({
        method: "GET",
        url: url,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      if (res.data.posts.length !== 0) {
        setUserPosts((prev) => prev.concat(res.data.posts));
        setPostSkip((prev) => prev + 10);
        setPostLoading(false);
      } else {
        setHasMorePosts(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const follow = async () => {
    try {
      const res = await axios({
        method: "put",
        url: `http://localhost:5000/api/follow/user/${userid}/follow/`,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      setProfile((prev) => {
        return {
          ...prev,
          followersCount: prev.followersCount++,
          isFollowing: true,
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

  const unfollow = async () => {
    try {
      const res = await axios({
        method: "put",
        url: `http://localhost:5000/api/follow/user/${userid}/unfollow/`,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      setProfile((prev) => {
        return {
          ...prev,
          followersCount: prev.followersCount--,
          isFollowing: false,
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className='main-content user-profile-page'>
        <div className='user-profile-mobile flex-col'>
          <div
            className='user-mobile-info d-flex align-center'
            style={{ gap: "15px", marginBottom: "30px" }}>
            <img src={profile.default_pic} />
            <div>
              <h2>{profile.username}</h2>
              <p>{profile.bio}</p>
            </div>
          </div>
          {userid !== user._id && (
            <button
              className={`green-btn ${profile.isFollowing && "active"}`}
              onClick={profile.isFollowing ? unfollow : follow}>
              {profile.isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>
        <div className='user-profile-other-info'>
          <h1>
            <span>Posts of</span> {profile.username}
          </h1>
          <div className='feed-options d-flex'>
            <p className='active'>Posts</p>
          </div>
          <div className='feed-content'>
            {!postLoading ? (
              <PostsSection
                postsData={userPosts}
                setPostsData={setUserPosts}
                fetchMoreData={fetchMorePosts}
                hasMorePosts={hasMorePosts}
                setShowCommentModal={setShowCommentModal}
                setSelectedPost={setSelectedPost}
                setKey={setKey}
              />
            ) : (
              <PostSkeleton />
            )}
          </div>
        </div>
      </div>
      <Aside
        mode='profile'
        userid={profile._id}
        profile={profile}
        follow={follow}
        unfollow={unfollow}
        setFollowModal={setFollowModal}
        setOption={setOption}
      />
      {showFollowModal && (
        <FollowModal
          showModal={showFollowModal}
          setShowModal={setFollowModal}
          option={option}
          userId={profile._id}
        />
      )}
      {showCommentModal && (
        <CommentModal
          key={key}
          postId={selectedPost}
          showModal={showCommentModal}
          setShowModal={setShowCommentModal}
        />
      )}
    </>
  );
}
