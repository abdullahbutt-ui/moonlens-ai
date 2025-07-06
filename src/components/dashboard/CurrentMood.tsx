
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmotionType } from "@/types/emotion";
import { emotionColors, emotionEmojis } from "@/utils/emotionData";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface CurrentMoodProps {
  emotion: EmotionType;
  confidence: number;
  isDetecting: boolean;
}

const CurrentMood = ({ emotion, confidence, isDetecting }: CurrentMoodProps) => {
  const getMoodGradient = (emotion: EmotionType) => {
    const gradients = {
      happy: 'from-yellow-400 via-orange-400 to-pink-400',
      sad: 'from-blue-400 via-indigo-400 to-purple-400', 
      anxious: 'from-red-400 via-pink-400 to-purple-400',
      excited: 'from-green-400 via-teal-400 to-blue-400',
      calm: 'from-emerald-400 via-teal-400 to-cyan-400',
      angry: 'from-red-500 via-pink-500 to-rose-500',
      neutral: 'from-gray-400 via-slate-400 to-zinc-400'
    };
    return gradients[emotion] || gradients.neutral;
  };

  const getMoodMessage = (emotion: EmotionType) => {
    const messages = {
      happy: "You're radiating positive vibes! ✨",
      sad: "It's okay to feel this way 💙",
      anxious: "Take a deep breath, you've got this 🌸",
      excited: "Your energy is contagious! ⚡",
      calm: "You're in your zen zone 🧘‍♀️",
      angry: "Let's channel this energy positively 🔥",
      neutral: "You're in a balanced space 🌱"
    };
    return messages[emotion] || "How are you feeling today?";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border-0 shadow-xl rounded-3xl">
        {/* Animated background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getMoodGradient(emotion)} opacity-10`} />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        <CardHeader className="relative z-10 text-center pb-2">
          <CardTitle className="flex items-center justify-center gap-2 text-gray-800 dark:text-white text-lg">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Current Vibe
            <div className={`w-2 h-2 rounded-full ml-2 ${
              isDetecting ? 'bg-green-400 animate-pulse shadow-lg shadow-green-400/50' : 'bg-gray-400'
            }`} />
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center relative z-10 pb-8">
          <motion.div 
            className="mb-6"
            animate={{ 
              scale: isDetecting ? [1, 1.05, 1] : 1,
              rotate: [0, 2, -2, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: isDetecting ? Infinity : 0 
            }}
          >
            <div className="text-7xl mb-3 filter drop-shadow-lg">
              {emotionEmojis[emotion]}
            </div>
            
            <motion.h3 
              className="text-2xl font-bold capitalize mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {emotion}
            </motion.h3>
            
            <motion.p 
              className="text-gray-600 dark:text-gray-400 text-sm mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {getMoodMessage(emotion)}
            </motion.p>
          </motion.div>
          
          {/* Confidence meter with improved design */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Confidence</span>
              <span className="font-semibold">{Math.round(confidence * 100)}%</span>
            </div>
            
            <div className="relative">
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full bg-gradient-to-r ${getMoodGradient(emotion)} rounded-full shadow-lg`}
                  initial={{ width: 0 }}
                  animate={{ width: `${confidence * 100}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                />
              </div>
              
              {/* Confidence level indicators */}
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          </div>
          
          <motion.p 
            className="text-xs text-gray-500 dark:text-gray-400 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {isDetecting ? "✨ Analyzing your energy..." : "💫 Tap to update your mood"}
          </motion.p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CurrentMood;
