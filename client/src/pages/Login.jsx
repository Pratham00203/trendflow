/* eslint-disable no-undef */
import { useRef, useState } from "react";
import EyeImg from "../assets/images/eye.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const email = useRef();
  const password = useRef();
  const navigate = useNavigate();

  document.title = "Login";

  const handleSubmit = (e) => {
    e.preventDefault();
    let flag = 0;
    if (
      email.current.value.trim() === "" ||
      password.current.value.trim() === ""
    ) {
      flag = 1;
      toast.error("All fields are required");
    }

    if (!email.current.value.match(/[a-zA-Z]+\d*[@][a-z]+[.].../)) {
      flag = 1;
      toast.error("Enter a valid email id");
    }

    if (flag === 0) {
      login();
    }
  };

  const login = async () => {
    try {
      const res = await axios({
        method: "post",
        url: `http://localhost:5000/api/auth/login`,
        data: {
          email: email.current.value,
          password: password.current.value,
        },
      });

      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <>
      <div className='login-register-container d-flex justify-center align-center'>
        <div className='login-register-form'>
          <h1>Welcome Back.</h1>
          <p className='login-register-text'>
            Log in to access your profile, publish and explore stories.
          </p>
          <form
            className='d-flex flex-col'
            style={{ gap: "20px" }}
            onSubmit={handleSubmit}>
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
            <input type='submit' value='Login' />
          </form>
          <p>
            Don’t have an account? <Link to='/auth/register'>Sign Up</Link>
          </p>
        </div>
      </div>
    </>
  );
}
