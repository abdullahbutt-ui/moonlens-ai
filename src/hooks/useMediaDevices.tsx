
import { useState, useRef, useCallback } from 'react';

export const useMediaDevices = () => {
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: isMicActive
      });
      
      setMediaStream(stream);
      setIsWebcamActive(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  }, [isMicActive]);

  const stopWebcam = useCallback(() => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
      setIsWebcamActive(false);
    }
  }, [mediaStream]);

  const toggleMic = useCallback(async () => {
    if (isMicActive && mediaStream) {
      // Stop current stream and restart without audio
      mediaStream.getTracks().forEach(track => track.stop());
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false
      });
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } else if (!isMicActive && isWebcamActive) {
      // Restart stream with audio
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true
      });
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }
    setIsMicActive(!isMicActive);
  }, [isMicActive, isWebcamActive, mediaStream]);

  return {
    isWebcamActive,
    isMicActive,
    mediaStream,
    videoRef,
    startWebcam,
    stopWebcam,
    toggleMic
  };
};
