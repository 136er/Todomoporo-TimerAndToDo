import { useEffect, useRef } from 'react';

interface TimerCanvasProps {
  progress: number;
  displayTime: string;
  size?: number;
}

/**
 * Canvas-based circular timer with progress ring
 */
export function TimerCanvas({ progress, displayTime, size = 300 }: TimerCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const center = size / 2;
    const radius = center - 15;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Background ring (light gray)
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'hsl(var(--muted))';
    ctx.lineWidth = 12;
    ctx.stroke();

    // Progress ring (primary color)
    if (progress > 0) {
      ctx.beginPath();
      const startAngle = -Math.PI / 2; // Start at top
      const endAngle = startAngle + Math.PI * 2 * progress;
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.strokeStyle = 'hsl(var(--primary))';
      ctx.lineWidth = 12;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    // Display time text
    ctx.fillStyle = 'hsl(var(--foreground))';
    ctx.font = 'bold 48px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(displayTime, center, center);

  }, [progress, displayTime, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="mx-auto rounded-full shadow-lg"
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
}
