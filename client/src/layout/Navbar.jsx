/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/images/logo.png";
import WriteImg from "../assets/images/write-blog.png";
import DownArrowImg from "../assets/images/down-arrow.png";
import SearchImg from "../assets/images/search.png";
import NewsImg from "../assets/images/news.png";

export default function Navbar() {
  const { user } = useContext(UserContext);
  const [showNavMenu, setShowNavMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMenuClick = (e) => {
      if (e.target.classList.contains("navbar-pic")) {
        setShowNavMenu((prev) => !prev);
      } else {
        setShowNavMenu(false);
      }
    };
    window.addEventListener("click", handleMenuClick);

    return () => {
      window.removeEventListener("click", handleMenuClick);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <nav className='d-flex align-center'>
        <div className='nav-logo-section '>
          <Link
            to='/'
            className='home-logo d-flex align-center'
            style={{ color: "#000", gap: "10px" }}>
            <img src={Logo} alt='' />
            <span>TrendFlow.</span>
          </Link>
        </div>
        <div className='nav-menu d-flex' style={{ gap: "30px" }}>
          <Link to='/search' className='search-btn align-center'>
            <img src={SearchImg} />
          </Link>
          <Link to='/news' className='d-flex align-center'>
            <img src={NewsImg} />
            <span>News</span>
          </Link>
          <Link to='/post/create' className='write-option d-flex align-center'>
            <img src={WriteImg} />
            <span>Write</span>
          </Link>

          <div className='profile-menu' style={{ position: "relative" }}>
            <div
              className='navbar-pic d-flex align-center'
              style={{ gap: "5px" }}>
              <img
                className='navbar-pic'
                src={
                  user.profile_pic
                    ? `https://trendflow-backend.onrender.com/${user.profile_pic}`
                    : user.default_pic
                }
                style={{ borderRadius: "50%", objectFit: "cover" }}
                width='32'
                height='32'
              />
              <img className='navbar-pic' src={DownArrowImg} />
            </div>
            <ul
              className='d-flex flex-col'
              style={{ display: showNavMenu ? "flex" : "none" }}>
              <li>
                <Link to='/post/create'>Write a Post</Link>
              </li>
              <li>
                <Link to='/my-profile'>Your profile</Link>
              </li>
              <li>
                <Link to='/settings'>Settings</Link>
              </li>
              <li>
                <button onClick={logout} className='btn'>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
