import type { TimerSettings, Task, PomodoroRecord } from '../types';

const SETTINGS_KEY = 'tomato-clock-settings';
const TASKS_KEY = 'tomato-clock-tasks';
const RECORDS_KEY = 'tomato-clock-records';
const CONSECUTIVE_KEY = 'tomato-clock-consecutive';
const DARK_MODE_KEY = 'tomato-clock-dark-mode';

export const defaultSettings: TimerSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreak: false,
  autoStartWork: false,
  soundEnabled: true,
  notificationEnabled: true,
  volume: 50,
};

export function loadSettings(): TimerSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultSettings, ...parsed };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return defaultSettings;
}

export function saveSettings(settings: TimerSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

export function loadTasks(): Task[] {
  try {
    const stored = localStorage.getItem(TASKS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load tasks:', error);
  }
  return [];
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks:', error);
  }
}

export function loadRecords(): PomodoroRecord[] {
  try {
    const stored = localStorage.getItem(RECORDS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load records:', error);
  }
  return [];
}

export function saveRecord(record: PomodoroRecord): void {
  try {
    const records = loadRecords();
    records.push(record);
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  } catch (error) {
    console.error('Failed to save record:', error);
  }
}

export function saveRecords(records: PomodoroRecord[]): void {
  try {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  } catch (error) {
    console.error('Failed to save records:', error);
  }
}

export function loadConsecutivePomodoros(): number {
  try {
    const stored = localStorage.getItem(CONSECUTIVE_KEY);
    if (stored) {
      return parseInt(stored, 10);
    }
  } catch (error) {
    console.error('Failed to load consecutive pomodoros:', error);
  }
  return 0;
}

export function saveConsecutivePomodoros(count: number): void {
  try {
    localStorage.setItem(CONSECUTIVE_KEY, count.toString());
  } catch (error) {
    console.error('Failed to save consecutive pomodoros:', error);
  }
}

export function resetConsecutivePomodoros(): void {
  saveConsecutivePomodoros(0);
}

export function loadDarkMode(): boolean {
  try {
    const stored = localStorage.getItem(DARK_MODE_KEY);
    if (stored) {
      return stored === 'true';
    }
  } catch (error) {
    console.error('Failed to load dark mode:', error);
  }
  return false;
}

export function saveDarkMode(darkMode: boolean): void {
  try {
    localStorage.setItem(DARK_MODE_KEY, darkMode.toString());
  } catch (error) {
    console.error('Failed to save dark mode:', error);
  }
}
