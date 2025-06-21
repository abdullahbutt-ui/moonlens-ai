
import { useState, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import CurrentMood from "@/components/dashboard/CurrentMood";
import EmotionDetector from "@/components/dashboard/EmotionDetector";
import { EmotionType } from "@/types/emotion";

const Dashboard = () => {
  const [currentEmotion, setCurrentEmotion] = useState<EmotionType>('neutral');
  const [confidence, setConfidence] = useState(0.8);
  const [isDetecting, setIsDetecting] = useState(false);

  const handleEmotionDetected = useCallback((emotion: EmotionType, conf: number) => {
    setCurrentEmotion(emotion);
    setConfidence(conf);
  }, []);

  const toggleDetection = () => {
    setIsDetecting(!isDetecting);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600">
            Let's track your emotions and discover patterns in your mood.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <CurrentMood 
              emotion={currentEmotion}
              confidence={confidence}
              isDetecting={isDetecting}
            />
          </div>
          
          <div className="lg:col-span-2">
            <EmotionDetector
              onEmotionDetected={handleEmotionDetected}
              isActive={isDetecting}
              onToggle={toggleDetection}
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Recent Emotions</h3>
            <p className="text-gray-500">Emotion history will appear here once connected to Supabase</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Emotion Trends</h3>
            <p className="text-gray-500">Charts and analytics will appear here</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
