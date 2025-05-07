
import { useRef, useEffect, useState } from "react";

interface SoundEngineProps {
  isPlaying: boolean;
  frequency: number;
  volume: number;
  carrierFrequency?: number;
}

const SoundEngine = ({ isPlaying, frequency, volume, carrierFrequency = 200 }: SoundEngineProps) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorLeftRef = useRef<OscillatorNode | null>(null);
  const oscillatorRightRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const channelMergerRef = useRef<ChannelMergerNode | null>(null);

  // Initialize or clean up audio context
  useEffect(() => {
    // Create audio context if it doesn't exist
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    // Cleanup function
    return () => {
      if (oscillatorLeftRef.current) {
        oscillatorLeftRef.current.stop();
        oscillatorLeftRef.current.disconnect();
        oscillatorLeftRef.current = null;
      }
      
      if (oscillatorRightRef.current) {
        oscillatorRightRef.current.stop();
        oscillatorRightRef.current.disconnect();
        oscillatorRightRef.current = null;
      }
      
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
      }
      
      if (channelMergerRef.current) {
        channelMergerRef.current.disconnect();
        channelMergerRef.current = null;
      }
    };
  }, []);

  // Handle play/stop
  useEffect(() => {
    const ctx = audioContextRef.current;
    
    if (!ctx) return;
    
    if (isPlaying) {
      // Resume context if suspended
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      // Create channel merger for stereo
      const channelMerger = ctx.createChannelMerger(2);
      channelMergerRef.current = channelMerger;
      
      // Create gain node for volume control
      const gainNode = ctx.createGain();
      gainNode.gain.value = volume;
      gainNodeRef.current = gainNode;
      
      // Connect merger to gain and gain to destination
      channelMerger.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      // Create left oscillator (carrier frequency)
      const oscillatorLeft = ctx.createOscillator();
      oscillatorLeft.type = "sine";
      oscillatorLeft.frequency.value = carrierFrequency;
      oscillatorLeft.connect(channelMerger, 0, 0);
      oscillatorLeftRef.current = oscillatorLeft;
      
      // Create right oscillator (carrier + binaural beat frequency)
      const oscillatorRight = ctx.createOscillator();
      oscillatorRight.type = "sine";
      oscillatorRight.frequency.value = carrierFrequency + frequency;
      oscillatorRight.connect(channelMerger, 0, 1);
      oscillatorRightRef.current = oscillatorRight;
      
      // Start oscillators
      oscillatorLeft.start();
      oscillatorRight.start();
      
    } else {
      // Stop and disconnect oscillators when not playing
      if (oscillatorLeftRef.current) {
        oscillatorLeftRef.current.stop();
        oscillatorLeftRef.current.disconnect();
        oscillatorLeftRef.current = null;
      }
      
      if (oscillatorRightRef.current) {
        oscillatorRightRef.current.stop();
        oscillatorRightRef.current.disconnect();
        oscillatorRightRef.current = null;
      }
      
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
      }
      
      if (channelMergerRef.current) {
        channelMergerRef.current.disconnect();
        channelMergerRef.current = null;
      }
    }
  }, [isPlaying, carrierFrequency]);

  // Update frequency when it changes
  useEffect(() => {
    if (oscillatorRightRef.current && isPlaying) {
      oscillatorRightRef.current.frequency.value = carrierFrequency + frequency;
    }
  }, [frequency, carrierFrequency, isPlaying]);

  // Update volume when it changes
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  return null; // This component doesn't render anything
};

export default SoundEngine;
