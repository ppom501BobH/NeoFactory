import { Row, Col, Card, Table, Space } from 'antd';
import ReactECharts from 'echarts-for-react';
import KPICard from '../../components/KPICard';
import StatusBadge from '../../components/StatusBadge';
import { useStore } from '../../store/useStore';
import { formatNumber, formatPercent } from '../../utils/helpers';
import { generateProductionTrend, generateYieldTrend, generateOEETrend } from '../../data/mockData';
import type { ColumnsType } from 'antd/es/table';
import type { ProductionLine } from '../../types';

const Dashboard = () => {
  const { productionLines, equipmentAlerts } = useStore();

  // 計算 KPI
  const totalOutput = productionLines.reduce((sum, line) => sum + line.actualOutput, 0);
  const totalTarget = productionLines.reduce((sum, line) => sum + line.targetOutput, 0);
  const achievementRate = totalTarget > 0 ? (totalOutput / totalTarget) * 100 : 0;
  const runningLines = productionLines.filter(line => line.status === 'running').length;
  const pendingAlerts = equipmentAlerts.filter(alert => alert.status === 'pending').length;

  // 產線表格欄位
  const lineColumns: ColumnsType<ProductionLine> = [
    {
      title: '產線',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: '狀態',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => <StatusBadge status={status} />,
    },
    {
      title: '當前產品',
      dataIndex: 'currentProduct',
      key: 'currentProduct',
    },
    {
      title: '班次',
      dataIndex: 'shift',
      key: 'shift',
      width: 80,
    },
    {
      title: '操作員',
      dataIndex: 'operator',
      key: 'operator',
      width: 100,
    },
    {
      title: '實際產量',
      dataIndex: 'actualOutput',
      key: 'actualOutput',
      width: 100,
      render: (value) => formatNumber(value),
    },
    {
      title: '目標產量',
      dataIndex: 'targetOutput',
      key: 'targetOutput',
      width: 100,
      render: (value) => formatNumber(value),
    },
    {
      title: '達成率',
      dataIndex: 'achievementRate',
      key: 'achievementRate',
      width: 100,
      render: (value) => (
        <span style={{ color: value >= 95 ? '#52c41a' : value >= 85 ? '#faad14' : '#ff4d4f' }}>
          {formatPercent(value)}
        </span>
      ),
    },
  ];

  // 產量趨勢圖表
  const productionTrendData = generateProductionTrend();
  const productionTrendOption = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['實際產量', '目標產量'],
    },
    xAxis: {
      type: 'category',
      data: productionTrendData.map(d => d.date),
    },
    yAxis: {
      type: 'value',
      name: '產量',
    },
    series: [
      {
        name: '實際產量',
        type: 'line',
        data: productionTrendData.map(d => d.actual),
        smooth: true,
        itemStyle: { color: '#1890ff' },
      },
      {
        name: '目標產量',
        type: 'line',
        data: productionTrendData.map(d => d.target),
        smooth: true,
        itemStyle: { color: '#52c41a' },
        lineStyle: { type: 'dashed' },
      },
    ],
  };

  // 良率趨勢圖表
  const yieldTrendData = generateYieldTrend();
  const yieldTrendOption = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        return params.map((p: any) => `${p.seriesName}: ${p.value}%`).join('<br/>');
      },
    },
    legend: {
      data: ['良率', '目標'],
    },
    xAxis: {
      type: 'category',
      data: yieldTrendData.map(d => d.date),
    },
    yAxis: {
      type: 'value',
      name: '良率 (%)',
      min: 90,
      max: 100,
    },
    series: [
      {
        name: '良率',
        type: 'line',
        data: yieldTrendData.map(d => d.yield),
        smooth: true,
        itemStyle: { color: '#52c41a' },
        areaStyle: { opacity: 0.3 },
      },
      {
        name: '目標',
        type: 'line',
        data: yieldTrendData.map(d => d.target),
        itemStyle: { color: '#ff4d4f' },
        lineStyle: { type: 'dashed' },
      },
    ],
  };

  // OEE 趨勢圖表
  const oeeTrendData = generateOEETrend();
  const oeeTrendOption = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        return params.map((p: any) => `${p.seriesName}: ${p.value}%`).join('<br/>');
      },
    },
    legend: {
      data: ['OEE', '目標'],
    },
    xAxis: {
      type: 'category',
      data: oeeTrendData.map(d => d.date),
    },
    yAxis: {
      type: 'value',
      name: 'OEE (%)',
      min: 60,
      max: 90,
    },
    series: [
      {
        name: 'OEE',
        type: 'bar',
        data: oeeTrendData.map(d => d.oee),
        itemStyle: { color: '#1890ff' },
      },
      {
        name: '目標',
        type: 'line',
        data: oeeTrendData.map(d => d.target),
        itemStyle: { color: '#ff4d4f' },
        lineStyle: { type: 'dashed' },
      },
    ],
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* KPI 卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="總產量"
            value={totalOutput}
            unit="件"
            trend={2.5}
            status="good"
            target={totalTarget}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="達成率"
            value={achievementRate.toFixed(1)}
            unit="%"
            trend={1.2}
            status={achievementRate >= 95 ? 'good' : achievementRate >= 85 ? 'warning' : 'bad'}
            target={95}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="運轉產線"
            value={runningLines}
            unit={`/ ${productionLines.length}`}
            status={runningLines >= productionLines.length * 0.8 ? 'good' : 'warning'}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="待處理告警"
            value={pendingAlerts}
            unit="件"
            status={pendingAlerts === 0 ? 'good' : pendingAlerts <= 3 ? 'warning' : 'bad'}
          />
        </Col>
      </Row>

      {/* 趨勢圖表 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="產量趨勢" bordered={false}>
            <ReactECharts option={productionTrendOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="良率趨勢" bordered={false}>
            <ReactECharts option={yieldTrendOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="OEE 趨勢" bordered={false}>
            <ReactECharts option={oeeTrendOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      {/* 產線狀態表格 */}
      <Card title="產線即時狀態" bordered={false}>
        <Table
          columns={lineColumns}
          dataSource={productionLines}
          rowKey="id"
          pagination={false}
          scroll={{ x: 1000 }}
        />
      </Card>
    </Space>
  );
};

export default Dashboard;

// Made with Bob
