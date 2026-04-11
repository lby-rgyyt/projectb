import AppSidebar from "../components/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import type { RootState } from "../store";
import { Toaster } from "@/components/ui/sonner";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const MainLayout = () => {
  const loading = useSelector((state: RootState) => state.auth.loading);
  const employee = useSelector((state: RootState) => state.auth.employee);
  const token = useSelector((state: RootState) => state.auth.token);

  if (loading || (token && !employee)) {
    return (
      <main className="flex flex-col gap-6">
        <Card>
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

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 p-6">
        <SidebarTrigger />
        <Outlet />
      </main>
      <Toaster />
    </SidebarProvider>
  );
};
export default MainLayout;
