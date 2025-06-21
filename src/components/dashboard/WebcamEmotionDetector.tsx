
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, CameraOff, Mic, MicOff, Play, Square } from "lucide-react";
import { EmotionType } from "@/types/emotion";
import { useMediaDevices } from "@/hooks/useMediaDevices";

interface WebcamEmotionDetectorProps {
  onEmotionDetected: (emotion: EmotionType, confidence: number) => void;
  isActive: boolean;
  onToggle: () => void;
}

const WebcamEmotionDetector = ({ onEmotionDetected, isActive, onToggle }: WebcamEmotionDetectorProps) => {
  const {
    isWebcamActive,
    isMicActive,
    videoRef,
    startWebcam,
    stopWebcam,
    toggleMic
  } = useMediaDevices();

  const [isProcessing, setIsProcessing] = useState(false);
  const processingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mock emotion detection with MediaPipe-style processing
  const processFrame = async () => {
    if (!isWebcamActive || !videoRef.current) return;

    setIsProcessing(true);
    
    // Simulate MediaPipe face detection processing time
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Mock emotion detection results (replace with real MediaPipe later)
    const emotions: EmotionType[] = ['happy', 'neutral', 'sad', 'surprised', 'angry'];
    const weights = [0.4, 0.3, 0.1, 0.1, 0.1]; // Happy and neutral more likely
    
    const randomValue = Math.random();
    let cumulativeWeight = 0;
    let selectedEmotion = emotions[0];
    
    for (let i = 0; i < emotions.length; i++) {
      cumulativeWeight += weights[i];
      if (randomValue < cumulativeWeight) {
        selectedEmotion = emotions[i];
        break;
      }
    }
    
    const confidence = Math.random() * 0.25 + 0.75; // 75-100% confidence
    onEmotionDetected(selectedEmotion, confidence);
    
    setIsProcessing(false);
  };

  // Start/stop emotion detection
  useEffect(() => {
    if (isActive && isWebcamActive) {
      processingIntervalRef.current = setInterval(processFrame, 5000); // Every 5 seconds
    } else {
      if (processingIntervalRef.current) {
        clearInterval(processingIntervalRef.current);
        processingIntervalRef.current = null;
      }
    }

    return () => {
      if (processingIntervalRef.current) {
        clearInterval(processingIntervalRef.current);
      }
    };
  }, [isActive, isWebcamActive]);

  const handleWebcamToggle = () => {
    if (isWebcamActive) {
      stopWebcam();
    } else {
      startWebcam();
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Live Emotion Detection</span>
          <div className="flex items-center space-x-2">
            {isProcessing && (
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            )}
            {isActive && isWebcamActive && (
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Video Feed */}
        <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
          {isWebcamActive ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {isProcessing && (
                <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                  <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                    Analyzing...
                  </div>
                </div>
              )}
              {isActive && (
                <div className="absolute top-3 left-3 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
                    LIVE
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Camera Off</p>
                <p className="text-sm">Enable camera to start emotion detection</p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            variant={isWebcamActive ? "default" : "outline"}
            size="sm"
            onClick={handleWebcamToggle}
            className="flex items-center space-x-2"
          >
            {isWebcamActive ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
            <span>{isWebcamActive ? "Disable Camera" : "Enable Camera"}</span>
          </Button>
          
          <Button
            variant={isMicActive ? "default" : "outline"}
            size="sm"
            onClick={toggleMic}
            disabled={!isWebcamActive}
            className="flex items-center space-x-2"
          >
            {isMicActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            <span>{isMicActive ? "Disable Mic" : "Enable Mic"}</span>
          </Button>

          <Button 
            onClick={onToggle}
            disabled={!isWebcamActive}
            className={`flex items-center space-x-2 ${
              isActive 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isActive ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isActive ? "Stop Detection" : "Start Detection"}</span>
          </Button>
        </div>

        {/* Status */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {!isWebcamActive 
              ? "Enable camera to begin emotion analysis" 
              : isActive 
                ? "🤖 AI analyzing your expressions every 5 seconds..." 
                : "Ready to detect emotions - press Start!"
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebcamEmotionDetector;
