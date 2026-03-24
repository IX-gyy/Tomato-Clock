import { useState, useEffect, useRef, useCallback } from 'react';
import type { TimerPhase, TimerSettings } from '../types';
import { loadRecords, loadConsecutivePomodoros, saveConsecutivePomodoros, resetConsecutivePomodoros } from '../utils/storage';
import dayjs from 'dayjs';

interface UseTimerProps {
  settings: TimerSettings;
  onComplete?: (phase: TimerPhase) => void;
}

interface UseTimerReturn {
  phase: TimerPhase;
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
  completedPomodoros: number;
  consecutivePomodoros: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
}

export function useTimer({ settings, onComplete }: UseTimerProps): UseTimerReturn {
  const [phase, setPhase] = useState<TimerPhase>('work');
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [totalTime, setTotalTime] = useState(settings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);

  const [completedPomodoros, setCompletedPomodoros] = useState(() => {
    const records = loadRecords();
    const today = dayjs().format('YYYY-MM-DD');
    return records.filter(record => 
      dayjs(record.completedAt).format('YYYY-MM-DD') === today
    ).length;
  });

  const [consecutivePomodoros, setConsecutivePomodoros] = useState(loadConsecutivePomodoros);

  const intervalRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const pausedTimeLeftRef = useRef<number>(settings.workDuration * 60);

  const getDurationForPhase = useCallback((p: TimerPhase): number => {
    switch (p) {
      case 'work':
        return settings.workDuration * 60;
      case 'shortBreak':
        return settings.shortBreakDuration * 60;
      case 'longBreak':
        return settings.longBreakDuration * 60;
      default:
        return settings.workDuration * 60;
    }
  }, [settings.workDuration, settings.shortBreakDuration, settings.longBreakDuration]);

  const tick = useCallback(() => {
    const now = Date.now();
    const delta = now - lastTimeRef.current;

    if (delta >= 1000) {
      setTimeLeft((prev) => {
        const newTimeLeft = Math.max(0, prev - Math.floor(delta / 1000));
        pausedTimeLeftRef.current = newTimeLeft;
        return newTimeLeft;
      });
      lastTimeRef.current = now;
    }
  }, []);

  const handlePhaseComplete = useCallback((skip = false) => {
    setPhase((currentPhase) => {
      let nextPhase: TimerPhase;
      let shouldResetConsecutive = false;

      if (currentPhase === 'work' && !skip) {
        const newCompletedCount = completedPomodoros + 1;
        setCompletedPomodoros(newCompletedCount);
        
        const newConsecutiveCount = consecutivePomodoros + 1;
        setConsecutivePomodoros(newConsecutiveCount);
        saveConsecutivePomodoros(newConsecutiveCount);

        if (newConsecutiveCount % 4 === 0) {
          nextPhase = 'longBreak';
        } else {
          nextPhase = 'shortBreak';
        }
      } else if (currentPhase === 'work' && skip) {
        nextPhase = 'shortBreak';
      } else {
        if (currentPhase === 'longBreak') {
          shouldResetConsecutive = true;
        }
        nextPhase = 'work';
      }

      const newTotalTime = getDurationForPhase(nextPhase);
      setTotalTime(newTotalTime);
      setTimeLeft(newTotalTime);
      pausedTimeLeftRef.current = newTotalTime;

      if (shouldResetConsecutive) {
        setConsecutivePomodoros(0);
        resetConsecutivePomodoros();
      }

      const shouldAutoStart = nextPhase === 'work' ? settings.autoStartWork : settings.autoStartBreak;
      if (shouldAutoStart) {
        setIsRunning(true);
        lastTimeRef.current = Date.now();
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        intervalRef.current = window.setInterval(tick, 100);
      }

      return nextPhase;
    });
  }, [completedPomodoros, consecutivePomodoros, getDurationForPhase, settings.autoStartWork, settings.autoStartBreak, tick]);

  const start = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      lastTimeRef.current = Date.now();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = window.setInterval(tick, 100);
    }
  }, [isRunning, tick]);

  const pause = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isRunning]);

  const reset = useCallback(() => {
    pause();
    const duration = getDurationForPhase(phase);
    setTimeLeft(duration);
    pausedTimeLeftRef.current = duration;
  }, [pause, phase, getDurationForPhase]);

  const skip = useCallback(() => {
    pause();
    handlePhaseComplete(true);
  }, [pause, handlePhaseComplete]);

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      onComplete?.(phase);
      pause();
      handlePhaseComplete(false);
    }
  }, [timeLeft, isRunning, phase, onComplete, pause, handlePhaseComplete]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
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
  };
}
