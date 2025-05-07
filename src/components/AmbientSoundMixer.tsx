
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { AMBIENT_SOUNDS } from "@/constants/frequencies";

interface AmbientSoundMixerProps {
  selectedSounds: { id: string; volume: number }[];
  onSoundToggle: (soundId: string, isActive: boolean) => void;
  onVolumeChange: (soundId: string, volume: number) => void;
}

const AmbientSoundMixer = ({ 
  selectedSounds, 
  onSoundToggle, 
  onVolumeChange 
}: AmbientSoundMixerProps) => {
  const soundIsActive = (soundId: string) => {
    return selectedSounds.some(s => s.id === soundId);
  };
  
  const getSoundVolume = (soundId: string) => {
    const sound = selectedSounds.find(s => s.id === soundId);
    return sound ? sound.volume : 0.5;
  };
  
  return (
    <Card className="p-5 bg-zen-card-bg border-zinc-700/50">
      <h2 className="text-lg font-semibold mb-4">Ambient Sounds</h2>
      
      <div className="space-y-4">
        {AMBIENT_SOUNDS.filter(sound => sound.id !== "none").map(sound => (
          <div key={sound.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xl">{sound.emoji}</span>
              <div className="flex flex-col">
                <span className="font-medium text-sm">{sound.name}</span>
                <span className="text-xs text-zen-text-secondary">{sound.description}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {soundIsActive(sound.id) && (
                <div className="w-32">
                  <Slider 
                    min={0} 
                    max={1} 
                    step={0.01} 
                    value={[getSoundVolume(sound.id)]}
                    onValueChange={(value) => onVolumeChange(sound.id, value[0])}
                  />
                </div>
              )}
              
              <Switch 
                checked={soundIsActive(sound.id)} 
                onCheckedChange={(isChecked) => onSoundToggle(sound.id, isChecked)} 
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AmbientSoundMixer;
