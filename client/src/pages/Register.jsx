/* eslint-disable no-unused-vars */
import EyeImg from "../assets/images/eye.png";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import SelectionBox from "../layout/SelectionBox";

export default function Register() {
  document.title = "Create account";
  const [showPassword, setShowPassword] = useState(false);
  const [interests, setInterests] = useState([]);
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const bio = useRef();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    let flag = 0;
    if (
      email.current.value.trim() === "" ||
      password.current.value.trim() === "" ||
      username.current.value.trim() === ""
    ) {
      flag = 1;
      toast.error("Username, email, password fields cannot be empty");
    }

    if (!email.current.value.match(/[a-zA-Z]+\d*[@][a-z]+[.].../)) {
      flag = 1;
      toast.error("Enter a valid email id");
    }

    if (interests.length === 0) {
      flag = 1;
      toast.error("Please select atleast one interest!");
    }

    if (flag === 0) {
      register();
    }
  };

  const register = async () => {
    try {
      const res = await axios({
        method: "post",
        url: `http://localhost:5000/api/auth/register`,
        data: {
          username: username.current.value,
          email: email.current.value,
          password: password.current.value,
          bio: bio.current.value ? bio.current.value : "",
          interests: interests,
        },
      });

      console.log(res.data.token);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <>
      <div className='login-register-container d-flex justify-center align-center'>
        <div className='login-register-form register-form'>
          <h1>Join TrendFlow.</h1>
          <p className='login-text'>
            Discover stories, thinking, and expertise from users on any topic.
          </p>
          <form
            className='d-flex flex-col'
            style={{ gap: "20px" }}
            onSubmit={handleSubmit}>
            <div className='form-field d-flex flex-col' style={{ gap: "5px" }}>
              <label htmlFor='username'>Username</label>
              <input type='text' name='username' ref={username} />
            </div>
            <div className='form-field d-flex flex-col' style={{ gap: "5px" }}>
              <label htmlFor='email'>Email</label>
              <input type='email' name='email' ref={email} />
            </div>
            <div className='form-field d-flex flex-col' style={{ gap: "5px" }}>
              <label htmlFor='password'>Password</label>
              <div className='password-field'>
                <img
                  src={EyeImg}
                  onClick={() => setShowPassword(!showPassword)}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name='password'
                  ref={password}
                />
              </div>
            </div>
            <div className='form-field d-flex flex-col' style={{ gap: "5px" }}>
              <label htmlFor='bio'>About yourself</label>
              <textarea
                name='bio'
                id=''
                cols='30'
                rows='10'
                ref={bio}></textarea>
            </div>
            <div className='form-field d-flex flex-col' style={{ gap: "5px" }}>
              <label htmlFor='interests'>Your interests</label>
              <SelectionBox value={interests} setValue={setInterests} />
            </div>
            <input type='submit' value='Register' />
          </form>
          <p>
            Already have an account? <Link to='/auth/login'>Sign In</Link>
          </p>
        </div>
      </div>
    </>
  );
}
