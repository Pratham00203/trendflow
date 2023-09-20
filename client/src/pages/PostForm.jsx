/* eslint-disable no-empty */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useNavigate, useParams } from "react-router-dom";
import Aside from "../layout/Aside";
import TextEditor from "../layout/TextEditor";
import { useEffect, useState } from "react";
import SelectionBox from "../layout/SelectionBox";
import axios from "axios";
import toast from "react-hot-toast";

export default function PostForm({ option }) {
  const [postContent, setPostContent] = useState("");
  const [postCategory, setPostCategory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `${option} post.`;
    option === "Edit" && getPostDetails();
  }, []);
  const { postid } = useParams();

  const getPostDetails = async () => {
    try {
      const res = await axios({
        method: "get",
        url: `http://localhost:5000/api/post/get/${postid}/post`,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      setPostContent(res.data.post.content);
      setPostCategory(res.data.post.category);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (postContent.trim() === "") {
      toast.error("Post cannot be empty!");
      return;
    }

    if (postCategory.length === 0) {
      toast.error("Please select atleast one category!");
      return;
    }

    option === "Create" ? createPost() : updatePost();
  };

  const createPost = async () => {
    try {
      const res = await axios({
        method: "post",
        url: `http://localhost:5000/api/post/create/me`,
        data: {
          content: postContent,
          category: postCategory,
        },
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      toast.success(res.data.msg);
      navigate("/my-profile");
    } catch (error) {
      console.log(error);
    }
  };

  const updatePost = async () => {
    try {
      const res = await axios({
        method: "put",
        url: `http://localhost:5000/api/post/update/${postid}/me`,
        data: {
          content: postContent,
          category: postCategory,
        },
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      toast.success(res.data.msg);
      navigate("/my-profile");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className='main-content post-form-container'>
        <h1>{option} post.</h1>
        <form
          className='post-form d-flex flex-col'
          style={{ gap: "30px" }}
          onSubmit={handleSubmit}>
          <div className='form-field'>
            <TextEditor value={postContent} setValue={setPostContent} />
          </div>
          <div className='form-field d-flex flex-col' style={{ gap: "5px" }}>
            <label htmlFor='interests'>Your interests</label>
            <SelectionBox value={postCategory} setValue={setPostCategory} />
          </div>
          <input
            type='submit'
            value='Post'
            className='green-btn'
            style={{ fontSize: "1.6rem" }}
          />
        </form>
      </div>
      <Aside />
    </>
  );
}
