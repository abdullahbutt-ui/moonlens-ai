
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, CameraOff, Mic, MicOff } from "lucide-react";
import { EmotionType } from "@/types/emotion";

interface EmotionDetectorProps {
  onEmotionDetected: (emotion: EmotionType, confidence: number) => void;
  isActive: boolean;
  onToggle: () => void;
}

const EmotionDetector = ({ onEmotionDetected, isActive, onToggle }: EmotionDetectorProps) => {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);

  // Mock emotion detection - replace with real AI later
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const emotions: EmotionType[] = ['happy', 'neutral', 'sad', 'surprised'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const confidence = Math.random() * 0.3 + 0.7; // 70-100%
      
      onEmotionDetected(randomEmotion, confidence);
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive, onEmotionDetected]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emotion Detection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
          {cameraEnabled ? (
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full mb-4 mx-auto animate-pulse" />
              <p className="text-gray-600">Camera feed would appear here</p>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <Camera className="w-12 h-12 mx-auto mb-2" />
              <p>Camera disabled</p>
            </div>
          )}
          
          {isActive && (
            <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          )}
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            variant={cameraEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => setCameraEnabled(!cameraEnabled)}
          >
            {cameraEnabled ? <Camera className="w-4 h-4 mr-2" /> : <CameraOff className="w-4 h-4 mr-2" />}
            {cameraEnabled ? "Disable Camera" : "Enable Camera"}
          </Button>
          
          <Button
            variant={micEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => setMicEnabled(!micEnabled)}
          >
            {micEnabled ? <Mic className="w-4 h-4 mr-2" /> : <MicOff className="w-4 h-4 mr-2" />}
            {micEnabled ? "Disable Mic" : "Enable Mic"}
          </Button>
        </div>

        <Button 
          onClick={onToggle}
          className={`w-full ${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
        >
          {isActive ? "Stop Detection" : "Start Detection"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmotionDetector;
