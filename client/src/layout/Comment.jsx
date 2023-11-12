/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useContext } from "react";
import UserContext from "../context/UserContext";
import { Link } from "react-router-dom";
import moment from "moment";

export default function Comment({ comment, deleteComment }) {
  const { user } = useContext(UserContext);
  return (
    <>
      <div className='comment'>
        <div
          className='comment-head d-flex align-center'
          style={{ gap: "12px" }}>
          <Link to={`/user/${comment.user_id}`}>
            <img
              style={{ objectFit: "cover" }}
              src={
                comment.userInfo[0].profile_pic
                  ? `https://trendflow-backend.onrender.com/${comment.userInfo[0].profile_pic}`
                  : comment.userInfo[0].default_pic
              }
            />
          </Link>
          <div className='comment-user-info'>
            <h2>
              <Link to={`/user/${comment.user_id}`}>
                {comment.userInfo[0].username}
              </Link>
            </h2>
            <p>{moment(comment.createdAt).fromNow()}</p>
          </div>
        </div>
        <div className='comment-text'>{comment.text}</div>
        <div className='comment-cta d-flex' style={{ gap: "15px" }}>
          {comment.user_id === user._id && (
            <button className='btn' onClick={() => deleteComment(comment._id)}>
              Delete
            </button>
          )}
        </div>
      </div>
    </>
  );
}
