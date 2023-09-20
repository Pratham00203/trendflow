/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Link, useNavigate } from "react-router-dom";
import SearchImg from "../assets/images/search.png";
import { useContext, useRef } from "react";
import UserContext from "../context/UserContext";
import { useState } from "react";
import { useEffect } from "react";

export default function Aside({
  mode,
  userid,
  profile,
  follow,
  unfollow,
  setOption,
  setFollowModal,
}) {
  const { user } = useContext(UserContext);
  const searchQuery = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter" && searchQuery.current.value.trim() !== "") {
        navigate(`/search?q=${searchQuery.current.value}`);
      }
    };
    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

  return (
    <aside>
      <div>
        {mode !== "profile" && (
          <div
            className='side-input d-flex align-center'
            style={{ gap: "5px" }}>
            <img src={SearchImg} />
            <input
              ref={searchQuery}
              type='search'
              className='side-input'
              name='query'
              autoComplete='off'
              placeholder='Search people on TrendFlow'
            />
          </div>
        )}
        {mode === "profile" && (
          <div className='user-profile'>
            <img
              style={{ objectFit: "cover" }}
              src={
                profile.profile_pic
                  ? `http://localhost:5000/${profile.profile_pic}`
                  : profile.default_pic
              }
              className='profile-pic'
            />
            <h2>{profile.username}</h2>
            <button
              width='100'
              className='btn follower-count'
              onClick={() => {
                setFollowModal(true);
                setOption("Followers");
              }}>
              {profile.followersCount} Followers
            </button>
            <p className='user-bio'>{profile.bio}</p>
            {userid !== user._id && (
              <button
                className={`green-btn ${profile.isFollowing && "active"}`}
                onClick={profile.isFollowing ? unfollow : follow}>
                {profile.isFollowing ? "Following" : "Follow"}
              </button>
            )}

            <div className='following-list'>
              <h2>Following</h2>
              <div className='list d-flex flex-col'>
                {profile.following &&
                  profile.following.map((f) => {
                    return (
                      <div className='following-user' key={f._id}>
                        <Link
                          reloadDocument
                          to={`/user/${f.userInfo[0]._id}`}
                          className='d-flex '
                          style={{ gap: "10px" }}>
                          <img
                            style={{ objectFit: "cover" }}
                            src={
                              f.userInfo[0].profile_pic
                                ? `http://localhost:5000/${f.userInfo[0].profile_pic}`
                                : f.userInfo[0].default_pic
                            }
                          />
                          {f.userInfo[0].username}
                        </Link>
                      </div>
                    );
                  })}
              </div>
              {profile.hasMoreFollowing && (
                <button
                  className='btn'
                  onClick={() => {
                    setFollowModal("Following");
                    setOption("Following");
                  }}>
                  See all ({profile.followingCount})
                </button>
              )}
            </div>
          </div>
        )}
        {mode !== "profile" && (
          <div className='m-a-popup'>
            <h2>Writing on TrendFlow.</h2>
            <p>Here are some tips :</p>
            <ul className='d-flex flex-col'>
              <li>Have a Clear Subject.</li>
              <li>Have a great story.</li>
              <li>Most importantly! Write from the heart</li>
            </ul>
            <Link to='/post/create'>Create a post</Link>
          </div>
        )}
        <div className='other-links d-flex'>
          <Link to='/'>Help</Link>
          <Link to='/'>Privacy</Link>
          <Link to='/'>Terms</Link>
          <Link to='/'>About</Link>
        </div>
      </div>
    </aside>
  );
}
