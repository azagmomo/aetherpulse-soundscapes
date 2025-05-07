
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TIMER_OPTIONS } from "@/constants/frequencies";

interface TimerControlProps {
  selectedTime: number;
  onTimeChange: (time: number) => void;
  remainingTime: number | null;
}

const TimerControl = ({ selectedTime, onTimeChange, remainingTime }: TimerControlProps) => {
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-5 bg-zen-card-bg border-zinc-700/50">
      <h2 className="text-lg font-semibold mb-4">Timer</h2>
      
      <div className="flex items-center justify-between">
        <Select 
          value={selectedTime.toString()}
          onValueChange={(value) => onTimeChange(Number(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            {TIMER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {remainingTime !== null && selectedTime > 0 && (
          <div className="text-xl font-mono font-bold">
            {formatTime(remainingTime)}
          </div>
        )}
      </div>
    </Card>
  );
};

export default TimerControl;
