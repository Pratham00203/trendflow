/* eslint-disable no-unused-vars */
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import SearchImg from "../assets/images/search.png";
import { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";
import axios from "axios";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const { user } = useContext(UserContext);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `Search`;
    if (searchParams.get("q")) {
      setQuery(searchParams.get("q"));
      getUsers();
    }
  }, []);

  const getUsers = async () => {
    try {
      const res = await axios({
        method: "get",
        url: `https://trendflow-backend.onrender.com/api/user/search?q=${searchParams.get("q")}`,
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      setUsers(res.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    setSearchParams({ q: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      getUsers();
    }
  };
  return (
    <>
      <div className='main-content'>
        <div className='search-page'>
          <form
            onSubmit={handleSubmit}
            className='side-input side-input d-flex align-center'
            style={{ gap: "5px" }}>
            <img src={SearchImg} />
            <input
              value={query}
              onChange={handleChange}
              type='text'
              name='query'
              placeholder='Search people on TrendFlow'
            />
          </form>
          <div className='search-users'>
            <h1>
              <span>Users related to </span>&quot;{searchParams.get("q")}&quot;
            </h1>
            <div className='users'>
              {users.map((u) => {
                return (
                  <div className='user ' key={u._id}>
                    <Link
                      to={`/user/${u._id}`}
                      className='d-flex flex-col align-center'>
                      <img
                        style={{ objectFit: "cover" }}
                        src={
                          u.profile_pic
                            ? `https://trendflow-backend.onrender.com/${u.profile_pic}`
                            : u.default_pic
                        }
                        alt=''
                      />
                      <span>{u.username}</span>
                      <span>{u.bio}</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {/* <Aside /> */}
    </>
  );
}
