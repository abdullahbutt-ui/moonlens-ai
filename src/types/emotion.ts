
export interface EmotionData {
  id: string;
  userId: string;
  emotion: EmotionType;
  confidence: number;
  timestamp: Date;
  source: 'webcam' | 'microphone' | 'combined';
}

export type EmotionType = 
  | 'happy' 
  | 'sad' 
  | 'angry' 
  | 'surprised' 
  | 'fearful' 
  | 'disgusted' 
  | 'neutral';

export interface EmotionStats {
  emotion: EmotionType;
  count: number;
  percentage: number;
  averageConfidence: number;
}

export interface DailyEmotionSummary {
  date: string;
  dominantEmotion: EmotionType;
  emotionCounts: Record<EmotionType, number>;
  totalDetections: number;
}
