
// Gemini API Service

// This is the API key - in a real app, this would be stored securely
// and accessed via a backend proxy for security
const API_KEY = "AIzaSyCSdE-kAUQdB73f8dKn5uKOb0qaZrh3OJA";

interface GeminiResponse {
  frequency: number;
  duration: number;
  background: string[];
  intensity: number;
  message: string;
}

/**
 * Makes a request to the Gemini API
 * Note: In a production app, this should be done through a backend service
 * to protect the API key
 */
export const generateAudioRecommendation = async (prompt: string): Promise<GeminiResponse> => {
  try {
    const systemPrompt = `
    You are a sound therapy assistant specialized in binaural beats. 
    Based on the user's emotional state or needs, recommend the optimal binaural beat frequency, 
    duration, and background sounds. Respond ONLY with a JSON object containing these fields:
    
    - frequency: A number between 0.5 and 40 (Hz)
    - duration: A number (minutes) - use 5, 10, 20, 30, or 60
    - background: An array of strings (possible values: "rain", "ocean", "wind", "fire", "chimes", or empty array for pure tone)
    - intensity: A number between 1 and 10
    - message: A short explanation of why this recommendation will help
    
    Choose frequency based on these ranges:
    - Delta (0.5-4 Hz): Deep sleep, trauma healing
    - Theta (4-8 Hz): Deep meditation, REM sleep
    - Alpha (8-12 Hz): Relaxation, mindfulness
    - Beta (12-30 Hz): Focus, alertness
    - Gamma (30-40 Hz): High-level cognition
    `;

    const userMessage = `User needs help with: ${prompt}`;

    // This section would make the actual API call in a production app
    // For the MVP, we'll simulate the response based on keywords
    console.log("Would send to Gemini API:", { systemPrompt, userMessage });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For MVP we're simulating this API call
    // In production, this would make a real fetch request
    /*
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemPrompt }
              ],
              role: "system"
            },
            {
              parts: [
                { text: userMessage }
              ],
              role: "user"
            }
          ],
          generationConfig: {
            temperature: 0.2,
            topP: 0.8,
            topK: 40
          }
        }),
      }
    );
    
    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;
    return JSON.parse(generatedText);
    */
    
    // Simulate response based on keywords in the prompt
    const promptLower = prompt.toLowerCase();
    
    if (promptLower.includes("sleep") || promptLower.includes("insomnia")) {
      return {
        frequency: 3.5,
        duration: 60,
        background: ["rain"],
        intensity: 7,
        message: "Delta waves at 3.5Hz help induce deep sleep by synchronizing with the brain's sleep cycles."
      };
    } else if (promptLower.includes("meditat") || promptLower.includes("calm")) {
      return {
        frequency: 6.0,
        duration: 30,
        background: ["chimes"],
        intensity: 5,
        message: "Theta waves at 6Hz promote a deep meditative state, supporting inner peace and spiritual growth."
      };
    } else if (promptLower.includes("focus") || promptLower.includes("study")) {
      return {
        frequency: 14.0,
        duration: 30,
        background: [],
        intensity: 6,
        message: "Beta waves at 14Hz enhance concentration and mental performance, ideal for sustained focus."
      };
    } else if (promptLower.includes("anxiety") || promptLower.includes("stress")) {
      return {
        frequency: 7.83,
        duration: 20,
        background: ["ocean", "wind"],
        intensity: 8,
        message: "The Schumann resonance at 7.83Hz helps reduce anxiety by promoting a grounded feeling that aligns with Earth's natural frequency."
      };
    } else {
      // Default response if no keywords match
      return {
        frequency: 10.0,
        duration: 20,
        background: ["rain"],
        intensity: 5,
        message: "Alpha waves at 10Hz create a balanced state of relaxed alertness, perfect for general wellbeing."
      };
    }
    
  } catch (error) {
    console.error("Error generating audio recommendation:", error);
    throw new Error("Failed to generate recommendation");
  }
};
