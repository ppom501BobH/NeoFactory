import { Tag } from 'antd';
import { getStatusColor, getStatusText } from '../utils/helpers';

interface StatusBadgeProps {
  status: string;
  text?: string;
}

const StatusBadge = ({ status, text }: StatusBadgeProps) => {
  return (
    <Tag color={getStatusColor(status)}>
      {text || getStatusText(status)}
    </Tag>
  );
};

export default StatusBadge;

// Made with Bob
