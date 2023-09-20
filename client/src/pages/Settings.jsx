/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";
import SelectionBox from "../layout/SelectionBox";
import axios from "axios";
import Aside from "../layout/Aside";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const { changeUserSettings } = useContext(UserContext);
  const [profileImgPreview, setProfileImgPreview] = useState(null);
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    bio: "",
    profile_pic: null,
    default_pic: "",
  });
  const [interests, setInterests] = useState([]);

  useEffect(() => {
    document.title = "Settings";
    getUser();
  }, []);

  const getUser = async () => {
    try {
      let res = await axios({
        method: "get",
        url: "http://localhost:5000/api/auth/",
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      setUserDetails((prev) => {
        return {
          ...prev,
          username: res.data.user.username,
          default_pic: res.data.user.default_pic,
          bio: res.data.user.bio,
          profile_pic: res.data.user.profile_pic,
          email: res.data.user.email,
        };
      });
      setInterests(res.data.user.interests);
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setUserDetails((prev) => {
      return {
        ...prev,
        profile_pic: file,
      };
    });
    previewFile(file);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setProfileImgPreview(reader.result);
    };
  };

  const handleChange = (e) => {
    setUserDetails((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userDetails.username.trim() === "") {
      toast.error("Username is required");
      return;
    }
    if (userDetails.email.trim() === "") {
      toast.error("Email is required");
      return;
    }
    if (interests.length === 0) {
      toast.error("Please select atleast one interest!");
      return;
    }

    updateUser();
  };

  const updateUser = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-auth-token": localStorage.getItem("token"),
        },
      };
      let formData = new FormData();
      formData.append("username", userDetails.username);
      formData.append("email", userDetails.email);
      formData.append("bio", userDetails.bio);
      interests.forEach((interest, index) => {
        formData.append(`interests`, interest);
      });
      formData.append("profile_pic", userDetails.profile_pic);

      const res = await axios.put(
        `http://localhost:5000/api/user/update/me`,
        formData,
        config
      );

      console.log(res.data);
      if (res.status == 200) {
        toast.success(res.data.msg);
        changeUserSettings({
          _id: res.data.user._id,
          username: res.data.user.username,
          profile_pic: res.data.user.profile_pic,
          default_pic: res.data.user.default_pic,
          bio: res.data.user.bio,
          interests: res.data.user.interests,
        });

        navigate("/my-profile");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProfileImg = async () => {
    try {
      const res = axios({
        method: "delete",
        url: "http://localhost:5000/api/user//delete/profile-pic/me",
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      // toast.success(res.data.msg);
      setUserDetails((prev) => {
        return {
          ...prev,
          profile_pic: null,
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async () => {
    try {
      if (
        window.confirm(
          "Are you sure you want to delete your account? Changes made are permanent."
        )
      ) {
        const res = await axios({
          method: "delete",
          url: "http://localhost:5000/api/user/delete/me",
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        });

        if (res.status === 200) {
          toast.success(res.data.msg);
          localStorage.removeItem("token");
          navigate("/auth/login");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className='main-content'>
        <div className='settings-page'>
          <h1>Settings</h1>
          <form encType='multipart/form-data' onSubmit={handleSubmit}>
            <div className='f-details d-flex align-center'>
              <div className='prof-image d-flex flex-col'>
                {profileImgPreview ? (
                  <img src={profileImgPreview} alt='' />
                ) : (
                  <img
                    src={
                      userDetails.profile_pic
                        ? `http://localhost:5000/${userDetails.profile_pic}`
                        : userDetails.default_pic
                    }
                    alt=''
                  />
                )}

                <div
                  className='d-flex flex-col justify-center'
                  style={{ gap: "15px", marginTop: "15px" }}>
                  <input
                    type='file'
                    name='profile_pic'
                    id=''
                    accept='image/*'
                    onChange={handleImageUpload}
                  />
                  {userDetails.profile_pic && !profileImgPreview && (
                    <button
                      onClick={deleteProfileImg}
                      className='btn'
                      type='button'>
                      Delete photo
                    </button>
                  )}
                </div>
              </div>
              <div className='f-det d-flex flex-col' style={{ width: "100%" }}>
                <input
                  type='text'
                  name='username'
                  id=''
                  value={userDetails.username}
                  placeholder='Username'
                  onChange={handleChange}
                />
                <input
                  type='email'
                  name='email'
                  id=''
                  value={userDetails.email}
                  placeholder='Email'
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className='form-field d-flex flex-col'>
              <label htmlFor='bio'>
                <b>About yourself : </b>
              </label>
              <textarea
                name='bio'
                id=''
                cols='30'
                rows='10'
                value={userDetails.bio}
                onChange={handleChange}></textarea>
            </div>
            <div className='form-field d-flex flex-col'>
              <label htmlFor='interests'>
                <b>Your interests: </b>
              </label>
              <SelectionBox value={interests} setValue={setInterests} />
            </div>

            <div
              className='setting-form-cta d-flex'
              style={{ gap: "20px", marginTop: "20px" }}>
              <input type='submit' value='Save' className='green-btn' />
              <button className='btn' type='button' onClick={deleteUser}>
                Delete your account
              </button>
            </div>
          </form>
        </div>
      </div>
      <Aside />
    </>
  );
}
