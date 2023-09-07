import { useLocation, Navigate } from "react-router-dom";
import checkAuth from "../helpers/auth";

// eslint-disable-next-line react/prop-types
export const Public = ({ children }) => {
  const { pathname } = useLocation();

  return !checkAuth() ? (
    children
  ) : (
    <Navigate to='/' state={{ from: pathname }} replace />
  );
};
