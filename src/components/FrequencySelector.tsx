
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FREQUENCY_PRESETS, FrequencyPreset } from "@/constants/frequencies";

interface FrequencySelectorProps {
  frequency: number;
  onFrequencyChange: (frequency: number) => void;
  onPresetSelect: (preset: FrequencyPreset) => void;
}

const FrequencySelector = ({ frequency, onFrequencyChange, onPresetSelect }: FrequencySelectorProps) => {
  const categories = Array.from(new Set(FREQUENCY_PRESETS.map(p => p.category)));
  
  const handleSliderChange = (value: number[]) => {
    onFrequencyChange(value[0]);
  };
  
  const getFrequencyDescription = () => {
    if (frequency <= 4) return "Delta waves: Deep sleep, healing";
    if (frequency <= 8) return "Theta waves: Meditation, REM sleep";
    if (frequency <= 12) return "Alpha waves: Relaxation, mindfulness";
    if (frequency <= 30) return "Beta waves: Focus, alertness";
    return "Gamma waves: High cognition";
  };
  
  return (
    <Card className="p-5 bg-zen-card-bg border-zinc-700/50">
      <h2 className="text-lg font-semibold mb-4">Frequency</h2>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-2xl font-bold">{frequency.toFixed(1)} Hz</span>
          <span className="text-sm text-zen-text-secondary">{getFrequencyDescription()}</span>
        </div>
        <Slider 
          min={0.5} 
          max={40} 
          step={0.1}
          value={[frequency]} 
          onValueChange={handleSliderChange}
          className="my-4"
        />
      </div>
      
      <Tabs defaultValue={categories[0]}>
        <TabsList className="mb-4 w-full">
          {categories.map(category => (
            <TabsTrigger 
              key={category} 
              value={category}
              className="flex-1 capitalize"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map(category => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="grid grid-cols-2 gap-2">
              {FREQUENCY_PRESETS
                .filter(preset => preset.category === category)
                .map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => onPresetSelect(preset)}
                    className={`p-3 rounded-lg transition-all flex flex-col items-center justify-center ${
                      Math.abs(frequency - preset.frequency) < 0.1 
                        ? "bg-primary/20 border border-primary/50" 
                        : "bg-black/20 hover:bg-black/30 border border-white/5"
                    }`}
                  >
                    <span className="text-xl">{preset.emoji}</span>
                    <span className="font-medium text-sm">{preset.name}</span>
                    <span className="text-xs text-zen-text-secondary">{preset.frequency} Hz</span>
                  </button>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
};

export default FrequencySelector;
