import { Card, Table, Space, Select, Button, Progress, Tag } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import StatusBadge from '../../components/StatusBadge';
import { useStore } from '../../store/useStore';
import { formatNumber, formatDateTime } from '../../utils/helpers';
import type { ColumnsType } from 'antd/es/table';
import type { WorkOrder } from '../../types';

const Production = () => {
  const { workOrders, productionLines, selectedLine, setSelectedLine } = useStore();

  // 過濾工單
  const filteredOrders = selectedLine === 'all'
    ? workOrders
    : workOrders.filter(order => order.lineId === selectedLine);

  // 工單表格欄位
  const orderColumns: ColumnsType<WorkOrder> = [
    {
      title: '工單號',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 180,
      fixed: 'left',
    },
    {
      title: '產品名稱',
      dataIndex: 'productName',
      key: 'productName',
      width: 200,
    },
    {
      title: '優先級',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority) => {
        const colorMap = { high: 'red', medium: 'orange', low: 'blue' };
        const textMap = { high: '高', medium: '中', low: '低' };
        return <Tag color={colorMap[priority]}>{textMap[priority]}</Tag>;
      },
    },
    {
      title: '狀態',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => <StatusBadge status={status} />,
    },
    {
      title: '計畫數量',
      dataIndex: 'plannedQuantity',
      key: 'plannedQuantity',
      width: 120,
      render: (value) => formatNumber(value),
    },
    {
      title: '完成數量',
      dataIndex: 'completedQuantity',
      key: 'completedQuantity',
      width: 120,
      render: (value) => formatNumber(value),
    },
    {
      title: '完成進度',
      key: 'progress',
      width: 150,
      render: (_, record) => {
        const percent = (record.completedQuantity / record.plannedQuantity) * 100;
        return (
          <Progress
            percent={Math.round(percent)}
            size="small"
            status={percent >= 100 ? 'success' : percent >= 80 ? 'normal' : 'active'}
          />
        );
      },
    },
    {
      title: '開始時間',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 160,
      render: (value) => formatDateTime(value, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: '結束時間',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 160,
      render: (value) => formatDateTime(value, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: '產線',
      dataIndex: 'lineId',
      key: 'lineId',
      width: 100,
      render: (lineId) => {
        const line = productionLines.find(l => l.id === lineId);
        return line?.name || '-';
      },
    },
  ];

  // 統計數據
  const stats = {
    total: filteredOrders.length,
    pending: filteredOrders.filter(o => o.status === 'pending').length,
    inProgress: filteredOrders.filter(o => o.status === 'in-progress').length,
    paused: filteredOrders.filter(o => o.status === 'paused').length,
    completed: filteredOrders.filter(o => o.status === 'completed').length,
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* 統計卡片 */}
      <Card bordered={false}>
        <Space size="large" wrap>
          <div>
            <div style={{ fontSize: 14, color: '#8c8c8c' }}>總工單數</div>
            <div style={{ fontSize: 24, fontWeight: 'bold', marginTop: 8 }}>{stats.total}</div>
          </div>
          <div>
            <div style={{ fontSize: 14, color: '#8c8c8c' }}>待處理</div>
            <div style={{ fontSize: 24, fontWeight: 'bold', marginTop: 8, color: '#8c8c8c' }}>
              {stats.pending}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 14, color: '#8c8c8c' }}>進行中</div>
            <div style={{ fontSize: 24, fontWeight: 'bold', marginTop: 8, color: '#1890ff' }}>
              {stats.inProgress}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 14, color: '#8c8c8c' }}>暫停</div>
            <div style={{ fontSize: 24, fontWeight: 'bold', marginTop: 8, color: '#faad14' }}>
              {stats.paused}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 14, color: '#8c8c8c' }}>已完成</div>
            <div style={{ fontSize: 24, fontWeight: 'bold', marginTop: 8, color: '#52c41a' }}>
              {stats.completed}
            </div>
          </div>
        </Space>
      </Card>

      {/* 工單列表 */}
      <Card
        title="工單列表"
        bordered={false}
        extra={
          <Space>
            <Select
              value={selectedLine}
              onChange={setSelectedLine}
              style={{ width: 120 }}
              options={[
                { value: 'all', label: '全部產線' },
                ...productionLines.map(line => ({
                  value: line.id,
                  label: line.name,
                })),
              ]}
            />
            <Button icon={<ReloadOutlined />}>刷新</Button>
          </Space>
        }
      >
        <Table
          columns={orderColumns}
          dataSource={filteredOrders}
          rowKey="id"
          scroll={{ x: 1400 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 筆`,
          }}
        />
      </Card>
    </Space>
  );
};

export default Production;

// Made with Bob
