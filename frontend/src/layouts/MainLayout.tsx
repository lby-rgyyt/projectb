import { Layout } from "antd";
import Sidebar from "../components/Sidebar";
// import { useSelector, useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
// import type { RootState, AppDispatch } from "../store";

const { Content } = Layout;

const MainLayout = () => {
  //   const token = useSelector((state: RootState) => state.auth.token);
  //   const dispatch = useDispatch<AppDispatch>();

  return (
    <Layout>
      <Sidebar />
      <Layout>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default MainLayout;
