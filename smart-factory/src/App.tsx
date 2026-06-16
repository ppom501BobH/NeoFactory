import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhTW from 'antd/locale/zh_TW';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Production from './pages/Production';
import Equipment from './pages/Equipment';
import Quality from './pages/Quality';
import Traceability from './pages/Traceability';
import Issues from './pages/Issues';
import './App.css';

function App() {
  return (
    <ConfigProvider
      locale={zhTW}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="production" element={<Production />} />
            <Route path="equipment" element={<Equipment />} />
            <Route path="quality" element={<Quality />} />
            <Route path="traceability" element={<Traceability />} />
            <Route path="issues" element={<Issues />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;

// Made with Bob
