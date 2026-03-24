export type TimerPhase = 'work' | 'shortBreak' | 'longBreak';

export interface Task {
  id: string;
  title: string;
  completedPomodoros: number;
  createdAt: number;
  completed: boolean;
}

export interface TimerSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  autoStartBreak: boolean;
  autoStartWork: boolean;
  soundEnabled: boolean;
  notificationEnabled: boolean;
  volume: number;
}

export interface PomodoroRecord {
  id: string;
  taskId: string | null;
  taskTitle: string;
  phase: TimerPhase;
  duration: number;
  completedAt: number;
}

export interface StatisticsData {
  totalPomodoros: number;
  totalFocusTime: number;
  dailyRecords: PomodoroRecord[];
  weeklyRecords: PomodoroRecord[];
}
