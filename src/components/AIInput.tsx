
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateAudioRecommendation } from "@/services/geminiService";

interface AIInputProps {
  onAIResponse: (response: AIResponse) => void;
  isLoading: boolean;
}

export interface AIResponse {
  frequency: number;
  duration: number;
  backgroundSounds: string[];
  message: string;
}

const AIInput = ({ onAIResponse, isLoading }: AIInputProps) => {
  const [prompt, setPrompt] = useState("");
  const { toast } = useToast();
  
  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a request",
        description: "Tell us how you're feeling or what you need help with",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Call the Gemini API service
      const response = await generateAudioRecommendation(prompt);
      
      // Map the API response to our component's expected format
      onAIResponse({
        frequency: response.frequency,
        duration: response.duration,
        backgroundSounds: response.background,
        message: response.message
      });
      
      // Success toast
      toast({
        title: "Personalized session created",
        description: response.message,
      });
      
      // Clear prompt
      setPrompt("");
      
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Unable to generate a recommendation. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card className="p-5 bg-zen-card-bg border-zinc-700/50">
      <h2 className="text-lg font-semibold mb-4">AI Mode Selector</h2>
      
      <div className="space-y-4">
        <Textarea
          placeholder="Describe how you feel or what you need help with. For example: 'I need to focus on studying' or 'Help me fall asleep'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[80px]"
        />
        
        <Button 
          onClick={handleSubmit} 
          className="w-full bg-gradient-to-r from-zen-purple to-zen-blue hover:opacity-90"
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Personalized Session"}
        </Button>
      </div>
    </Card>
  );
};

export default AIInput;
