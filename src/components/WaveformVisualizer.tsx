
import React, { useRef, useEffect } from 'react';

interface WaveformVisualizerProps {
  isPlaying: boolean;
  frequency: number;
  color?: string;
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ 
  isPlaying, 
  frequency,
  color = '#8B5CF6'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      if (canvas) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Animation parameters
    let phase = 0;
    
    const drawWave = () => {
      if (!ctx || !canvas) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (!isPlaying) {
        // Draw flat line when not playing
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
        return;
      }
      
      // Setup for drawing wave
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;
      
      // Calculate wave properties based on frequency
      // Higher frequencies get more waves across the canvas
      const cycles = Math.max(1, Math.min(12, Math.floor(frequency / 2)));
      
      // Draw the wave
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      
      for (let x = 0; x < width; x++) {
        // Calculate y position based on sine wave
        const normalizedX = x / width;
        
        // Add multiple sine waves for a more complex look
        const y = centerY - 
          Math.sin(normalizedX * Math.PI * 2 * cycles + phase) * (height * 0.2) -
          Math.sin(normalizedX * Math.PI * 1 * cycles + phase * 0.5) * (height * 0.1);
          
        ctx.lineTo(x, y);
      }
      
      // Create gradient for line
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, '#8B5CF6');   // Purple
      gradient.addColorStop(0.5, '#3B82F6');  // Blue
      gradient.addColorStop(1, '#14B8A6');   // Teal
      
      // Draw path
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.stroke();
      
      // Draw subtle glow
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;
      
      // Update phase for animation (speed based on frequency)
      phase += (frequency / 200);
      
      // Request next frame
      animationRef.current = requestAnimationFrame(drawWave);
    };
    
    // Start animation
    drawWave();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, frequency, color]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-20 rounded-md mb-4"
    />
  );
};

export default WaveformVisualizer;
