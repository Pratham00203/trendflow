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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router basename={"/"}>
      <Routes>
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
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);
