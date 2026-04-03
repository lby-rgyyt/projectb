import { Layout, Menu, Button } from "antd";
import type { MenuProps } from "antd";
import { HomeOutlined, LogoutOutlined } from "@ant-design/icons";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signout } from "../store/slices/authSlice";
import type { RootState } from "../store";

type MenuItem = Required<MenuProps>["items"][number];

const { Sider } = Layout;
const employeeItems: MenuItem[] = [
  { key: "/", icon: <HomeOutlined />, label: <Link to="/">Home</Link> },
];

const hrItems: MenuItem[] = [
  { key: "/", icon: <HomeOutlined />, label: <Link to="/">Home</Link> },
];

const Sidebar = () => {
  const employee = useSelector((state: RootState) => state.auth.employee);
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    dispatch(signout());
    navigate("/signin");
  };

  return (
    <Sider collapsible>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={employee?.role === "hr" ? hrItems : employeeItems}
      />
      {token && (
        <Button type="text" icon={<LogoutOutlined />} onClick={handleClick}>
          Sign Out
        </Button>
      )}
    </Sider>
  );
};
export default Sidebar;
