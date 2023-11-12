/* eslint-disable no-unused-vars */
import { Outlet, useNavigate } from "react-router-dom";
import "./style.css";
import { useEffect, useState } from "react";
import checkAuth from "./helpers/auth";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import UserContext from "./context/UserContext";
import axios from "axios";
import Aside from "./layout/Aside";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    _id: "",
    username: "",
    profile_pic: null,
    default_pic: "",
    bio: "",
    interests: [],
  });

  useEffect(() => {
    document.title = "TrendFlow.";
    if (checkAuth()) {
      getUser();
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      navigate("/auth/login");
    }
  }, []);

  const getUser = async () => {
    try {
      let res = await axios({
        method: "get",
        url: "https://trendflow-backend.onrender.com/api/auth/",
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      setUser((prev) => {
        return {
          ...prev,
          _id: res.data.user._id,
          username: res.data.user.username,
          default_pic: res.data.user.default_pic,
          bio: res.data.user.bio,
          interests: res.data.user.interests,
          profile_pic: res.data.user.profile_pic,
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

  const changeUserSettings = (newUserState) => {
    setUser(newUserState);
  };

  return (
    <UserContext.Provider value={{ user, changeUserSettings }}>
      {user && <Navbar />}
      <div className='container d-flex'>
        <Outlet />
      </div>
      <Footer />
    </UserContext.Provider>
  );
}
