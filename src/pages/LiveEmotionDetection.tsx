
import { useState, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import WebcamEmotionDetector from "@/components/dashboard/WebcamEmotionDetector";
import CurrentMood from "@/components/dashboard/CurrentMood";
import EmotionalAvatar from "@/components/dashboard/EmotionalAvatar";
import { EmotionType } from "@/types/emotion";

const LiveEmotionDetection = () => {
  const [currentEmotion, setCurrentEmotion] = useState<EmotionType>('neutral');
  const [confidence, setConfidence] = useState(0.8);
  const [isDetecting, setIsDetecting] = useState(false);

  const handleEmotionDetected = useCallback((emotion: EmotionType, conf: number) => {
    console.log(`🎭 Detected emotion: ${emotion} (${Math.round(conf * 100)}% confidence)`);
    setCurrentEmotion(emotion);
    setConfidence(conf);
  }, []);

  const toggleDetection = () => {
    setIsDetecting(!isDetecting);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Live Emotion Detection 🎭
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Real-time AI emotion detection powered by your webcam and microphone
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-1 space-y-6">
            <CurrentMood emotion={currentEmotion} confidence={confidence} isDetecting={isDetecting} />
            <div className="flex justify-center">
              <EmotionalAvatar currentEmotion={currentEmotion} confidence={confidence} />
            </div>
          </div>
          
          <div className="xl:col-span-2">
            <WebcamEmotionDetector 
              onEmotionDetected={handleEmotionDetected} 
              isActive={isDetecting} 
              onToggle={toggleDetection} 
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default LiveEmotionDetection;
