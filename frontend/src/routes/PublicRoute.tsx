import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

const PublicRoute = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  if (token) return <Navigate to="/" />;
  return <Outlet />;
};

export default PublicRoute;
