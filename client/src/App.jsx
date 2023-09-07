import { Outlet } from "react-router-dom";
import "./style.css";
import { useEffect, useState } from "react";
import checkAuth from "./helpers/auth";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth() ? setIsAuthenticated(true) : setIsAuthenticated(false);
  }, [isAuthenticated]);

  return (
    <>
      <h1>Navbar</h1>
      <Outlet />
      <h1>Footer</h1>
    </>
  );
}
