
import { useState, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import CurrentMood from "@/components/dashboard/CurrentMood";
import WebcamEmotionDetector from "@/components/dashboard/WebcamEmotionDetector";
import { EmotionType } from "@/types/emotion";

const Dashboard = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            MoodLens Dashboard ✨
          </h1>
          <p className="text-gray-600 text-lg">
            Real-time AI emotion detection powered by your webcam and microphone
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-1">
            <CurrentMood 
              emotion={currentEmotion}
              confidence={confidence}
              isDetecting={isDetecting}
            />
          </div>
          
          <div className="xl:col-span-2">
            <WebcamEmotionDetector
              onEmotionDetected={handleEmotionDetected}
              isActive={isDetecting}
              onToggle={toggleDetection}
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              📊 Recent Emotions
            </h3>
            <p className="text-gray-500">Emotion history will appear here once connected to Supabase</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              📈 Emotion Trends
            </h3>
            <p className="text-gray-500">AI-powered insights and analytics coming soon</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
