import { Progress, Typography } from 'antd';
import type { TimerPhase } from '../../types';
import './TimerDisplay.css';

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
    <div className="timer-display">
      <div className="timer-progress-wrapper">
        <Progress
          type="circle"
          percent={progress}
          size={280}
          strokeColor={phaseColors[phase]}
          railColor="#f0f0f0"
          strokeWidth={8}
          showInfo={false}
        />
        <div className="timer-progress-content">
          <Title
            level={1}
            className={`timer-time ${phase}`}
          >
            {formatTime(timeLeft)}
          </Title>
          <Text className="timer-phase">
            {phaseLabels[phase]}
          </Text>
        </div>
      </div>

      <div className="timer-stats">
        <div className="timer-pomodoros">
          <span className="timer-pomodoro-icon">🍅</span>
          <Text className="timer-pomodoros-text">
            今日已完成: {completedPomodoros} 个番茄
          </Text>
        </div>
        {phase === 'work' && (
          <Text className="timer-hint">
            🔄 {getLongBreakHint()}
          </Text>
        )}
      </div>
    </div>
  );
}
