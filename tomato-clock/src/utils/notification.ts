export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'default') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function sendNotification(): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  new Notification('番茄钟', {
    body: '时间到了，该休息了！',
    icon: '🍅',
    badge: '🍅',
    tag: 'pomodoro-timer',
    requireInteraction: true,
  });
}

export function playNotificationSound(volume: number = 0.5): void {
  const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
  oscillator.frequency.setValueAtTime(1100, audioContext.currentTime + 0.1);
  oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.2);

  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
}

export function notifyTimerComplete(soundEnabled: boolean = true, volume: number = 0.5): void {
  sendNotification();

  if (soundEnabled) {
    playNotificationSound(volume);
  }
}
