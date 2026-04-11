import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ProtectedRoute = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const loading = useSelector((state: RootState) => state.auth.loading);

  if (loading) {
    return (
      <main className="flex flex-col gap-6">
        <Card >
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-10 w-48" />
            </CardTitle>
          </CardHeader>
          <CardDescription>
            <Skeleton className="h-10 w-full" />
          </CardDescription>
        </Card>
      </main>
    );
  }

  if (!token) return <Navigate to="/signin" />;
  return <Outlet />;
};

export default ProtectedRoute;
