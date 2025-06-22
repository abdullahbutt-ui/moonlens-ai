
export interface JournalEntry {
  id: string;
  userId: string;
  content: string;
  voiceMemoUrl?: string;
  emotionTags: string[];
  aiGeneratedTags: string[];
  mood: 'happy' | 'sad' | 'anxious' | 'excited' | 'calm' | 'frustrated' | 'grateful' | 'neutral';
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyChallenge {
  id: string;
  userId: string;
  challengeText: string;
  response?: string;
  completed: boolean;
  completedAt?: Date;
  date: string; // YYYY-MM-DD format
}

export interface MoodTrend {
  date: string;
  dominantMood: string;
  moodCounts: Record<string, number>;
  averageConfidence: number;
  journalEntries: number;
  challengeCompleted: boolean;
}
