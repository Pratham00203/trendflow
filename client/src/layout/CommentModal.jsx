/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import CloseImg from "../assets/images/close.png";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import Comment from "./Comment";
import NoPost from "../util/NoPost";
import PostSkeleton from "../util/PostSkeleton";

export default function CommentModal({ showModal, setShowModal, postId }) {
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [skip, setSkip] = useState(0);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const text = useRef();

  useEffect(() => {
    getComments();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.current.value.trim() !== "") {
      createComment();
    }
  };
  const getComments = async () => {
    try {
      const res = await axios({
        method: "get",
        url: `http://localhost:5000/api/post/comment/${postId}/all?skip=${skip}`,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      setComments(res.data.comments);
      setSkip((prev) => prev + 5);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMoreComments = async () => {
    try {
      const res = await axios({
        method: "get",
        url: `http://localhost:5000/api/post/comment/${postId}/all?skip=${skip}`,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      if (res.data.comments.length !== 0) {
        setComments((prev) => prev.concat(res.data.comments));
        setSkip((prev) => prev + 5);
      } else {
        setHasMoreComments(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createComment = async () => {
    try {
      const res = await axios({
        method: "post",
        url: `http://localhost:5000/api/post/comment/${postId}/create`,
        data: {
          text: text.current.value,
        },
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      setComments((prev) => {
        return [...prev, res.data.newComment];
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteComment = async (commentid) => {
    try {
      const res = await axios({
        method: "delete",
        url: `http://localhost:5000/api/post/comment/${postId}/${commentid}/delete`,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      if (res.status === 200) {
        setComments((prev) => {
          return prev.filter((c) => c._id !== commentid);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className={`side-modal ${showModal && "active"}`}>
        <div className='d-flex'>
          <button className='btn'>
            <img src={CloseImg} onClick={() => setShowModal(false)} />
          </button>
        </div>
        <div className='modal-content'>
          <h1>Comments</h1>
          <div className='comments-area'>
            <form
              className='d-flex flex-col'
              style={{
                gap: "10px",
                paddingBottom: "20px",
                borderBottom: "1px solid #e5e5e5",
              }}
              onSubmit={handleSubmit}>
              <textarea
                name='text'
                ref={text}
                cols='10'
                rows='5'
                placeholder='What are your thoughts?'></textarea>
              <input
                type='submit'
                value='Post'
                className='green-btn'
                style={{ width: "fit-content" }}
              />
            </form>
            {!isLoading ? (
              <div className='comments-section'>
                {comments.length === 0 ? (
                  <NoPost />
                ) : (
                  <InfiniteScroll
                    dataLength={comments.length}
                    hasMore={hasMoreComments}
                    next={fetchMoreComments}
                    loader={<PostSkeleton />}>
                    {comments.map((comment) => {
                      return (
                        <Comment
                          key={comment._id}
                          comment={comment}
                          deleteComment={deleteComment}
                        />
                      );
                    })}
                  </InfiniteScroll>
                )}
              </div>
            ) : (
              <PostSkeleton />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
