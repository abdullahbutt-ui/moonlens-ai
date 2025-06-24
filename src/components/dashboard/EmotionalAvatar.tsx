
import { useEffect, useState } from 'react';
import { EmotionType } from '@/types/emotion';
import { emotionColors, emotionEmojis } from '@/utils/emotionData';

interface EmotionalAvatarProps {
  currentEmotion: EmotionType;
  confidence: number;
  className?: string;
}

const EmotionalAvatar = ({ currentEmotion, confidence, className = "" }: EmotionalAvatarProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [previousEmotion, setPreviousEmotion] = useState<EmotionType>(currentEmotion);

  useEffect(() => {
    if (previousEmotion !== currentEmotion) {
      setIsAnimating(true);
      setTimeout(() => {
        setPreviousEmotion(currentEmotion);
        setIsAnimating(false);
      }, 600);
    }
  }, [currentEmotion, previousEmotion]);

  const getAvatarStyle = () => {
    const baseStyle = {
      filter: currentEmotion === 'happy' ? 'brightness(1.2) saturate(1.1)' : 
              currentEmotion === 'sad' ? 'brightness(0.7) saturate(0.8)' :
              currentEmotion === 'angry' ? 'brightness(1.1) saturate(1.3) hue-rotate(15deg)' :
              currentEmotion === 'neutral' ? 'brightness(0.9)' : 'brightness(1)',
      transform: isAnimating ? 'scale(1.1)' : 'scale(1)',
      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
    };
    return baseStyle;
  };

  const getGlowEffect = () => {
    if (currentEmotion === 'happy') return '0 0 20px rgba(16, 185, 129, 0.4)';
    if (currentEmotion === 'sad') return '0 0 15px rgba(59, 130, 246, 0.3)';
    if (currentEmotion === 'angry') return '0 0 18px rgba(239, 68, 68, 0.4)';
    return '0 0 10px rgba(107, 114, 128, 0.2)';
  };

  return (
    <div className={`flex flex-col items-center space-y-3 ${className}`}>
      <div className="relative">
        <div 
          className="w-24 h-24 rounded-full flex items-center justify-center text-4xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/20"
          style={{
            ...getAvatarStyle(),
            boxShadow: getGlowEffect(),
            backgroundColor: `${emotionColors[currentEmotion]}15`
          }}
        >
          {emotionEmojis[currentEmotion]}
          {isAnimating && (
            <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" />
          )}
        </div>
        
        <div 
          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold"
          style={{ 
            backgroundColor: emotionColors[currentEmotion],
            color: 'white'
          }}
        >
          {Math.round(confidence * 100)}
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
          {currentEmotion}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {confidence > 0.8 ? 'Strong signal' : 
           confidence > 0.6 ? 'Clear reading' : 'Subtle feeling'}
        </p>
      </div>
    </div>
  );
};

export default EmotionalAvatar;
