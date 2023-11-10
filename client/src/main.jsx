import React from "react";
import ReactDOM from "react-dom/client";
import Auth from "./Auth.jsx";
import App from "./App.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import { Public } from "./util/Public.jsx";
import { Private } from "./util/Private.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { Toaster } from "react-hot-toast";
import NotFound from "./util/NotFound.jsx";
import Settings from "./pages/Settings.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import PostForm from "./pages/PostForm.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import Search from "./pages/Search.jsx";
import NewsFeed from "./pages/NewsFeed.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router basename={"/"}>
      <Routes>
        <Route path='*' element={<NotFound />} />
        <Route path='/auth' element={<Auth />}>
          <Route
            path='login'
            element={
              <Public>
                <Login />
              </Public>
            }
          />
          <Route
            path='register'
            element={
              <Public>
                <Register />
              </Public>
            }
          />
        </Route>
        <Route path='/' element={<App />}>
          <Route
            path=''
            element={
              <Private>
                <Home />
              </Private>
            }
          />
          <Route
            path='news'
            element={
              <Private>
                <NewsFeed />
              </Private>
            }
          />
          <Route
            path='settings'
            element={
              <Private>
                <Settings />
              </Private>
            }
          />
          <Route
            path='user/:userid/'
            element={
              <Private>
                <UserProfile />
              </Private>
            }
          />
          <Route
            path='my-profile'
            element={
              <Private>
                <MyProfile />
              </Private>
            }
          />
          <Route
            path='post/:postid/edit'
            element={
              <Private>
                <PostForm option='Edit' />
              </Private>
            }
          />
          <Route
            path='post/create'
            element={
              <Private>
                <PostForm option='Create' />
              </Private>
            }
          />
          <Route
            path='search'
            element={
              <Private>
                <Search />
              </Private>
            }
          />
        </Route>
      </Routes>
    </Router>
    <Toaster
      position='top right'
      toastOptions={{
        duration: 3000,
        style: {
          background: "#000",
          color: "#fff",
          fontSize: "1.6rem",
        },
      }}
    />
  </React.StrictMode>
);
