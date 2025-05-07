
import { useState, useRef, useEffect } from "react";
import { AmbientSound } from "@/constants/frequencies";
import { toast } from "sonner";

interface AmbientSoundPlayerProps {
  sound: AmbientSound;
  volume: number;
  isPlaying: boolean;
}

const AmbientSoundPlayer = ({ sound, volume, isPlaying }: AmbientSoundPlayerProps) => {
  const audioContext = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const noiseBufferRef = useRef<AudioBuffer | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Initialize or resume audio context on first interaction
  const initializeAudioContext = () => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    if (audioContext.current.state === "suspended") {
      audioContext.current.resume();
    }
    
    return audioContext.current;
  };

  // Generate noise buffer based on sound type
  const generateNoiseBuffer = (ctx: AudioContext, type: string) => {
    const bufferSize = ctx.sampleRate * 2; // 2 seconds of audio
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Different sound generation based on type
    switch (type) {
      case "rain":
        // Filtered white noise with droplet patterns
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
          // Add occasional droplet effects
          if (Math.random() > 0.998) {
            for (let j = 0; j < 300 && i + j < bufferSize; j++) {
              data[i + j] = Math.sin(j / 30) * Math.exp(-0.01 * j) * (Math.random() * 0.5 + 0.5);
            }
          }
        }
        break;
        
      case "ocean":
        // Low-frequency filtered noise with wave patterns
        for (let i = 0; i < bufferSize; i++) {
          const wave = Math.sin(i / 10000) * 0.5 + 0.5;
          data[i] = (Math.random() * 2 - 1) * wave;
        }
        break;
        
      case "wind":
        // Modulated filtered noise
        for (let i = 0; i < bufferSize; i++) {
          const modulation = Math.sin(i / 20000) * 0.5 + 0.5;
          data[i] = (Math.random() * 2 - 1) * modulation * 0.7;
        }
        break;
        
      case "fire":
        // Crackling noise
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
          // Add random crackles
          if (Math.random() > 0.997) {
            for (let j = 0; j < 100 && i + j < bufferSize; j++) {
              data[i + j] = (Math.random() * 2 - 1) * Math.exp(-0.1 * j);
            }
          }
        }
        break;
        
      case "chimes":
        // Occasional chime sounds on top of light wind
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.2; // Light background noise
          
          // Add occasional chimes
          if (Math.random() > 0.999) {
            const note = 220 * Math.pow(2, Math.floor(Math.random() * 12) / 12);
            for (let j = 0; j < 5000 && i + j < bufferSize; j++) {
              data[i + j] += Math.sin(j * note * Math.PI * 2 / ctx.sampleRate) * 
                              Math.exp(-0.0005 * j);
            }
          }
        }
        break;
        
      default:
        // Default white noise
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
    }
    
    return buffer;
  };

  // Start playing the ambient sound
  const startSound = () => {
    if (!sound.id || sound.id === "none") return;
    
    try {
      const ctx = initializeAudioContext();
      
      // Create gain node for volume control
      const gainNode = ctx.createGain();
      gainNode.gain.value = volume;
      gainNode.connect(ctx.destination);
      gainNodeRef.current = gainNode;
      
      // Generate appropriate noise buffer if not already created
      if (!noiseBufferRef.current) {
        noiseBufferRef.current = generateNoiseBuffer(ctx, sound.id);
      }
      
      // Create and connect source node
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBufferRef.current;
      noiseSource.loop = true;
      noiseSource.connect(gainNode);
      noiseSource.start(0);
      noiseSourceRef.current = noiseSource;
      
      console.log(`Playing ambient sound: ${sound.name}`);
    } catch (error) {
      console.error("Error starting ambient sound:", error);
      toast.error(`Could not play ${sound.name}. Please try again.`);
    }
  };

  // Stop playing the ambient sound
  const stopSound = () => {
    if (noiseSourceRef.current) {
      try {
        noiseSourceRef.current.stop();
        noiseSourceRef.current.disconnect();
        noiseSourceRef.current = null;
      } catch (error) {
        console.error("Error stopping ambient sound:", error);
      }
      console.log(`Paused ambient sound: ${sound.name}`);
    }
  };

  // Handle play/pause
  useEffect(() => {
    if (isPlaying && sound.id !== "none") {
      startSound();
    } else {
      stopSound();
    }
    
    return () => {
      stopSound();
    };
  }, [isPlaying, sound.id, sound.name]);
  
  // Update volume when it changes
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (noiseSourceRef.current) {
        noiseSourceRef.current.stop();
        noiseSourceRef.current.disconnect();
      }
      
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
      }
    };
  }, []);
  
  // This component doesn't render anything visible
  return null;
};

export default AmbientSoundPlayer;
