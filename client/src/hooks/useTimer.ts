import { useState, useEffect, useCallback, useRef } from 'react';
import { saveTimerState, loadTimerState } from '@/lib/db';
import { playAlarmSound } from '@/lib/audio';

const POMODORO_DURATION = 25 * 60; // 25 minutes in seconds
const SHORT_BREAK_DURATION = 5 * 60; // 5 minutes in seconds
const LONG_BREAK_DURATION = 15 * 60; // 15 minutes in seconds
const POMODOROS_BEFORE_LONG_BREAK = 4;

export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export interface UseTimerReturn {
  timeLeft: number;
  isRunning: boolean;
  progress: number;
  displayTime: string;
  mode: TimerMode;
  completedPomodoros: number;
  sessionGoal: number;
  soundEnabled: boolean;
  autoCycleEnabled: boolean;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  setActiveTaskId: (id: number | null) => void;
  setSessionGoal: (goal: number) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setAutoCycleEnabled: (enabled: boolean) => void;
  skipToNext: () => void;
  activeTaskId: number | null;
}

/**
 * Custom hook for Pomodoro timer functionality with automatic cycles
 */
export function useTimer(): UseTimerReturn {
  const [timeLeft, setTimeLeft] = useState(POMODORO_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>('work');
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [sessionGoal, setSessionGoal] = useState(4);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoCycleEnabled, setAutoCycleEnabled] = useState(true);
  const [activeTaskId, setActiveTaskIdState] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get duration for current mode
  const getCurrentDuration = useCallback(() => {
    switch (mode) {
      case 'work':
        return POMODORO_DURATION;
      case 'shortBreak':
        return SHORT_BREAK_DURATION;
      case 'longBreak':
        return LONG_BREAK_DURATION;
    }
  }, [mode]);

  // Calculate progress (0 to 1)
  const progress = 1 - timeLeft / getCurrentDuration();

  // Format time as MM:SS
  const displayTime = `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`;

  /**
   * Switch to next mode in the cycle
   */
  const switchToNextMode = useCallback(() => {
    if (mode === 'work') {
      const nextCompletedCount = completedPomodoros + 1;
      setCompletedPomodoros(nextCompletedCount);
      
      // Check if we need a long break
      if (nextCompletedCount % POMODOROS_BEFORE_LONG_BREAK === 0) {
        setMode('longBreak');
        setTimeLeft(LONG_BREAK_DURATION);
      } else {
        setMode('shortBreak');
        setTimeLeft(SHORT_BREAK_DURATION);
      }
    } else {
      // After any break, go back to work
      setMode('work');
      setTimeLeft(POMODORO_DURATION);
    }
  }, [mode, completedPomodoros]);

  /**
   * Handle timer completion
   */
  const handleTimerComplete = useCallback(() => {
    // Play alarm sound
    if (soundEnabled) {
      playAlarmSound(0.5);
    }

    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      const messages = {
        work: {
          title: 'Pomodoro Complete! 🍅',
          body: 'Great work! Time for a break.',
        },
        shortBreak: {
          title: 'Break Over! ⏰',
          body: 'Ready to focus again?',
        },
        longBreak: {
          title: 'Long Break Over! 🎉',
          body: 'Refreshed and ready to go!',
        },
      };

      const message = messages[mode];
      new Notification(message.title, {
        body: message.body,
        icon: '/icon-192.png',
      });
    }

    // Auto-cycle to next mode if enabled
    if (autoCycleEnabled) {
      switchToNextMode();
      // Auto-start next session after 3 seconds
      setTimeout(() => {
        startTimer();
      }, 3000);
    } else {
      setIsRunning(false);
    }
  }, [mode, soundEnabled, autoCycleEnabled, switchToNextMode]);

  /**
   * Start the timer
   */
  const startTimer = useCallback(() => {
    if (intervalRef.current) return; // Already running

    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Timer completed
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          
          handleTimerComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [handleTimerComplete]);

  /**
   * Stop the timer
   */
  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  /**
   * Reset the timer to current mode's duration
   */
  const resetTimer = useCallback(() => {
    stopTimer();
    setTimeLeft(getCurrentDuration());
  }, [stopTimer, getCurrentDuration]);

  /**
   * Skip to next mode
   */
  const skipToNext = useCallback(() => {
    stopTimer();
    switchToNextMode();
  }, [stopTimer, switchToNextMode]);

  /**
   * Set active task ID
   */
  const setActiveTaskId = useCallback((id: number | null) => {
    setActiveTaskIdState(id);
  }, []);

  /**
   * Update document title with timer
   */
  useEffect(() => {
    const modeEmojis = {
      work: '🍅',
      shortBreak: '☕',
      longBreak: '🎉',
    };

    if (isRunning) {
      document.title = `${modeEmojis[mode]} (${displayTime}) Pomodoro Timer`;
    } else {
      document.title = 'Pomodoro Timer';
    }
  }, [displayTime, isRunning, mode]);

  /**
   * Save timer state to IndexedDB
   */
  useEffect(() => {
    const save = async () => {
      try {
        await saveTimerState({
          timeLeft,
          isRunning,
          activeTaskId,
          mode,
          completedPomodoros,
          sessionGoal,
          soundEnabled,
          autoCycleEnabled,
        });
      } catch (error) {
        console.error('Failed to save timer state:', error);
      }
    };

    save();
  }, [timeLeft, isRunning, activeTaskId, mode, completedPomodoros, sessionGoal, soundEnabled, autoCycleEnabled]);

  /**
   * Load timer state from IndexedDB on mount
   */
  useEffect(() => {
    const load = async () => {
      try {
        const state = await loadTimerState();
        if (state) {
          setTimeLeft(state.timeLeft || POMODORO_DURATION);
          setActiveTaskIdState(state.activeTaskId || null);
          setMode((state as any).mode || 'work');
          setCompletedPomodoros((state as any).completedPomodoros || 0);
          setSessionGoal((state as any).sessionGoal || 4);
          setSoundEnabled((state as any).soundEnabled !== false);
          setAutoCycleEnabled((state as any).autoCycleEnabled !== false);
          
          // Don't auto-resume timer on page load
          // User must manually start
        }
      } catch (error) {
        console.error('Failed to load timer state:', error);
      }
    };

    load();
  }, []);

  /**
   * Request notification permission on mount
   */
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  /**
   * Save state before page unload
   */
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveTimerState({
        timeLeft,
        isRunning,
        activeTaskId,
        mode,
        completedPomodoros,
        sessionGoal,
        soundEnabled,
        autoCycleEnabled,
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [timeLeft, isRunning, activeTaskId, mode, completedPomodoros, sessionGoal, soundEnabled, autoCycleEnabled]);

  return {
    timeLeft,
    isRunning,
    progress,
    displayTime,
    mode,
    completedPomodoros,
    sessionGoal,
    soundEnabled,
    autoCycleEnabled,
    startTimer,
    stopTimer,
    resetTimer,
    setActiveTaskId,
    setSessionGoal,
    setSoundEnabled,
    setAutoCycleEnabled,
    skipToNext,
    activeTaskId,
  };
}
