
import { EmotionType, EmotionData } from '@/types/emotion';

export const emotionColors: Record<EmotionType, string> = {
  happy: '#10B981',
  sad: '#3B82F6',
  angry: '#EF4444',
  surprised: '#F59E0B',
  fearful: '#8B5CF6',
  disgusted: '#84CC16',
  neutral: '#6B7280',
  excited: '#F97316',
  calm: '#06B6D4',
  anxious: '#EF4444'
};

export const emotionEmojis: Record<EmotionType, string> = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  surprised: '😲',
  fearful: '😨',
  disgusted: '🤢',
  neutral: '😐',
  excited: '🤩',
  calm: '😌',
  anxious: '😰'
};

// Mock data generator for development
export const generateMockEmotionData = (count: number = 50): EmotionData[] => {
  const emotions: EmotionType[] = ['happy', 'sad', 'angry', 'surprised', 'fearful', 'disgusted', 'neutral', 'excited', 'calm', 'anxious'];
  const sources: ('webcam' | 'microphone' | 'combined')[] = ['webcam', 'microphone', 'combined'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `mock-${i}`,
    userId: 'current-user',
    emotion: emotions[Math.floor(Math.random() * emotions.length)],
    confidence: Math.random() * 0.4 + 0.6, // 60-100% confidence
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Last 7 days
    source: sources[Math.floor(Math.random() * sources.length)]
  }));
};
