/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../context/UserContext";
import NoPost from "../util/NoPost";
import InfiniteScroll from "react-infinite-scroll-component";

export default function FollowSection({ hasMore, fetchMoreData, followData }) {
  return (
    <>
      <div className='following-list'>
        <div className='list d-flex flex-col'>
          {followData.length === 0 ? (
            <NoPost />
          ) : (
            <InfiniteScroll
              hasMore={hasMore}
              next={fetchMoreData}
              dataLength={followData.length}
              loader={
                <p style={{ fontSize: "1.5rem", color: "#6b6b6b" }}>
                  Loading..
                </p>
              }>
              {followData.map((f) => {
                return (
                  <div
                    className='following-user'
                    style={{ marginBottom: "20px" }}
                    key={f._id}>
                    <Link
                      reloadDocument
                      to={`/user/${f.follower_id}`}
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
            </InfiniteScroll>
          )}
        </div>
      </div>
    </>
  );
}
