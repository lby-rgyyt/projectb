import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../store";

const HRRoute = () => {
  const employee = useSelector((state: RootState) => state.auth.employee);
  if (employee?.role !== "hr") return <Navigate to="/" />;
  return <Outlet />;
};

export default HRRoute;
