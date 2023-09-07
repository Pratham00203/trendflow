import { useLocation, Navigate } from "react-router-dom";
import checkAuth from "../helpers/auth";

// eslint-disable-next-line react/prop-types
export const Private = ({ children }) => {
  const { pathname } = useLocation();

  return checkAuth() ? (
    children
  ) : (
    <Navigate to='/auth/login' state={{ from: pathname }} replace />
  );
};
