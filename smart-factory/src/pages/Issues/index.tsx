import { Card, Table, Space, Tabs, Tag, Progress, Row, Col, Statistic } from 'antd';
import ReactECharts from 'echarts-for-react';
import StatusBadge from '../../components/StatusBadge';
import { useStore } from '../../store/useStore';
import { formatDateTime } from '../../utils/helpers';
import type { ColumnsType } from 'antd/es/table';
import type { IssueCase, ImprovementProject } from '../../types';

const Issues = () => {
  const { issueCases, improvementProjects } = useStore();

  // 異常案件表格欄位
  const issueColumns: ColumnsType<IssueCase> = [
    {
      title: '案件編號',
      dataIndex: 'caseNumber',
      key: 'caseNumber',
      width: 180,
      fixed: 'left',
    },
    {
      title: '類型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => {
        const typeMap = {
          equipment: { color: 'blue', text: '設備' },
          quality: { color: 'red', text: '品質' },
          material: { color: 'orange', text: '物料' },
          safety: { color: 'purple', text: '安全' },
          other: { color: 'default', text: '其他' },
        };
        const config = typeMap[type as keyof typeof typeMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '嚴重程度',
      dataIndex: 'severity',
      key: 'severity',
      width: 100,
      render: (severity) => <StatusBadge status={severity} />,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '回報人',
      dataIndex: 'reporter',
      key: 'reporter',
      width: 100,
    },
    {
      title: '指派給',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      width: 100,
      render: (value) => value || '-',
    },
    {
      title: '狀態',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => <StatusBadge status={status} />,
    },
    {
      title: 'SLA 剩餘',
      dataIndex: 'slaRemaining',
      key: 'slaRemaining',
      width: 100,
      render: (hours) => {
        if (hours === undefined) return '-';
        const color = hours > 12 ? '#52c41a' : hours > 4 ? '#faad14' : '#ff4d4f';
        return <span style={{ color }}>{hours}h</span>;
      },
    },
    {
      title: '建立時間',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (value) => formatDateTime(value, 'MM-DD HH:mm'),
    },
  ];

  // 改善專案表格欄位
  const projectColumns: ColumnsType<ImprovementProject> = [
    {
      title: '專案名稱',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      fixed: 'left',
    },
    {
      title: 'PDCA 階段',
      dataIndex: 'phase',
      key: 'phase',
      width: 120,
      render: (phase) => {
        const phaseMap = {
          plan: { color: 'blue', text: 'Plan' },
          do: { color: 'orange', text: 'Do' },
          check: { color: 'purple', text: 'Check' },
          act: { color: 'green', text: 'Act' },
        };
        const config = phaseMap[phase as keyof typeof phaseMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '進度',
      dataIndex: 'progress',
      key: 'progress',
      width: 150,
      render: (progress) => (
        <Progress
          percent={progress}
          size="small"
          status={progress >= 100 ? 'success' : 'active'}
        />
      ),
    },
    {
      title: '負責人',
      dataIndex: 'responsible',
      key: 'responsible',
      width: 100,
    },
    {
      title: '開始日期',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 120,
    },
    {
      title: '目標日期',
      dataIndex: 'targetDate',
      key: 'targetDate',
      width: 120,
    },
    {
      title: '改善前',
      key: 'before',
      width: 150,
      render: (_, record) => {
        if (!record.beforeMetrics) return '-';
        return (
          <div style={{ fontSize: 12 }}>
            {record.beforeMetrics.defectRate && <div>不良率: {record.beforeMetrics.defectRate}%</div>}
            {record.beforeMetrics.oee && <div>OEE: {record.beforeMetrics.oee}%</div>}
          </div>
        );
      },
    },
    {
      title: '改善後',
      key: 'after',
      width: 150,
      render: (_, record) => {
        if (!record.afterMetrics) return '-';
        return (
          <div style={{ fontSize: 12, color: '#52c41a' }}>
            {record.afterMetrics.defectRate && <div>不良率: {record.afterMetrics.defectRate}%</div>}
            {record.afterMetrics.oee && <div>OEE: {record.afterMetrics.oee}%</div>}
          </div>
        );
      },
    },
  ];

  // 異常類型統計
  const issueTypeStats = {
    equipment: issueCases.filter(c => c.type === 'equipment').length,
    quality: issueCases.filter(c => c.type === 'quality').length,
    material: issueCases.filter(c => c.type === 'material').length,
    safety: issueCases.filter(c => c.type === 'safety').length,
    other: issueCases.filter(c => c.type === 'other').length,
  };

  // 異常狀態統計
  const issueStatusStats = {
    new: issueCases.filter(c => c.status === 'new').length,
    assigned: issueCases.filter(c => c.status === 'assigned').length,
    inProgress: issueCases.filter(c => c.status === 'in-progress').length,
    resolved: issueCases.filter(c => c.status === 'resolved').length,
    closed: issueCases.filter(c => c.status === 'closed').length,
  };

  // 異常類型分布圖
  const typeDistributionOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: '異常類型',
        type: 'pie',
        radius: '60%',
        data: [
          { name: '設備異常', value: issueTypeStats.equipment },
          { name: '品質異常', value: issueTypeStats.quality },
          { name: '物料異常', value: issueTypeStats.material },
          { name: '安全異常', value: issueTypeStats.safety },
          { name: '其他', value: issueTypeStats.other },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  // 改善專案進度圖
  const projectProgressOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    xAxis: {
      type: 'value',
      max: 100,
    },
    yAxis: {
      type: 'category',
      data: improvementProjects.map(p => p.name),
    },
    series: [
      {
        name: '進度',
        type: 'bar',
        data: improvementProjects.map(p => p.progress),
        itemStyle: {
          color: (params: any) => {
            const progress = params.value;
            if (progress >= 100) return '#52c41a';
            if (progress >= 75) return '#1890ff';
            if (progress >= 50) return '#faad14';
            return '#ff4d4f';
          },
        },
        label: {
          show: true,
          position: 'right',
          formatter: '{c}%',
        },
      },
    ],
  };

  const tabItems = [
    {
      key: 'issues',
      label: `異常案件 (${issueCases.length})`,
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* 統計卡片 */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={4}>
              <Card bordered={false}>
                <Statistic title="新建" value={issueStatusStats.new} valueStyle={{ color: '#8c8c8c' }} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={4}>
              <Card bordered={false}>
                <Statistic title="已指派" value={issueStatusStats.assigned} valueStyle={{ color: '#1890ff' }} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={4}>
              <Card bordered={false}>
                <Statistic title="處理中" value={issueStatusStats.inProgress} valueStyle={{ color: '#faad14' }} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={4}>
              <Card bordered={false}>
                <Statistic title="已解決" value={issueStatusStats.resolved} valueStyle={{ color: '#52c41a' }} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={4}>
              <Card bordered={false}>
                <Statistic title="已關閉" value={issueStatusStats.closed} valueStyle={{ color: '#52c41a' }} />
              </Card>
            </Col>
          </Row>

          {/* 異常類型分布 */}
          <Card title="異常類型分布" bordered={false}>
            <ReactECharts option={typeDistributionOption} style={{ height: 300 }} />
          </Card>

          {/* 異常案件列表 */}
          <Table
            columns={issueColumns}
            dataSource={issueCases}
            rowKey="id"
            scroll={{ x: 1200 }}
            pagination={{
              pageSize: 10,
              showTotal: (total) => `共 ${total} 筆`,
            }}
          />
        </Space>
      ),
    },
    {
      key: 'projects',
      label: `改善專案 (${improvementProjects.length})`,
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* 專案進度圖 */}
          <Card title="專案進度總覽" bordered={false}>
            <ReactECharts option={projectProgressOption} style={{ height: 400 }} />
          </Card>

          {/* 改善專案列表 */}
          <Table
            columns={projectColumns}
            dataSource={improvementProjects}
            rowKey="id"
            scroll={{ x: 1200 }}
            pagination={{
              pageSize: 10,
              showTotal: (total) => `共 ${total} 筆`,
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <Card bordered={false}>
      <Tabs items={tabItems} />
    </Card>
  );
};

export default Issues;

// Made with Bob
