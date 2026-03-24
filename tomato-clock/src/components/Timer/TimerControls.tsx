import { Button, Space } from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  RedoOutlined,
  StepForwardOutlined,
} from '@ant-design/icons';

interface TimerControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export default function TimerControls({
  isRunning,
  onStart,
  onPause,
  onReset,
  onSkip,
}: TimerControlsProps) {
  return (
    <Space size="large">
      {isRunning ? (
        <Button
          type="primary"
          size="large"
          icon={<PauseCircleOutlined />}
          onClick={onPause}
          danger
          style={{ minWidth: 120, height: 48, fontSize: 16 }}
        >
          暂停
        </Button>
      ) : (
        <Button
          type="primary"
          size="large"
          icon={<PlayCircleOutlined />}
          onClick={onStart}
          style={{ minWidth: 120, height: 48, fontSize: 16 }}
        >
          开始
        </Button>
      )}

      <Button
        size="large"
        icon={<RedoOutlined />}
        onClick={onReset}
        style={{ minWidth: 100, height: 48, fontSize: 16 }}
      >
        重置
      </Button>

      <Button
        size="large"
        icon={<StepForwardOutlined />}
        onClick={onSkip}
        style={{ minWidth: 100, height: 48, fontSize: 16 }}
      >
        跳过
      </Button>
    </Space>
  );
}
