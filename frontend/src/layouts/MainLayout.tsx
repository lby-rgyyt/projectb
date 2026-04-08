import AppSidebar from "../components/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import type { RootState } from "../store";
import { Toaster } from "@/components/ui/sonner";

const MainLayout = () => {
  const loading = useSelector((state: RootState) => state.auth.loading);
  const employee = useSelector((state: RootState) => state.auth.employee);
  const token = useSelector((state: RootState) => state.auth.token);

  if (loading || (token && !employee)) return <p>Loading...</p>;

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
