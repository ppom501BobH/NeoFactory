import { Card, Table, Space, Tabs, Progress, Tag } from 'antd';
import ReactECharts from 'echarts-for-react';
import StatusBadge from '../../components/StatusBadge';
import { useStore } from '../../store/useStore';
import { formatNumber, formatDateTime } from '../../utils/helpers';
import type { ColumnsType } from 'antd/es/table';
import type { Equipment as EquipmentType, EquipmentAlert, OEEData, MaintenancePlan } from '../../types';

const Equipment = () => {
  const { equipment, equipmentAlerts, oeeData, maintenancePlans } = useStore();

  // 設備表格欄位
  const equipmentColumns: ColumnsType<EquipmentType> = [
    {
      title: '設備名稱',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      fixed: 'left',
    },
    {
      title: '狀態',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => <StatusBadge status={status} />,
    },
    {
      title: '運轉時數',
      dataIndex: 'runningHours',
      key: 'runningHours',
      width: 120,
      render: (value) => `${formatNumber(value)} h`,
    },
    {
      title: '溫度',
      dataIndex: 'temperature',
      key: 'temperature',
      width: 100,
      render: (value) => value ? `${value}°C` : '-',
    },
    {
      title: '振動',
      dataIndex: 'vibration',
      key: 'vibration',
      width: 100,
      render: (value) => value ? `${value} mm/s` : '-',
    },
    {
      title: '轉速',
      dataIndex: 'speed',
      key: 'speed',
      width: 100,
      render: (value) => value ? `${formatNumber(value)} rpm` : '-',
    },
    {
      title: '電流',
      dataIndex: 'current',
      key: 'current',
      width: 100,
      render: (value) => value ? `${value} A` : '-',
    },
  ];

  // 告警表格欄位
  const alertColumns: ColumnsType<EquipmentAlert> = [
    {
      title: '設備名稱',
      dataIndex: 'equipmentName',
      key: 'equipmentName',
      width: 150,
    },
    {
      title: '告警內容',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: '嚴重程度',
      dataIndex: 'severity',
      key: 'severity',
      width: 100,
      render: (severity) => <StatusBadge status={severity} />,
    },
    {
      title: '狀態',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => <StatusBadge status={status} />,
    },
    {
      title: '發生時間',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (value) => formatDateTime(value),
    },
  ];

  // OEE 表格欄位
  const oeeColumns: ColumnsType<OEEData> = [
    {
      title: '設備名稱',
      dataIndex: 'equipmentName',
      key: 'equipmentName',
      width: 150,
      fixed: 'left',
    },
    {
      title: '可用率',
      dataIndex: 'availability',
      key: 'availability',
      width: 120,
      render: (value) => (
        <Progress
          percent={Math.round(value)}
          size="small"
          status={value >= 85 ? 'success' : value >= 70 ? 'normal' : 'exception'}
        />
      ),
    },
    {
      title: '表現率',
      dataIndex: 'performance',
      key: 'performance',
      width: 120,
      render: (value) => (
        <Progress
          percent={Math.round(value)}
          size="small"
          status={value >= 85 ? 'success' : value >= 70 ? 'normal' : 'exception'}
        />
      ),
    },
    {
      title: '品質率',
      dataIndex: 'quality',
      key: 'quality',
      width: 120,
      render: (value) => (
        <Progress
          percent={Math.round(value)}
          size="small"
          status={value >= 95 ? 'success' : value >= 90 ? 'normal' : 'exception'}
        />
      ),
    },
    {
      title: 'OEE',
      dataIndex: 'oee',
      key: 'oee',
      width: 120,
      render: (value) => (
        <span style={{ 
          fontSize: 16, 
          fontWeight: 'bold',
          color: value >= 75 ? '#52c41a' : value >= 60 ? '#faad14' : '#ff4d4f'
        }}>
          {value}%
        </span>
      ),
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 120,
    },
  ];

  // 保養計畫表格欄位
  const maintenanceColumns: ColumnsType<MaintenancePlan> = [
    {
      title: '設備名稱',
      dataIndex: 'equipmentName',
      key: 'equipmentName',
      width: 150,
    },
    {
      title: '保養週期',
      dataIndex: 'cycle',
      key: 'cycle',
      width: 100,
    },
    {
      title: '上次保養',
      dataIndex: 'lastDate',
      key: 'lastDate',
      width: 120,
    },
    {
      title: '下次保養',
      dataIndex: 'nextDate',
      key: 'nextDate',
      width: 120,
    },
    {
      title: '負責人',
      dataIndex: 'responsible',
      key: 'responsible',
      width: 100,
    },
    {
      title: '狀態',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => <StatusBadge status={status} />,
    },
  ];

  // OEE 分布圖表
  const oeeDistributionOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: ['可用率', '表現率', '品質率'],
    },
    xAxis: {
      type: 'category',
      data: oeeData.slice(0, 10).map(d => d.equipmentName),
      axisLabel: {
        rotate: 45,
      },
    },
    yAxis: {
      type: 'value',
      name: '百分比 (%)',
      max: 100,
    },
    series: [
      {
        name: '可用率',
        type: 'bar',
        data: oeeData.slice(0, 10).map(d => d.availability),
        itemStyle: { color: '#1890ff' },
      },
      {
        name: '表現率',
        type: 'bar',
        data: oeeData.slice(0, 10).map(d => d.performance),
        itemStyle: { color: '#52c41a' },
      },
      {
        name: '品質率',
        type: 'bar',
        data: oeeData.slice(0, 10).map(d => d.quality),
        itemStyle: { color: '#faad14' },
      },
    ],
  };

  const tabItems = [
    {
      key: 'equipment',
      label: `設備列表 (${equipment.length})`,
      children: (
        <Table
          columns={equipmentColumns}
          dataSource={equipment}
          rowKey="id"
          scroll={{ x: 800 }}
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 筆` }}
        />
      ),
    },
    {
      key: 'alerts',
      label: (
        <span>
          設備告警 
          <Tag color="red" style={{ marginLeft: 8 }}>
            {equipmentAlerts.filter(a => a.status === 'pending').length}
          </Tag>
        </span>
      ),
      children: (
        <Table
          columns={alertColumns}
          dataSource={equipmentAlerts}
          rowKey="id"
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 筆` }}
        />
      ),
    },
    {
      key: 'oee',
      label: `OEE 分析 (${oeeData.length})`,
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card title="OEE 分布圖" bordered={false}>
            <ReactECharts option={oeeDistributionOption} style={{ height: 400 }} />
          </Card>
          <Table
            columns={oeeColumns}
            dataSource={oeeData}
            rowKey="equipmentId"
            scroll={{ x: 800 }}
            pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 筆` }}
          />
        </Space>
      ),
    },
    {
      key: 'maintenance',
      label: `保養計畫 (${maintenancePlans.length})`,
      children: (
        <Table
          columns={maintenanceColumns}
          dataSource={maintenancePlans}
          rowKey="id"
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 筆` }}
        />
      ),
    },
  ];

  return (
    <Card bordered={false}>
      <Tabs items={tabItems} />
    </Card>
  );
};

export default Equipment;

// Made with Bob
