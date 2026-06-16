import { Card, Statistic, Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import type { KPICard as KPICardType } from '../types';

interface KPICardProps extends KPICardType {
  loading?: boolean;
}

const KPICard = ({ title, value, unit, trend, status, target, loading }: KPICardProps) => {
  const getTrendColor = () => {
    if (!trend) return undefined;
    if (status === 'good') return '#52c41a';
    if (status === 'warning') return '#faad14';
    if (status === 'bad') return '#ff4d4f';
    return trend > 0 ? '#52c41a' : '#ff4d4f';
  };

  const getValueColor = () => {
    if (status === 'good') return '#52c41a';
    if (status === 'warning') return '#faad14';
    if (status === 'bad') return '#ff4d4f';
    return undefined;
  };

  return (
    <Card bordered={false} loading={loading}>
      <Statistic
        title={title}
        value={value}
        suffix={unit}
        valueStyle={{ color: getValueColor() }}
      />
      <Space style={{ marginTop: 8 }}>
        {trend !== undefined && (
          <span style={{ color: getTrendColor(), fontSize: 14 }}>
            {trend > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            {Math.abs(trend)}%
          </span>
        )}
        {target !== undefined && (
          <span style={{ color: '#8c8c8c', fontSize: 14 }}>
            目標: {target}{unit}
          </span>
        )}
      </Space>
    </Card>
  );
};

export default KPICard;

// Made with Bob
