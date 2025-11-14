import { useState, useEffect, useCallback, useRef } from 'react';
import { saveTimerState, loadTimerState } from '@/lib/db';

const POMODORO_DURATION = 25 * 60; // 25 minutes in seconds

export interface UseTimerReturn {
  timeLeft: number;
  isRunning: boolean;
  progress: number;
  displayTime: string;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  setActiveTaskId: (id: number | null) => void;
  activeTaskId: number | null;
}

/**
 * Custom hook for Pomodoro timer functionality
 */
export function useTimer(): UseTimerReturn {
  const [timeLeft, setTimeLeft] = useState(POMODORO_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTaskId, setActiveTaskIdState] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate progress (0 to 1)
  const progress = 1 - timeLeft / POMODORO_DURATION;

  // Format time as MM:SS
  const displayTime = `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`;

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
          setIsRunning(false);
          
          // Show notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Pomodoro Complete!', {
              body: 'Great work! Time for a break.',
              icon: '/icon-192.png',
            });
          }
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

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
   * Reset the timer
   */
  const resetTimer = useCallback(() => {
    stopTimer();
    setTimeLeft(POMODORO_DURATION);
  }, [stopTimer]);

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
    if (isRunning) {
      document.title = `(${displayTime}) Pomodoro Timer`;
    } else {
      document.title = 'Pomodoro Timer';
    }
  }, [displayTime, isRunning]);

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
        });
      } catch (error) {
        console.error('Failed to save timer state:', error);
      }
    };

    save();
  }, [timeLeft, isRunning, activeTaskId]);

  /**
   * Load timer state from IndexedDB on mount
   */
  useEffect(() => {
    const load = async () => {
      try {
        const state = await loadTimerState();
        if (state) {
          setTimeLeft(state.timeLeft);
          setActiveTaskIdState(state.activeTaskId);
          
          // Resume timer if it was running
          if (state.isRunning) {
            startTimer();
          }
        }
      } catch (error) {
        console.error('Failed to load timer state:', error);
      }
    };

    load();
  }, [startTimer]);

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
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [timeLeft, isRunning, activeTaskId]);

  return {
    timeLeft,
    isRunning,
    progress,
    displayTime,
    startTimer,
    stopTimer,
    resetTimer,
    setActiveTaskId,
    activeTaskId,
  };
}
