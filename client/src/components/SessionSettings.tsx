import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Minus, Plus, Volume2, VolumeX, Repeat, SkipForward } from 'lucide-react';

interface SessionSettingsProps {
  sessionGoal: number;
  completedPomodoros: number;
  soundEnabled: boolean;
  autoCycleEnabled: boolean;
  mode: 'work' | 'shortBreak' | 'longBreak';
  onSessionGoalChange: (goal: number) => void;
  onSoundToggle: (enabled: boolean) => void;
  onAutoCycleToggle: (enabled: boolean) => void;
  onSkipToNext: () => void;
}

export default function SessionSettings({
  sessionGoal,
  completedPomodoros,
  soundEnabled,
  autoCycleEnabled,
  mode,
  onSessionGoalChange,
  onSoundToggle,
  onAutoCycleToggle,
  onSkipToNext,
}: SessionSettingsProps) {
  const modeLabels = {
    work: '🍅 Work Session',
    shortBreak: '☕ Short Break',
    longBreak: '🎉 Long Break',
  };

  const modeColors = {
    work: 'bg-green-500/10 border-green-500/50 text-green-700',
    shortBreak: 'bg-blue-500/10 border-blue-500/50 text-blue-700',
    longBreak: 'bg-purple-500/10 border-purple-500/50 text-purple-700',
  };

  return (
    <Card className="p-6 space-y-6">
      {/* Current Mode */}
      <div className={`p-3 rounded-lg border-2 text-center font-medium ${modeColors[mode]}`}>
        {modeLabels[mode]}
      </div>

      {/* Session Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Session Progress</Label>
          <span className="text-sm text-muted-foreground">
            {completedPomodoros} / {sessionGoal} Pomodoros
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 rounded-full"
            style={{ width: `${Math.min((completedPomodoros / sessionGoal) * 100, 100)}%` }}
          />
        </div>

        {/* Pomodoro Indicators */}
        <div className="flex gap-2 justify-center flex-wrap">
          {Array.from({ length: sessionGoal }).map((_, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                i < completedPomodoros
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {i < completedPomodoros ? '✓' : i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Session Goal Setting */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Daily Goal</Label>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onSessionGoalChange(Math.max(1, sessionGoal - 1))}
            disabled={sessionGoal <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 text-center">
            <span className="text-2xl font-bold">{sessionGoal}</span>
            <span className="text-sm text-muted-foreground ml-2">Pomodoros</span>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => onSessionGoalChange(Math.min(12, sessionGoal + 1))}
            disabled={sessionGoal >= 12}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 text-muted-foreground" />
            ) : (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            )}
            <Label htmlFor="sound-toggle" className="text-sm cursor-pointer">
              Alarm Sound
            </Label>
          </div>
          <Switch
            id="sound-toggle"
            checked={soundEnabled}
            onCheckedChange={onSoundToggle}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Repeat className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="auto-cycle-toggle" className="text-sm cursor-pointer">
              Auto-start Next Session
            </Label>
          </div>
          <Switch
            id="auto-cycle-toggle"
            checked={autoCycleEnabled}
            onCheckedChange={onAutoCycleToggle}
          />
        </div>
      </div>

      {/* Skip Button */}
      <Button
        variant="outline"
        className="w-full"
        onClick={onSkipToNext}
      >
        <SkipForward className="h-4 w-4 mr-2" />
        Skip to Next Session
      </Button>
    </Card>
  );
}
