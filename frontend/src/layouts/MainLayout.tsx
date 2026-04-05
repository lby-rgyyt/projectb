import { Layout } from "antd";
import Sidebar from "../components/Sidebar";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import type { RootState } from "../store";

const { Content } = Layout;

const MainLayout = () => {
  //   const token = useSelector((state: RootState) => state.auth.token);
  //   const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.auth.loading);

  if (loading) return <p>Loading...</p>;

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
