import { MoodTrend } from "@/types/journal";

export const dailyChallenges = [
  "Name one thing that made you smile today.",
  "Describe your current mood in one sentence.",
  "What's one small victory you had today?",
  "How did you show kindness to yourself today?",
  "What emotion did you feel most strongly today?",
  "Describe a moment when you felt at peace today.",
  "What's one thing you're grateful for right now?",
  "How would you comfort a friend feeling your current mood?",
  "What color would represent your mood today?",
  "What's one positive thought you can hold onto tonight?"
];

export const getTodaysChallenge = (): string => {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return dailyChallenges[dayOfYear % dailyChallenges.length];
};

export const generateMoodInsight = (trends: MoodTrend[]): string => {
  if (trends.length < 3) return "Keep logging your moods to see personalized insights!";
  
  const moodCounts: Record<string, number> = {};
  const dayOfWeekMoods: Record<string, string[]> = {};
  
  trends.forEach(trend => {
    const date = new Date(trend.date);
    const dayName = date.toLocaleDateString('en', { weekday: 'long' });
    
    if (!dayOfWeekMoods[dayName]) dayOfWeekMoods[dayName] = [];
    dayOfWeekMoods[dayName].push(trend.dominantMood);
    
    moodCounts[trend.dominantMood] = (moodCounts[trend.dominantMood] || 0) + 1;
  });
  
  const mostCommonMood = Object.entries(moodCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0];
  
  const insights = [
    `Your most common mood lately has been ${mostCommonMood}.`,
    `You've been most consistent with mood tracking this week!`,
    `Your emotional awareness is growing stronger each day.`,
    `You've completed ${trends.filter(t => t.challengeCompleted).length} daily challenges recently.`
  ];
  
  return insights[Math.floor(Math.random() * insights.length)];
};
