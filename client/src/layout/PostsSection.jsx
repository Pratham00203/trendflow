/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "./Post";
import NoPost from "../util/NoPost";
import PostSkeleton from "../util/PostSkeleton";
import axios from "axios";
import toast from "react-hot-toast";

export default function PostsSection({
  postsData,
  setPostsData,
  fetchMoreData,
  hasMorePosts,
  setShowCommentModal,
  setSelectedPost,
  setKey,
}) {
  const upvote = async (postid) => {
    try {
      const res = await axios({
        method: "put",
        url: `https://trendflow-backend.onrender.com/api/post/upvote/${postid}`,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      if (res.data.msg === "Upvoted") {
        setPostsData((prevState) => {
          const newState = prevState.map((post) => {
            if (post._id === postid) {
              return { ...post, upvotes: post.upvotes++ };
            }
            return post;
          });

          return newState;
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const downvote = async (postid) => {
    try {
      const res = await axios({
        method: "put",
        url: `https://trendflow-backend.onrender.com/api/post/downvote/${postid}`,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      if (res.data.msg === "Downvoted") {
        setPostsData((prevState) => {
          const newState = prevState.map((post) => {
            if (post._id === postid) {
              return { ...post, downvotes: post.downvotes++ };
            }
            return post;
          });

          return newState;
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = async (postid) => {
    try {
      if (window.confirm("Are you sure you want to delete this post?")) {
        const res = await axios({
          method: "delete",
          url: `https://trendflow-backend.onrender.com/api/post/delete/${postid}/me`,
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        });

        if (res.data.msg === "Post deleted") {
          setPostsData((prevState) => {
            return prevState.filter((post) => post._id !== postid);
          });
          toast.success("Post Deleted");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className='posts-section'>
      {postsData.length === 0 ? (
        <NoPost />
      ) : (
        <InfiniteScroll
          dataLength={postsData.length}
          next={fetchMoreData}
          hasMore={hasMorePosts}
          loader={<PostSkeleton />}>
          {postsData.map((p, index) => {
            return (
              <Post
                key={index}
                post={p}
                upvote={upvote}
                downvote={downvote}
                deletePost={deletePost}
                setShowCommentModal={setShowCommentModal}
                setSelectedPost={setSelectedPost}
                setKey={setKey}
              />
            );
          })}
        </InfiniteScroll>
      )}
    </div>
  );
}
