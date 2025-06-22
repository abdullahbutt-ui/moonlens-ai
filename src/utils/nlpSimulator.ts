
// Simulated NLP for emotion tagging
export const analyzeEmotionFromText = (text: string): string[] => {
  const emotionKeywords = {
    happy: ['happy', 'joy', 'excited', 'great', 'amazing', 'wonderful', 'smile', 'laugh', 'love', 'good'],
    sad: ['sad', 'down', 'upset', 'cry', 'tears', 'lonely', 'hurt', 'disappointed', 'blue'],
    anxious: ['anxious', 'worried', 'nervous', 'stress', 'panic', 'overwhelmed', 'tense', 'fear'],
    angry: ['angry', 'mad', 'frustrated', 'annoyed', 'rage', 'furious', 'irritated'],
    grateful: ['grateful', 'thankful', 'blessed', 'appreciate', 'lucky', 'fortunate'],
    calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'zen', 'mindful'],
    excited: ['excited', 'thrilled', 'pumped', 'energetic', 'enthusiastic', 'eager']
  };
  
  const detectedEmotions: string[] = [];
  const lowercaseText = text.toLowerCase();
  
  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    if (keywords.some(keyword => lowercaseText.includes(keyword))) {
      detectedEmotions.push(emotion);
    }
  });
  
  return detectedEmotions.length > 0 ? detectedEmotions : ['neutral'];
};

export const generateAIFeedback = (emotionTags: string[], content: string): string => {
  const feedbackTemplates = {
    happy: [
      "It's wonderful to see you in high spirits! ✨",
      "Your positive energy is shining through! 🌟",
      "Keep nurturing these joyful moments. 😊"
    ],
    sad: [
      "I hear you, and it's okay to feel this way. 💙",
      "Remember, every emotion has its place in your journey. 🤗",
      "Tomorrow is a new day with new possibilities. 🌅"
    ],
    anxious: [
      "Take a deep breath. You're stronger than you know. 🌸",
      "Anxiety is temporary, but your resilience is permanent. 💜",
      "Consider some grounding techniques - you've got this. 🍃"
    ],
    grateful: [
      "Gratitude is a beautiful practice that enriches the soul. 🙏",
      "Your appreciation for life's moments is truly inspiring. ✨",
      "Keep cultivating this grateful heart. 💖"
    ]
  };
  
  const primaryEmotion = emotionTags[0] || 'neutral';
  const templates = feedbackTemplates[primaryEmotion as keyof typeof feedbackTemplates] || [
    "Thank you for sharing your thoughts with me. 🤍",
    "Your emotional awareness is growing. Keep reflecting. 🌱",
    "Every feeling you have is valid and important. 💫"
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
};
