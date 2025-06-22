
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, CameraOff, Mic, MicOff, Play, Square, X } from "lucide-react";
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

  const [isDetecting, setIsDetecting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [detectionResult, setDetectionResult] = useState<{emotion: EmotionType, confidence: number} | null>(null);
  const detectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const processDetection = async () => {
    if (!isWebcamActive || !videoRef.current) return;

    // Simulate MediaPipe processing
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const emotions: EmotionType[] = ['happy', 'neutral', 'sad', 'surprised', 'angry'];
    const weights = [0.4, 0.3, 0.1, 0.1, 0.1];
    
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
    
    const confidence = Math.random() * 0.25 + 0.75;
    return { emotion: selectedEmotion, confidence };
  };

  const startDetection = () => {
    if (!isWebcamActive) return;
    
    setIsDetecting(true);
    setDetectionResult(null);
    setCountdown(5);
    
    // Start countdown
    countdownIntervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Start detection after 5 seconds
    detectionTimeoutRef.current = setTimeout(async () => {
      const result = await processDetection();
      if (result) {
        setDetectionResult(result);
        onEmotionDetected(result.emotion, result.confidence);
        
        // Auto-stop camera after detection
        setTimeout(() => {
          stopWebcam();
          setIsDetecting(false);
          if (isActive) onToggle();
        }, 3000);
      }
    }, 5000);
  };

  const cancelDetection = () => {
    setIsDetecting(false);
    setCountdown(0);
    setDetectionResult(null);
    
    if (detectionTimeoutRef.current) {
      clearTimeout(detectionTimeoutRef.current);
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
  };

  const handleWebcamToggle = () => {
    if (isWebcamActive) {
      stopWebcam();
      cancelDetection();
    } else {
      startWebcam();
    }
  };

  const handleStartDetection = () => {
    if (isDetecting) {
      cancelDetection();
    } else {
      startDetection();
      if (!isActive) onToggle();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (detectionTimeoutRef.current) {
        clearTimeout(detectionTimeoutRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  return (
    <Card className="overflow-hidden bg-white dark:bg-black/50 border-gray-200 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-gray-900 dark:text-white">
          <span>Live Emotion Detection</span>
          <div className="flex items-center space-x-2">
            {isDetecting && countdown > 0 && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  Detecting in {countdown}s...
                </span>
              </div>
            )}
            {isActive && isWebcamActive && !isDetecting && (
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden relative">
          {isWebcamActive ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover rounded-lg"
              />
              
              {/* Detection Overlay */}
              {isDetecting && countdown > 0 && (
                <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-lg font-semibold">
                    {countdown}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cancelDetection}
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              
              {/* Result Display */}
              {detectionResult && (
                <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center animate-fade-in">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl text-center border">
                    <div className="text-4xl mb-2">
                      {detectionResult.emotion === 'happy' && '😊'}
                      {detectionResult.emotion === 'sad' && '😢'}
                      {detectionResult.emotion === 'angry' && '😠'}
                      {detectionResult.emotion === 'surprised' && '😲'}
                      {detectionResult.emotion === 'neutral' && '😐'}
                    </div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                      {detectionResult.emotion}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {Math.round(detectionResult.confidence * 100)}% confidence
                    </div>
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

        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            variant={isWebcamActive ? "default" : "outline"}
            size="sm"
            onClick={handleWebcamToggle}
            className="flex items-center space-x-2"
          >
            {isWebcamActive ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
            <span>{isWebcamActive ?  "Disable Camera" : "Enable Camera"}</span>
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
            onClick={handleStartDetection}
            disabled={!isWebcamActive}
            className={`flex items-center space-x-2 ${
              isDetecting 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isDetecting ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isDetecting ? "Cancel Detection" : "Start 5s Detection"}</span>
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {!isWebcamActive 
              ? "Enable camera to begin emotion analysis" 
              : isDetecting && countdown > 0
                ? `🤖 AI will analyze your expression in ${countdown} seconds...`
                : detectionResult
                  ? "Detection complete! Camera will stop automatically."
                  : "Ready for 5-second emotion detection!"
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebcamEmotionDetector;
