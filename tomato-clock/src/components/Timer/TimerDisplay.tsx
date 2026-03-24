import { Progress, Typography } from 'antd';
import type { TimerPhase } from '../../types';

const { Title, Text } = Typography;

interface TimerDisplayProps {
  phase: TimerPhase;
  timeLeft: number;
  totalTime: number;
  completedPomodoros: number;
  consecutivePomodoros: number;
}

const phaseLabels: Record<TimerPhase, string> = {
  work: '专注中',
  shortBreak: '短休息',
  longBreak: '长休息',
};

const phaseColors: Record<TimerPhase, string> = {
  work: '#ff6b6b',
  shortBreak: '#4ecdc4',
  longBreak: '#45b7d1',
};

export default function TimerDisplay({
  phase,
  timeLeft,
  totalTime,
  completedPomodoros,
  consecutivePomodoros,
}: TimerDisplayProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const getLongBreakHint = () => {
    const remaining = 4 - (consecutivePomodoros % 4);
    if (remaining === 4) {
      return '下一个就是长休息！';
    }
    return `距离长休息还有 ${remaining} 个番茄`;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 280,
          height: 280,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Progress
          type="circle"
          percent={progress}
          size={280}
          strokeColor={phaseColors[phase]}
          trailColor="#f0f0f0"
          strokeWidth={8}
          showInfo={false}
        />
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Title
            level={1}
            style={{
              margin: 0,
              fontSize: 64,
              fontFamily: 'ui-monospace, Consolas, monospace',
              color: phaseColors[phase],
            }}
          >
            {formatTime(timeLeft)}
          </Title>
          <Text
            style={{
              fontSize: 18,
              color: '#666',
            }}
          >
            {phaseLabels[phase]}
          </Text>
        </div>
      </div>

      <div
        style={{
          marginTop: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 24 }}>🍅</span>
          <Text style={{ fontSize: 16, color: '#666' }}>
            今日已完成: {completedPomodoros} 个番茄
          </Text>
        </div>
        {phase === 'work' && (
          <Text
            style={{
              fontSize: 14,
              color: '#45b7d1',
              fontStyle: 'italic',
            }}
          >
            🔄 {getLongBreakHint()}
          </Text>
        )}
      </div>
    </div>
  );
}
