import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

const ProtectedRoute = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  if (!token) return <Navigate to="/signin" />;
  return <Outlet />;
};

export default ProtectedRoute;
