/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { Link, useOutletContext } from "react-router-dom";
import CommentImg from "../assets/images/chat.png";
import EditImg from "../assets/images/write-blog.png";
import UpvoteImg from "../assets/images/upvote.png";
import DownvoteImg from "../assets/images/downvote.png";
import DeleteImg from "../assets/images/delete.png";
import { useContext } from "react";
import moment from "moment/moment";
import UserContext from "../context/UserContext";
import toast from "react-hot-toast";
import FlagImg from '../assets/images/red-flag.png'
import ReasonModal from "../util/ReasonModal";
import { useState } from "react";

export default function Post({
  post,
  upvote,
  downvote,
  deletePost,
  setShowCommentModal,
  setSelectedPost,
  setKey,
}) {
  const { user } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className='post'>
        <div
          className='post-user-info d-flex align-center'
          style={{ gap: "15px" }}>
          <Link to={`/user/${post.user_id}/`} className='user-info-pic'>
            <img
              style={{ objectFit: "cover" }}
              src={
                post.userInfo[0].profile_pic
                  ? `https://trendflow-backend.onrender.com/${post.userInfo[0].profile_pic}`
                  : post.userInfo[0].default_pic
              }
              alt='profile_pic'
            />
          </Link>
          <div className='user-info'>
            <h3>
              <Link to={`/user/${post.user_id}/`}>
                {post.userInfo[0].username}
              </Link>
            </h3>
            <h4>
              <Link to={`/user/${post.user_id}/`}>
                @{post.userInfo[0].username}
              </Link>
            </h4>
          </div>
        </div>
        <div
          className='post-content'
          dangerouslySetInnerHTML={{ __html: post.content }}></div>
        <div
          className='post-time d-flex align-center'
          style={{ fontSize: "1.4rem", gap: "20px", flexWrap: "wrap" }}>
          <p>
            {moment(post.createdAt).format("LT")} &middot;{" "}
            {moment(post.createdAt).format("ll")}
          </p>
          <p>{post.category.join(", ")}</p>
        </div>
        <div className='post-cta d-flex'>
          <button
            title='Upvote'
            onClick={() =>
              post.user_id !== user._id
                ? upvote(post._id)
                : toast.error("Cannot upvote your own post!")
            }>
            <img src={UpvoteImg} alt='Upvote' /> {post.upvotes}
          </button>
          <button
            title='Downvote'
            onClick={() =>
              post.user_id !== user._id
                ? downvote(post._id)
                : toast.error("Cannot downvote your own post!")
            }>
            {" "}
            <img src={DownvoteImg} alt='Downwote' /> {post.downvotes}
          </button>
          <button
            title='Comment'
            onClick={() => {
              setSelectedPost(post._id);
              setShowCommentModal(true);
              setKey((prev) => prev + 1);
            }}>
            <img src={CommentImg} alt='Comment' />
          </button>
          {post.user_id === user._id && (
            <>
              <Link to={`/post/${post._id}/edit`} title='Edit'>
                <img src={EditImg} alt='Edit' />
              </Link>
              <button title='Delete' onClick={() => deletePost(post._id)}>
                <img src={DeleteImg} alt='Delete' />
              </button>
            </>
          )}
          {
            post.user_id !== user._id && <div className="report-flag" >
              <button onClick={() => setShowModal(true)} title="Report this post!"><img src={FlagImg} /></button>
              {
                showModal && <ReasonModal setShowModal={setShowModal} postid={post._id} />
              }
            </div>

          }
        </div>
      </div>
    </>
  );
}
