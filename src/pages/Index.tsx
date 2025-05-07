
import { useState, useEffect, useRef } from "react";
import SoundEngine from "@/components/SoundEngine";
import FrequencySelector from "@/components/FrequencySelector";
import AmbientSoundMixer from "@/components/AmbientSoundMixer";
import TimerControl from "@/components/TimerControl";
import WaveformVisualizer from "@/components/WaveformVisualizer";
import MainControls from "@/components/MainControls";
import AIInput, { AIResponse } from "@/components/AIInput";
import AmbientSoundPlayer from "@/components/AmbientSoundPlayer";
import { FrequencyPreset, AMBIENT_SOUNDS } from "@/constants/frequencies";

const Index = () => {
  // State for audio
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequency, setFrequency] = useState(6.0); // Default to 6Hz (theta - meditation)
  const [volume, setVolume] = useState(0.7);
  const [selectedSounds, setSelectedSounds] = useState<{ id: string; volume: number }[]>([
    { id: "rain", volume: 0.5 }
  ]);
  
  // State for timer
  const [timerDuration, setTimerDuration] = useState(0); // 0 = continuous
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // State for AI
  const [isAILoading, setIsAILoading] = useState(false);
  
  // Timer logic
  useEffect(() => {
    if (isPlaying && timerDuration > 0) {
      setRemainingTime(timerDuration * 60);
      
      timerRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev === null || prev <= 1) {
            // Timer complete
            clearInterval(timerRef.current as NodeJS.Timeout);
            setIsPlaying(false);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isPlaying) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (timerDuration === 0) {
        setRemainingTime(null);
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, timerDuration]);
  
  // Handlers
  const handlePlayPauseToggle = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleFrequencyChange = (newFrequency: number) => {
    setFrequency(newFrequency);
  };
  
  const handlePresetSelect = (preset: FrequencyPreset) => {
    setFrequency(preset.frequency);
  };
  
  const handleTimeChange = (time: number) => {
    setTimerDuration(time);
    if (time === 0) {
      setRemainingTime(null);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    } else if (isPlaying) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setRemainingTime(time * 60);
      
      timerRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            setIsPlaying(false);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setRemainingTime(time * 60);
    }
  };
  
  const handleSoundToggle = (soundId: string, isActive: boolean) => {
    if (isActive) {
      setSelectedSounds(prev => [...prev, { id: soundId, volume: 0.5 }]);
    } else {
      setSelectedSounds(prev => prev.filter(sound => sound.id !== soundId));
    }
  };
  
  const handleSoundVolumeChange = (soundId: string, volume: number) => {
    setSelectedSounds(prev => 
      prev.map(sound => 
        sound.id === soundId ? { ...sound, volume } : sound
      )
    );
  };
  
  const handleAIResponse = (response: AIResponse) => {
    setIsAILoading(true);
    
    // Apply the AI recommendations
    setTimeout(() => {
      setFrequency(response.frequency);
      setTimerDuration(response.duration);
      if (response.duration > 0) {
        setRemainingTime(response.duration * 60);
      }
      
      // Set background sounds
      const newSelectedSounds = response.backgroundSounds.map(id => ({
        id,
        volume: 0.5
      }));
      setSelectedSounds(newSelectedSounds);
      
      // Start playback
      setIsPlaying(true);
      
      setIsAILoading(false);
    }, 500);
  };
  
  return (
    <div className="min-h-screen w-full bg-zen-dark-bg text-zen-text-primary p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-zen-purple via-zen-blue to-zen-teal inline-block text-transparent bg-clip-text">
            BinauralZen
          </h1>
          <p className="text-zen-text-secondary mt-2">
            AI-Powered Binaural Beats & Conscious Soundscapes
          </p>
        </header>
        
        <div className="mb-8">
          <WaveformVisualizer 
            isPlaying={isPlaying} 
            frequency={frequency} 
          />
          
          <MainControls 
            isPlaying={isPlaying}
            onPlayPauseToggle={handlePlayPauseToggle}
            volume={volume}
            onVolumeChange={setVolume}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FrequencySelector 
              frequency={frequency}
              onFrequencyChange={handleFrequencyChange}
              onPresetSelect={handlePresetSelect}
            />
            
            <AIInput 
              onAIResponse={handleAIResponse}
              isLoading={isAILoading}
            />
          </div>
          
          <div className="space-y-6">
            <AmbientSoundMixer 
              selectedSounds={selectedSounds}
              onSoundToggle={handleSoundToggle}
              onVolumeChange={handleSoundVolumeChange}
            />
            
            <TimerControl 
              selectedTime={timerDuration}
              onTimeChange={handleTimeChange}
              remainingTime={remainingTime}
            />
          </div>
        </div>
        
        <footer className="mt-12 text-center text-zen-text-secondary text-sm">
          <p>
            BinauralZen — AI-Powered Binaural Beats & Conscious Soundscapes
          </p>
          <p className="mt-1">
            For best experience, use headphones 🎧
          </p>
        </footer>
      </div>
      
      {/* Audio Engine */}
      <SoundEngine 
        isPlaying={isPlaying}
        frequency={frequency}
        volume={volume}
        carrierFrequency={200}
      />
      
      {/* Ambient Sound Players */}
      {selectedSounds.map(sound => {
        const soundData = AMBIENT_SOUNDS.find(s => s.id === sound.id);
        if (!soundData) return null;
        
        return (
          <AmbientSoundPlayer
            key={sound.id}
            sound={soundData}
            volume={sound.volume * volume} // Master volume affects ambient sounds too
            isPlaying={isPlaying}
          />
        );
      })}
    </div>
  );
};

export default Index;
