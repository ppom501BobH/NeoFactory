import { Layout, Space, Select, DatePicker, Badge, Avatar, Dropdown } from 'antd';
import { BellOutlined, UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useStore } from '../store/useStore';
import dayjs from 'dayjs';

const { Header: AntHeader } = Layout;
const { RangePicker } = DatePicker;

const Header = () => {
  const { selectedFactory, setSelectedFactory, dateRange, setDateRange } = useStore();

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '個人資料',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系統設定',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '登出',
      danger: true,
    },
  ];

  return (
    <AntHeader
      style={{
        background: '#fff',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0,21,41,.08)',
      }}
    >
      <Space size="large">
        <Select
          value={selectedFactory}
          onChange={setSelectedFactory}
          style={{ width: 120 }}
          options={[
            { value: '台北廠', label: '台北廠' },
            { value: '新竹廠', label: '新竹廠' },
            { value: '台中廠', label: '台中廠' },
            { value: '台南廠', label: '台南廠' },
          ]}
        />
        <RangePicker
          value={dateRange[0] && dateRange[1] ? [dayjs(dateRange[0]), dayjs(dateRange[1])] : null}
          onChange={(dates) => {
            if (dates) {
              setDateRange([dates[0]?.format('YYYY-MM-DD') || '', dates[1]?.format('YYYY-MM-DD') || '']);
            } else {
              setDateRange(['', '']);
            }
          }}
          style={{ width: 260 }}
        />
      </Space>

      <Space size="large">
        <Badge count={5} size="small">
          <BellOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
        </Badge>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Avatar
            style={{ cursor: 'pointer', backgroundColor: '#1890ff' }}
            icon={<UserOutlined />}
          />
        </Dropdown>
      </Space>
    </AntHeader>
  );
};

export default Header;

// Made with Bob
