import { useState } from 'react';
import { Card, Table, Space, Input, Button, Timeline, Descriptions, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useStore } from '../../store/useStore';
import { formatDateTime, formatNumber } from '../../utils/helpers';
import type { ColumnsType } from 'antd/es/table';
import type { Batch } from '../../types';

const Traceability = () => {
  const { batches, productionLines } = useStore();
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [searchText, setSearchText] = useState('');

  // 過濾批次
  const filteredBatches = batches.filter(batch =>
    batch.batchNumber.toLowerCase().includes(searchText.toLowerCase()) ||
    batch.productName.toLowerCase().includes(searchText.toLowerCase())
  );

  // 批次表格欄位
  const batchColumns: ColumnsType<Batch> = [
    {
      title: '批次號',
      dataIndex: 'batchNumber',
      key: 'batchNumber',
      width: 180,
      fixed: 'left',
    },
    {
      title: '產品名稱',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: '生產日期',
      dataIndex: 'productionDate',
      key: 'productionDate',
      width: 120,
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
    {
      title: '數量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      render: (value) => formatNumber(value),
    },
    {
      title: '狀態',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const statusMap = {
          'in-progress': { color: 'blue', text: '生產中' },
          'completed': { color: 'green', text: '已完成' },
          'shipped': { color: 'purple', text: '已出貨' },
          'archived': { color: 'default', text: '已歸檔' },
        };
        const config = statusMap[status as keyof typeof statusMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Button type="link" onClick={() => setSelectedBatch(record)}>
          查看詳情
        </Button>
      ),
    },
  ];

  // 模擬生產履歷數據
  const generateHistory = (batch: Batch) => {
    const line = productionLines.find(l => l.id === batch.lineId);
    return {
      timeline: [
        {
          timestamp: `${batch.productionDate} 08:00:00`,
          station: '上料站',
          operator: '張明華',
          action: '原料上料',
          duration: 15,
        },
        {
          timestamp: `${batch.productionDate} 08:30:00`,
          station: '加工站',
          operator: '李淑芬',
          action: 'CNC 加工',
          duration: 120,
        },
        {
          timestamp: `${batch.productionDate} 10:45:00`,
          station: '組裝站',
          operator: '王建國',
          action: '零件組裝',
          duration: 90,
        },
        {
          timestamp: `${batch.productionDate} 12:30:00`,
          station: '檢測站',
          operator: '陳美玲',
          action: '品質檢驗',
          duration: 45,
        },
        {
          timestamp: `${batch.productionDate} 13:30:00`,
          station: '包裝站',
          operator: '林志偉',
          action: '成品包裝',
          duration: 30,
        },
      ],
      materials: [
        { materialName: '鋁合金板材', batchNumber: 'M20240101-001', quantity: 500, unit: 'kg' },
        { materialName: '不鏽鋼螺絲', batchNumber: 'M20240102-015', quantity: 2000, unit: '個' },
        { materialName: '電子元件', batchNumber: 'M20240103-008', quantity: 1000, unit: '個' },
        { materialName: '包裝材料', batchNumber: 'M20240104-022', quantity: 100, unit: '套' },
      ],
      qualityRecords: [
        {
          timestamp: `${batch.productionDate} 12:30:00`,
          inspector: '陳美玲',
          result: 'pass' as const,
          quantity: batch.quantity,
        },
        {
          timestamp: `${batch.productionDate} 12:45:00`,
          inspector: '陳美玲',
          result: 'fail' as const,
          defectType: '尺寸不符',
          quantity: 12,
        },
      ],
    };
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* 搜尋區 */}
      <Card bordered={false}>
        <Space>
          <Input
            placeholder="輸入批次號或產品名稱"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Button type="primary" icon={<SearchOutlined />}>
            搜尋
          </Button>
        </Space>
      </Card>

      {/* 批次列表 */}
      <Card title="批次列表" bordered={false}>
        <Table
          columns={batchColumns}
          dataSource={filteredBatches}
          rowKey="id"
          scroll={{ x: 900 }}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 筆`,
          }}
        />
      </Card>

      {/* 生產履歷詳情 */}
      {selectedBatch && (
        <Card
          title={`批次履歷：${selectedBatch.batchNumber}`}
          bordered={false}
          extra={
            <Button onClick={() => setSelectedBatch(null)}>關閉</Button>
          }
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* 基本資訊 */}
            <Descriptions title="基本資訊" bordered column={2}>
              <Descriptions.Item label="批次號">{selectedBatch.batchNumber}</Descriptions.Item>
              <Descriptions.Item label="產品名稱">{selectedBatch.productName}</Descriptions.Item>
              <Descriptions.Item label="生產日期">{selectedBatch.productionDate}</Descriptions.Item>
              <Descriptions.Item label="產線">
                {productionLines.find(l => l.id === selectedBatch.lineId)?.name || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="數量">{formatNumber(selectedBatch.quantity)} 件</Descriptions.Item>
              <Descriptions.Item label="狀態">
                {selectedBatch.status === 'in-progress' && <Tag color="blue">生產中</Tag>}
                {selectedBatch.status === 'completed' && <Tag color="green">已完成</Tag>}
                {selectedBatch.status === 'shipped' && <Tag color="purple">已出貨</Tag>}
                {selectedBatch.status === 'archived' && <Tag color="default">已歸檔</Tag>}
              </Descriptions.Item>
            </Descriptions>

            {/* 生產時間軸 */}
            <Card title="生產流程" size="small">
              <Timeline
                items={generateHistory(selectedBatch).timeline.map(event => ({
                  children: (
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{event.station}</div>
                      <div style={{ color: '#8c8c8c', fontSize: 12 }}>
                        {formatDateTime(event.timestamp)} | 操作員: {event.operator}
                      </div>
                      <div>{event.action} ({event.duration} 分鐘)</div>
                    </div>
                  ),
                }))}
              />
            </Card>

            {/* 原料使用 */}
            <Card title="原料使用" size="small">
              <Table
                size="small"
                columns={[
                  { title: '原料名稱', dataIndex: 'materialName', key: 'materialName' },
                  { title: '批次號', dataIndex: 'batchNumber', key: 'batchNumber' },
                  { 
                    title: '用量', 
                    key: 'quantity',
                    render: (_, record) => `${formatNumber(record.quantity)} ${record.unit}`,
                  },
                ]}
                dataSource={generateHistory(selectedBatch).materials}
                pagination={false}
              />
            </Card>

            {/* 品質記錄 */}
            <Card title="品質記錄" size="small">
              <Table
                size="small"
                columns={[
                  { 
                    title: '檢驗時間', 
                    dataIndex: 'timestamp', 
                    key: 'timestamp',
                    render: (value) => formatDateTime(value),
                  },
                  { title: '檢驗員', dataIndex: 'inspector', key: 'inspector' },
                  { 
                    title: '結果', 
                    dataIndex: 'result', 
                    key: 'result',
                    render: (result) => (
                      <Tag color={result === 'pass' ? 'green' : 'red'}>
                        {result === 'pass' ? '合格' : '不合格'}
                      </Tag>
                    ),
                  },
                  { title: '不良類型', dataIndex: 'defectType', key: 'defectType' },
                  { 
                    title: '數量', 
                    dataIndex: 'quantity', 
                    key: 'quantity',
                    render: (value) => formatNumber(value),
                  },
                ]}
                dataSource={generateHistory(selectedBatch).qualityRecords}
                pagination={false}
              />
            </Card>
          </Space>
        </Card>
      )}
    </Space>
  );
};

export default Traceability;

// Made with Bob
