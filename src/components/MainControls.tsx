
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, Volume2 } from "lucide-react";

interface MainControlsProps {
  isPlaying: boolean;
  onPlayPauseToggle: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

const MainControls = ({ 
  isPlaying, 
  onPlayPauseToggle, 
  volume,
  onVolumeChange
}: MainControlsProps) => {
  const handleVolumeChange = (values: number[]) => {
    onVolumeChange(values[0]);
  };
  
  return (
    <Card className="bg-gradient-to-br from-zen-purple/20 to-zen-blue/20 border-zinc-700/50">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <Button 
            onClick={onPlayPauseToggle}
            size="lg"
            className={`w-16 h-16 rounded-full ${
              isPlaying ? "bg-zinc-800 text-white" : "bg-zen-purple text-white"
            } transition-all shadow-lg hover:scale-105`}
          >
            {isPlaying ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Play className="h-8 w-8 ml-1" />
            )}
          </Button>
          
          <div className="flex items-center space-x-3 bg-black/20 px-5 py-3 rounded-full w-full max-w-md">
            <Volume2 className="h-5 w-5 text-zen-text-secondary" />
            <Slider
              value={[volume]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-full"
            />
            <span className="text-sm font-medium">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MainControls;
