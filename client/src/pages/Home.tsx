import { useEffect } from 'react';
import { TimerCanvas } from '@/components/TimerCanvas';
import { TimerControls } from '@/components/TimerControls';
import { TaskList } from '@/components/TaskList';
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
    startTimer,
    stopTimer,
    resetTimer,
    setActiveTaskId,
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="container py-8 md:py-12">
        {/* Header */}
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            🍅 Pomodoro Timer
          </h1>
          <p className="text-gray-600 text-lg">
            Stay focused and productive with the Pomodoro Technique
          </p>
        </header>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Timer Section */}
          <div className="space-y-6">
            <Card className="p-8 shadow-xl bg-white/80 backdrop-blur">
              <div className="space-y-6">
                {/* Canvas Timer */}
                <TimerCanvas
                  progress={progress}
                  displayTime={displayTime}
                  size={280}
                />

                {/* Timer Controls */}
                <TimerControls
                  isRunning={isRunning}
                  onStart={startTimer}
                  onStop={stopTimer}
                  onReset={resetTimer}
                />

                {/* Timer Info */}
                <div className="text-center text-sm text-muted-foreground">
                  {isRunning ? (
                    <p className="text-green-600 font-medium">⏱️ Timer is running...</p>
                  ) : timeLeft === 0 ? (
                    <p className="text-blue-600 font-medium">✅ Session complete!</p>
                  ) : (
                    <p>Click Start to begin a 25-minute focus session</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Info Card */}
            <Card className="p-6 bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg">
              <h3 className="font-semibold text-lg mb-2">How it works</h3>
              <ul className="space-y-2 text-sm">
                <li>✓ Work for 25 minutes without interruption</li>
                <li>✓ Take a 5-minute break</li>
                <li>✓ After 4 sessions, take a longer 15-30 minute break</li>
                <li>✓ Track your tasks and stay organized</li>
              </ul>
            </Card>
          </div>

          {/* Tasks Section */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your Tasks
              </h2>
              <p className="text-gray-600 text-sm">
                Add tasks and click one to link it with the timer
              </p>
            </div>
            
            <TaskList
              activeTaskId={activeTaskId}
              onTaskSelect={(taskId) => {
                setActiveTaskId(taskId);
                if (taskId) {
                  resetTimer();
                  startTimer();
                  toast.success('Task selected! Timer started.');
                } else {
                  resetTimer();
                  toast.info('Task deselected. Timer reset.');
                }
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-sm text-gray-500">
          <p>
            Built with ❤️ using React, TypeScript, and IndexedDB
          </p>
        </footer>
      </div>
    </div>
  );
}
