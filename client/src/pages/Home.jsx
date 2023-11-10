/* eslint-disable no-empty */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Aside from "../layout/Aside";
import PostsSection from "../layout/PostsSection";
import axios from "axios";
import PostSkeleton from "../util/PostSkeleton";
import CommentModal from "../layout/CommentModal";

export default function Home() {
  const [loadingFeedPosts, setLoadingFeedPosts] = useState(true);
  const [loadingFollowingPosts, setLoadingFollowingPosts] = useState(true);
  const [hasMoreFeedPosts, setHasMoreFeedPosts] = useState(true);
  const [hasMoreFollowingPosts, setHasMoreFollowingPosts] = useState(true);
  const [feedPostSkip, setFeedPostSkip] = useState(0);
  const [followingPostSkip, setFollowingPostSkip] = useState(0);
  const [feedPosts, setFeedPosts] = useState([]);
  const [followingPosts, setFollowingPosts] = useState([]);
  const [feedOption, setFeedOption] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState("");
  const [key, setKey] = useState(0);

  useEffect(() => {
    document.title = "TrendFlow.";
    getFeedPosts();
    getFollowingPosts();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const feed = urlParams.get("feed");
    feed === "Following" ? setFeedOption(feed) : setFeedOption("For you");
  }, []);

  const handleOptionClick = (e) => {
    if (e.target.innerText === "Following") {
      window.history.pushState("", "", `/?feed=${e.target.innerText}`);
    } else {
      window.history.pushState("", "", `/`);
    }
    setFeedOption(e.target.innerText);
  };

  const getFeedPosts = async () => {
    try {
      const res = await axios({
        method: "get",
        url: `http://localhost:5000/api/post/feed/interests?skip=${feedPostSkip}`,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      setFeedPosts(res.data.posts);
      setFeedPostSkip((prev) => prev + 5);
      setLoadingFeedPosts(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getFollowingPosts = async () => {
    try {
      const res = await axios({
        method: "get",
        url: `http://localhost:5000/api/post/feed/following?skip=${followingPostSkip}`,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      setFollowingPosts(res.data.posts);
      setFollowingPostSkip((prev) => prev + 5);
      setLoadingFollowingPosts(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMoreFeedPosts = async () => {
    try {

      const res = await axios({
        method: "get",
        url: `http://localhost:5000/api/post/feed/interests?skip=${feedPostSkip}`,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      if (res.data.posts.length !== 0) {
        setFeedPosts((prev) => prev.concat(res.data.posts));
        setFeedPostSkip((prev) => prev + 5);
      } else {
        setHasMoreFeedPosts(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMoreFollowingPosts = async () => {
    try {
      const res = await axios({
        method: "get",
        url: `http://localhost:5000/api/post/feed/following?skip=${followingPostSkip}`,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      if (res.data.posts.length !== 0) {
        setFollowingPosts((prev) => prev.concat(res.data.posts));
        setFollowingPostSkip((prev) => prev + 5);
      } else {
        setHasMoreFollowingPosts(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className='main-content home'>
        <div className='feed-options d-flex'>
          <p
            className={feedOption === "For you" ? "active" : ""}
            onClick={handleOptionClick}>
            For you
          </p>
          <p
            className={feedOption === "Following" ? "active" : ""}
            onClick={handleOptionClick}>
            Following
          </p>
        </div>
        {feedOption === "For you" ? (
          !loadingFeedPosts ? (
            <PostsSection
              postsData={feedPosts}
              setPostsData={setFeedPosts}
              fetchMoreData={fetchMoreFeedPosts}
              hasMorePosts={hasMoreFeedPosts}
              setShowCommentModal={setShowCommentModal}
              setSelectedPost={setSelectedPost}
              setKey={setKey}
            />
          ) : (
            <PostSkeleton />
          )
        ) : !loadingFollowingPosts ? (
          <PostsSection
            postsData={followingPosts}
            setPostsData={setFollowingPosts}
            fetchMoreData={fetchMoreFollowingPosts}
            hasMorePosts={hasMoreFollowingPosts}
            setShowCommentModal={setShowCommentModal}
            setSelectedPost={setSelectedPost}
            setKey={setKey}
          />
        ) : (
          <PostSkeleton />
        )}
      </div>
      <Aside />
      {showCommentModal && (
        <CommentModal
          postId={selectedPost}
          showModal={showCommentModal}
          setShowModal={setShowCommentModal}
          key={key}
        />
      )}
    </>
  );
}
