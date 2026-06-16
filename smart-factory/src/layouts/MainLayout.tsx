import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useStore } from '../store/useStore';

const { Content } = Layout;

const MainLayout = () => {
  const sidebarCollapsed = useStore((state) => state.sidebarCollapsed);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout style={{ marginLeft: sidebarCollapsed ? 80 : 200, transition: 'all 0.2s' }}>
        <Header />
        <Content style={{ margin: '16px', background: '#f0f2f5' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;

// Made with Bob
