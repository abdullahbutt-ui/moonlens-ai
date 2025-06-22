
import { useState, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import CurrentMood from "@/components/dashboard/CurrentMood";
import WebcamEmotionDetector from "@/components/dashboard/WebcamEmotionDetector";
import { EmotionType } from "@/types/emotion";
import { SparklesCore } from "@/components/ui/sparkles";

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
    <div className="min-h-screen bg-black relative">
      {/* Background sparkles effect */}
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          id="dashboard-sparkles"
          background="transparent"
          minSize={0.4}
          maxSize={0.8}
          particleDensity={80}
          className="w-full h-full"
          particleColor="#8b5cf6"
          speed={0.3}
        />
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              MoodLens Dashboard ✨
            </h1>
            <p className="text-gray-300 text-lg">
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
            <div className="bg-black/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-purple-500/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
                📊 Recent Emotions
              </h3>
              <p className="text-gray-400">Emotion history will appear here once connected to Supabase</p>
            </div>
            
            <div className="bg-black/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-purple-500/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
                📈 Emotion Trends
              </h3>
              <p className="text-gray-400">AI-powered insights and analytics coming soon</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
