import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signout } from "../store/slices/authSlice";
import type { RootState } from "../store";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Home, User, FileText, Users, Briefcase, LogOut } from "lucide-react";

const employeeItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/onboarding-application", icon: FileText, label: "Onboarding" },
  { path: "/personal-info", icon: User, label: "Personal Information" },
  { path: "/my-visa-status", icon: FileText, label: "Visa Status" },
];

const hrItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/employees", icon: Users, label: "Employee Profiles" },
  { path: "/visa-status", icon: FileText, label: "Visa Status Management" },
  { path: "/hiring", icon: Briefcase, label: "Hiring Management" },
];

const AppSidebar = () => {
  const employee = useSelector((state: RootState) => state.auth.employee);
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const items = employee?.role === "hr" ? hrItems : employeeItems;

  const handleClick = () => {
    dispatch(signout());
    navigate("/signin");
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.path}>
                    <Link to={item.path}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {token && (
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => { handleClick(); }}>
                <LogOut />
                <span>Sign Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  );
};
export default AppSidebar;
