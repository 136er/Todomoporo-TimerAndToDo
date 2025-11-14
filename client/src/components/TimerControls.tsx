import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

interface TimerControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

/**
 * Timer control buttons (Start, Stop, Reset)
 */
export function TimerControls({
  isRunning,
  onStart,
  onStop,
  onReset,
}: TimerControlsProps) {
  return (
    <div className="flex gap-3 justify-center items-center">
      {!isRunning ? (
        <Button
          onClick={onStart}
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white min-w-[120px]"
        >
          <Play className="mr-2 h-5 w-5" />
          Start
        </Button>
      ) : (
        <Button
          onClick={onStop}
          size="lg"
          variant="destructive"
          className="min-w-[120px]"
        >
          <Pause className="mr-2 h-5 w-5" />
          Stop
        </Button>
      )}

      <Button
        onClick={onReset}
        size="lg"
        variant="outline"
        className="min-w-[120px]"
      >
        <RotateCcw className="mr-2 h-5 w-5" />
        Reset
      </Button>
    </div>
  );
}
