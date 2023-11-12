/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import CloseImg from "../assets/images/close.png";
import axios from "axios";
import FollowSection from "./FollowSection";
import UserContext from "../context/UserContext";

export default function FollowModal({
  option,
  showModal,
  setShowModal,
  userId,
}) {
  const { user } = useContext(UserContext);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [followData, setFollowData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    option === "Followers" ? getFollowers() : getFollowing();
  }, []);

  const getFollowers = async () => {
    try {
      const url =
        userId === user._id
          ? `https://trendflow-backend.onrender.com/api/follow/followers/me?skip=${skip}`
          : `https://trendflow-backend.onrender.com/api/follow/followers/f/${userId}?skip=${skip}`;
      const res = await axios({
        method: "get",
        url: url,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      setFollowData(res.data.followers);
      setSkip((prev) => prev + 10);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const getFollowing = async () => {
    try {
      const url =
        userId === user._id
          ? `https://trendflow-backend.onrender.com/api/follow/following/me?skip=${skip}`
          : `https://trendflow-backend.onrender.com/api/follow/following/f/${userId}?skip=${skip}`;
      const res = await axios({
        method: "get",
        url: url,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      setFollowData(res.data.following);
      setSkip((prev) => prev + 10);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchMoreFollowers = async () => {
    try {
      const url =
        userId === user._id
          ? `https://trendflow-backend.onrender.com/api/follow/followers/me?skip=${skip}`
          : `https://trendflow-backend.onrender.com/api/follow/followers/f/${userId}?skip=${skip}`;
      const res = await axios({
        method: "get",
        url: url,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      if (res.data.followers.length !== 0) {
        setFollowData((prev) => prev.concat(res.data.followers));
        setSkip((prev) => prev + 10);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMoreFollowing = async () => {
    try {
      const url =
        userId === user._id
          ? `https://trendflow-backend.onrender.com/api/follow/following/me?skip=${skip}`
          : `https://trendflow-backend.onrender.com/api/follow/following/f/${userId}?skip=${skip}`;
      const res = await axios({
        method: "get",
        url: url,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      if (res.data.following.length !== 0) {
        setFollowData((prev) => prev.concat(res.data.following));
        setSkip((prev) => prev + 10);
      } else {
        setHasMore(false);
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
          <h1>{option}</h1>
          {!isLoading &&
            (option === "Followers" ? (
              <FollowSection
                hasMore={hasMore}
                fetchMoreData={fetchMoreFollowers}
                followData={followData}
              />
            ) : (
              <FollowSection
                hasMore={hasMore}
                fetchMoreData={fetchMoreFollowing}
                followData={followData}
              />
            ))}
        </div>
      </div>
    </>
  );
}
