import { Card, Divider, message, Typography } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import { useTimer } from '../../hooks/useTimer';
import { loadSettings, loadTasks, saveTasks, saveRecord } from '../../utils/storage';
import {
  requestNotificationPermission,
  notifyTimerComplete,
} from '../../utils/notification';
import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';
import type { Task, TimerPhase, PomodoroRecord } from '../../types';
import './index.css';

const { Title, Text } = Typography;

interface TimerProps {
  activeTask?: Task;
}

export default function Timer({ activeTask }: TimerProps) {
  const [settings] = useState(loadSettings());
  const [notificationRequested, setNotificationRequested] = useState(false);

  const updateTaskPomodoros = useCallback(() => {
    if (activeTask) {
      const tasks = loadTasks();
      const updatedTasks = tasks.map((task) => {
        if (task.id === activeTask.id) {
          return { ...task, completedPomodoros: task.completedPomodoros + 1 };
        }
        return task;
      });
      saveTasks(updatedTasks);
    }
  }, [activeTask]);

  const handleTimerComplete = useCallback(
    (phase: TimerPhase) => {
      if (phase === 'work') {
        updateTaskPomodoros();
        const record: PomodoroRecord = {
          id: Date.now().toString(),
          taskId: activeTask?.id || null,
          taskTitle: activeTask?.title || '',
          phase: phase,
          duration: settings.workDuration,
          completedAt: Date.now(),
        };
        saveRecord(record);
      }
      notifyTimerComplete(settings.soundEnabled, settings.volume / 100);
      message.success('时间到了，该休息了！');
    },
    [settings.soundEnabled, settings.volume, updateTaskPomodoros, activeTask, settings.workDuration]
  );

  const {
    phase,
    timeLeft,
    totalTime,
    isRunning,
    completedPomodoros,
    consecutivePomodoros,
    start,
    pause,
    reset,
    skip,
  } = useTimer({
    settings,
    onComplete: handleTimerComplete,
  });

  useEffect(() => {
    if (!notificationRequested) {
      requestNotificationPermission().then((granted) => {
        if (granted) {
          setNotificationRequested(true);
        }
      });
    }
  }, [notificationRequested]);

  const handleStart = () => {
    start();
  };

  const handlePause = () => {
    pause();
  };

  const handleReset = () => {
    reset();
  };

  const handleSkip = () => {
    skip();
  };

  return (
    <Card
      className="timer-card"
      styles={{ body: { padding: 24 } }}
    >
      {activeTask && (
        <>
          <div className="active-task-section">
            <Text type="secondary" className="active-task-label">
              当前任务
            </Text>
            <Title level={4} className="active-task-title">
              {activeTask.title}
            </Title>
          </div>
          <Divider className="timer-divider" />
        </>
      )}

      <TimerDisplay
        phase={phase}
        timeLeft={timeLeft}
        totalTime={totalTime}
        completedPomodoros={completedPomodoros}
        consecutivePomodoros={consecutivePomodoros}
      />

      <Divider className="timer-divider" />

      <div className="timer-controls-container">
        <TimerControls
          isRunning={isRunning}
          onStart={handleStart}
          onPause={handlePause}
          onReset={handleReset}
          onSkip={handleSkip}
        />
      </div>
    </Card>
  );
}
