
import { useState, useRef, useEffect } from "react";
import { AmbientSound } from "@/constants/frequencies";
import { toast } from "sonner";

interface AmbientSoundPlayerProps {
  sound: AmbientSound;
  volume: number;
  isPlaying: boolean;
}

const AmbientSoundPlayer = ({ sound, volume, isPlaying }: AmbientSoundPlayerProps) => {
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  // Initialize or resume audio context on first interaction
  const initializeAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }
    
    return audioContextRef.current;
  };

  // Start playing the ambient sound
  const startSound = () => {
    if (!sound.id || sound.id === "none" || !sound.filename) return;
    
    try {
      // Create audio element if it doesn't exist
      if (!audioElementRef.current) {
        const audioElement = new Audio(`/sounds/${sound.filename}`);
        audioElement.loop = true;
        audioElementRef.current = audioElement;
        
        // Set up audio context and nodes
        const ctx = initializeAudioContext();
        
        // Create source from audio element
        const source = ctx.createMediaElementSource(audioElement);
        sourceNodeRef.current = source;
        
        // Create gain node for volume control
        const gainNode = ctx.createGain();
        gainNode.gain.value = volume;
        gainNodeRef.current = gainNode;
        
        // Connect the nodes
        source.connect(gainNode);
        gainNode.connect(ctx.destination);
      }
      
      // Start playback
      audioElementRef.current.play()
        .then(() => {
          console.log(`Playing ambient sound: ${sound.name}`);
        })
        .catch(error => {
          console.error("Error playing audio:", error);
          toast.error(`Could not play ${sound.name}. Please try again.`);
        });
    } catch (error) {
      console.error("Error starting ambient sound:", error);
      toast.error(`Could not play ${sound.name}. Please try again.`);
    }
  };

  // Stop playing the ambient sound
  const stopSound = () => {
    if (audioElementRef.current) {
      try {
        audioElementRef.current.pause();
        console.log(`Paused ambient sound: ${sound.name}`);
      } catch (error) {
        console.error("Error stopping ambient sound:", error);
      }
    }
  };

  // Handle play/pause
  useEffect(() => {
    if (isPlaying && sound.id !== "none" && sound.filename) {
      startSound();
    } else {
      stopSound();
    }
    
    return () => {
      stopSound();
    };
  }, [isPlaying, sound.id, sound.name, sound.filename]);
  
  // Update volume when it changes
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
    
    if (audioElementRef.current) {
      // As a fallback, also set the volume on the audio element
      audioElementRef.current.volume = volume;
    }
  }, [volume]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current.src = "";
      }
      
      if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect();
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
