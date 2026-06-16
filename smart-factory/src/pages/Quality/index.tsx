import { Card, Table, Space, Row, Col, Statistic } from 'antd';
import ReactECharts from 'echarts-for-react';
import StatusBadge from '../../components/StatusBadge';
import { useStore } from '../../store/useStore';
import { formatNumber } from '../../utils/helpers';
import type { ColumnsType } from 'antd/es/table';
import type { CAPACase } from '../../types';

const Quality = () => {
  const { defectData, capaCases } = useStore();

  // 計算統計數據
  const totalDefects = defectData.reduce((sum, item) => sum + item.count, 0);
  const defectRate = 2.3; // 模擬不良率
  const yieldRate = 100 - defectRate;

  // CAPA 案件表格欄位
  const capaColumns: ColumnsType<CAPACase> = [
    {
      title: '案件編號',
      dataIndex: 'caseNumber',
      key: 'caseNumber',
      width: 180,
      fixed: 'left',
    },
    {
      title: '來源',
      dataIndex: 'source',
      key: 'source',
      width: 150,
    },
    {
      title: '嚴重程度',
      dataIndex: 'severity',
      key: 'severity',
      width: 100,
      render: (severity) => <StatusBadge status={severity} />,
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
    {
      title: '到期日',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 120,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
  ];

  // 不良類型 Pareto 圖
  const paretoOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {
      data: ['不良數量', '累積百分比'],
    },
    xAxis: [
      {
        type: 'category',
        data: defectData.map(d => d.type),
        axisLabel: {
          rotate: 45,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '數量',
        position: 'left',
      },
      {
        type: 'value',
        name: '累積百分比 (%)',
        position: 'right',
        max: 100,
      },
    ],
    series: [
      {
        name: '不良數量',
        type: 'bar',
        data: defectData.map(d => d.count),
        itemStyle: { color: '#1890ff' },
      },
      {
        name: '累積百分比',
        type: 'line',
        yAxisIndex: 1,
        data: defectData.map((_, index) => {
          const cumulative = defectData
            .slice(0, index + 1)
            .reduce((sum, item) => sum + item.percentage, 0);
          return cumulative.toFixed(1);
        }),
        itemStyle: { color: '#ff4d4f' },
        lineStyle: { width: 2 },
        markLine: {
          data: [{ yAxis: 80, name: '80%' }],
          lineStyle: { type: 'dashed', color: '#52c41a' },
        },
      },
    ],
  };

  // 不良類型分布圓餅圖
  const pieOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
    },
    series: [
      {
        name: '不良類型',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: '{b}: {d}%',
        },
        data: defectData.map(d => ({
          name: d.type,
          value: d.count,
        })),
      },
    ],
  };

  // CAPA 狀態統計
  const capaStats = {
    open: capaCases.filter(c => c.status === 'open').length,
    investigating: capaCases.filter(c => c.status === 'investigating').length,
    reviewing: capaCases.filter(c => c.status === 'reviewing').length,
    closed: capaCases.filter(c => c.status === 'closed').length,
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* 品質指標 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="良率"
              value={yieldRate}
              suffix="%"
              precision={2}
              valueStyle={{ color: yieldRate >= 97 ? '#52c41a' : '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="不良率"
              value={defectRate}
              suffix="%"
              precision={2}
              valueStyle={{ color: defectRate <= 3 ? '#52c41a' : '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="總不良數"
              value={totalDefects}
              suffix="件"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="CAPA 案件"
              value={capaCases.length}
              suffix="件"
              valueStyle={{ color: capaStats.open > 5 ? '#ff4d4f' : '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 不良分析圖表 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title="不良類型 Pareto 分析" bordered={false}>
            <ReactECharts option={paretoOption} style={{ height: 400 }} />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="不良類型分布" bordered={false}>
            <ReactECharts option={pieOption} style={{ height: 400 }} />
          </Card>
        </Col>
      </Row>

      {/* CAPA 統計 */}
      <Card title="CAPA 案件統計" bordered={false}>
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6}>
            <Statistic title="待處理" value={capaStats.open} valueStyle={{ color: '#8c8c8c' }} />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic title="調查中" value={capaStats.investigating} valueStyle={{ color: '#1890ff' }} />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic title="審核中" value={capaStats.reviewing} valueStyle={{ color: '#faad14' }} />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic title="已關閉" value={capaStats.closed} valueStyle={{ color: '#52c41a' }} />
          </Col>
        </Row>
      </Card>

      {/* CAPA 案件列表 */}
      <Card title="CAPA 案件列表" bordered={false}>
        <Table
          columns={capaColumns}
          dataSource={capaCases}
          rowKey="id"
          scroll={{ x: 1000 }}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 筆`,
          }}
        />
      </Card>
    </Space>
  );
};

export default Quality;

// Made with Bob
