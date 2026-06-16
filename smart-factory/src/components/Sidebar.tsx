import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  AppstoreOutlined,
  ToolOutlined,
  SafetyOutlined,
  SearchOutlined,
  WarningOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useStore();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '儀表板',
    },
    {
      key: '/production',
      icon: <AppstoreOutlined />,
      label: '生產管理',
    },
    {
      key: '/equipment',
      icon: <ToolOutlined />,
      label: '設備管理',
    },
    {
      key: '/quality',
      icon: <SafetyOutlined />,
      label: '品質管理',
    },
    {
      key: '/traceability',
      icon: <SearchOutlined />,
      label: '追溯管理',
    },
    {
      key: '/issues',
      icon: <WarningOutlined />,
      label: '異常管理',
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={sidebarCollapsed}
      onCollapse={toggleSidebar}
      trigger={null}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: sidebarCollapsed ? 16 : 20,
          fontWeight: 'bold',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {sidebarCollapsed ? '智造' : '智慧工廠系統'}
      </div>

      <div
        style={{
          padding: '16px 0',
          textAlign: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          cursor: 'pointer',
        }}
        onClick={toggleSidebar}
      >
        {sidebarCollapsed ? (
          <MenuUnfoldOutlined style={{ color: '#fff', fontSize: 18 }} />
        ) : (
          <MenuFoldOutlined style={{ color: '#fff', fontSize: 18 }} />
        )}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        style={{ borderRight: 0 }}
      />
    </Sider>
  );
};

export default Sidebar;

// Made with Bob
