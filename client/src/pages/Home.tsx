import { useEffect } from 'react';
import { TimerCanvas } from '@/components/TimerCanvas';
import { TimerControls } from '@/components/TimerControls';
import { TaskList } from '@/components/TaskList';
import SessionSettings from '@/components/SessionSettings';
import { useTimer } from '@/hooks/useTimer';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

/**
 * Main Pomodoro Timer page
 */
export default function Home() {
  const {
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
  } = useTimer();

  /**
   * Request notification permission on mount
   */
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          toast.success('Notifications enabled');
        }
      });
    }
  }, []);

  /**
   * Register Service Worker
   */
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      {/* Header */}
      <header className="py-8 text-center border-b">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
          <span className="text-5xl">🍅</span>
          Pomodoro Timer
        </h1>
        <p className="text-muted-foreground mt-2">
          Stay focused and productive with the Pomodoro Technique
        </p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Timer Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timer Display */}
            <Card className="p-8">
              <div className="flex flex-col items-center space-y-6">
                <TimerCanvas
                  progress={progress}
                  displayTime={displayTime}
                  isRunning={isRunning}
                  mode={mode}
                />
                <TimerControls
                  isRunning={isRunning}
                  onStart={startTimer}
                  onStop={stopTimer}
                  onReset={resetTimer}
                />
                <p className="text-sm text-muted-foreground">
                  {mode === 'work'
                    ? 'Click Start to begin a 25-minute focus session'
                    : mode === 'shortBreak'
                    ? 'Take a 5-minute break'
                    : 'Enjoy your 15-minute long break'}
                </p>
              </div>
            </Card>

            {/* How it Works */}
            <Card className="p-6 bg-gradient-to-br from-red-500 to-orange-500 text-white">
              <h2 className="text-xl font-bold mb-4">How it works</h2>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-lg">✓</span>
                  <span>Work for 25 minutes without interruption</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg">✓</span>
                  <span>Take a 5-minute break</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg">✓</span>
                  <span>After 4 sessions, take a longer 15-30 minute break</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg">✓</span>
                  <span>Track your tasks and stay organized</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Session Settings */}
            <SessionSettings
              sessionGoal={sessionGoal}
              completedPomodoros={completedPomodoros}
              soundEnabled={soundEnabled}
              autoCycleEnabled={autoCycleEnabled}
              mode={mode}
              onSessionGoalChange={setSessionGoal}
              onSoundToggle={setSoundEnabled}
              onAutoCycleToggle={setAutoCycleEnabled}
              onSkipToNext={skipToNext}
            />

            {/* Task List */}
            <TaskList
              activeTaskId={activeTaskId}
              onTaskSelect={(id) => {
                setActiveTaskId(id);
                if (id !== null) {
                  toast.success('Task linked to timer');
                }
              }}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground border-t mt-12">
        Built with ❤️ using React, TypeScript, and IndexedDB
      </footer>
    </div>
  );
}
