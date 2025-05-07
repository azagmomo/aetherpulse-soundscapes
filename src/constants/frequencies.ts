
export interface FrequencyPreset {
  id: string;
  name: string;
  emoji: string;
  frequency: number;
  description: string;
  category: "sleep" | "meditation" | "focus" | "relax";
}

export const FREQUENCY_PRESETS: FrequencyPreset[] = [
  {
    id: "deep-sleep",
    name: "Deep Sleep",
    emoji: "💤",
    frequency: 3.5,
    description: "Delta waves for deep, restorative sleep",
    category: "sleep"
  },
  {
    id: "meditation",
    name: "Meditation",
    emoji: "😌",
    frequency: 6.0,
    description: "Theta waves for deep meditation",
    category: "meditation"
  },
  {
    id: "calm-focus",
    name: "Calm Focus",
    emoji: "🧘",
    frequency: 10.0,
    description: "Alpha waves for relaxed concentration",
    category: "focus"
  },
  {
    id: "light-drowsiness",
    name: "Light Drowsiness",
    emoji: "😴",
    frequency: 4.5,
    description: "Between Delta and Theta for falling asleep",
    category: "sleep"
  },
  {
    id: "mental-clarity",
    name: "Mental Clarity",
    emoji: "⚡",
    frequency: 14.0,
    description: "Beta waves for alertness and focus",
    category: "focus"
  },
  {
    id: "high-cognition",
    name: "High Cognition",
    emoji: "🧠",
    frequency: 32.0,
    description: "Gamma waves for high-level cognitive function",
    category: "focus"
  },
  {
    id: "relaxation",
    name: "Relaxation",
    emoji: "🌈",
    frequency: 8.4,
    description: "Alpha waves for relaxation and stress relief",
    category: "relax"
  },
  {
    id: "anxiety-relief",
    name: "Anxiety Relief",
    emoji: "🌊",
    frequency: 7.83,
    description: "Schumann resonance for grounding and stability",
    category: "relax"
  }
];

export interface AmbientSound {
  id: string;
  name: string;
  emoji: string;
  filename: string;
  description: string;
}

export const AMBIENT_SOUNDS: AmbientSound[] = [
  {
    id: "rain",
    name: "Rain",
    emoji: "🌧️",
    filename: "rain.mp3",
    description: "Gentle rainfall"
  },
  {
    id: "ocean",
    name: "Ocean Waves",
    emoji: "🌊",
    filename: "ocean.mp3",
    description: "Rolling ocean waves"
  },
  {
    id: "wind",
    name: "Breeze",
    emoji: "🌬️",
    filename: "wind.mp3",
    description: "Gentle wind through trees"
  },
  {
    id: "fire",
    name: "Fire",
    emoji: "🔥",
    filename: "fire.mp3",
    description: "Crackling fire sounds"
  },
  {
    id: "chimes",
    name: "Chimes",
    emoji: "🎐",
    filename: "chimes.mp3",
    description: "Soft wind chimes"
  },
  {
    id: "none",
    name: "Pure Tone",
    emoji: "🔇",
    filename: "",
    description: "Binaural beat only, no ambient sound"
  },
];

export const TIMER_OPTIONS = [
  { value: 5, label: "5 minutes" },
  { value: 10, label: "10 minutes" },
  { value: 20, label: "20 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 60, label: "60 minutes" },
  { value: 0, label: "Continuous" }
];
