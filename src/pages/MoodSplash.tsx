import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Smile, Frown, Angry, Meh, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EmotionType } from "@/types/emotion";

const MoodSplash = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<EmotionType | null>(null);

  const moodOptions = [
    { emoji: "😊", label: "happy", icon: Smile, name: "Happy" },
    { emoji: "😢", label: "sad", icon: Frown, name: "Sad" },
    { emoji: "😠", label: "angry", icon: Angry, name: "Angry" },
    { emoji: "😌", label: "neutral", icon: Meh, name: "Calm" },
    { emoji: "😟", label: "anxious", icon: Zap, name: "Anxious" }
  ];

  const moodThemes = {
    happy: {
      background: "bg-gradient-to-br from-yellow-200 via-orange-200 to-pink-200 dark:from-yellow-800 dark:via-orange-800 dark:to-pink-800",
      accent: "text-yellow-600 dark:text-yellow-400",
      greeting: "Wonderful to see your bright energy today! ✨",
    },
    sad: {
      background: "bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 dark:from-blue-800 dark:via-indigo-800 dark:to-purple-800",
      accent: "text-blue-600 dark:text-blue-400",
      greeting: "Let's take gentle care of your feelings today. 💙",
    },
    angry: {
      background: "bg-gradient-to-br from-red-200 via-orange-200 to-yellow-200 dark:from-red-800 dark:via-orange-800 dark:to-yellow-800",
      accent: "text-red-600 dark:text-red-400",
      greeting: "Let's work through these intense feelings together. 🌊",
    },
    neutral: {
      background: "bg-gradient-to-br from-teal-200 via-purple-200 to-indigo-200 dark:from-teal-800 dark:via-purple-800 dark:to-indigo-800",
      accent: "text-teal-600 dark:text-teal-400",
      greeting: "Perfect balance. Let's maintain this peaceful energy. 🧘‍♀️",
    },
    anxious: {
      background: "bg-gradient-to-br from-gray-200 via-green-200 to-teal-200 dark:from-gray-800 dark:via-green-800 dark:to-teal-800",
      accent: "text-green-600 dark:text-green-400",
      greeting: "Take a deep breath. You're safe and supported. 🌸",
    },
    fearful: {
      background: "bg-gradient-to-br from-gray-200 via-green-200 to-teal-200 dark:from-gray-800 dark:via-green-800 dark:to-teal-800",
      accent: "text-green-600 dark:text-green-400",
      greeting: "Take a deep breath. You're safe and supported. 🌸",
    },
    surprised: {
      background: "bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200 dark:from-purple-800 dark:via-pink-800 dark:to-blue-800",
      accent: "text-purple-600 dark:text-purple-400",
      greeting: "What an interesting moment! Let's explore this feeling. ✨",
    },
    disgusted: {
      background: "bg-gradient-to-br from-green-200 via-yellow-200 to-orange-200 dark:from-green-800 dark:via-yellow-800 dark:to-orange-800",
      accent: "text-green-600 dark:text-green-400",
      greeting: "Let's work through these challenging feelings. 🌱",
    },
    excited: {
      background: "bg-gradient-to-br from-yellow-200 via-orange-200 to-pink-200 dark:from-yellow-800 dark:via-orange-800 dark:to-pink-800",
      accent: "text-orange-600 dark:text-orange-400",
      greeting: "Your excitement is contagious! Let's channel this energy. 🎉",
    },
    calm: {
      background: "bg-gradient-to-br from-teal-200 via-purple-200 to-indigo-200 dark:from-teal-800 dark:via-purple-800 dark:to-indigo-800",
      accent: "text-teal-600 dark:text-teal-400",
      greeting: "Beautiful calm energy. Let's nurture this peace. 🕯️",
    }
  };

  const handleMoodSelect = (mood: EmotionType) => {
    setSelectedMood(mood);

    // Auto-transition after 3.5 seconds
    setTimeout(() => {
      const isAuthenticated = localStorage.getItem('mockAuth') === 'true';
      if (isAuthenticated) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    }, 3500);
  };

  const currentTheme = selectedMood ? moodThemes[selectedMood] : null;

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-1000 ${
      currentTheme ? currentTheme.background : 'bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 dark:from-purple-900 dark:via-pink-900 dark:to-indigo-900'
    }`}>
      
      {/* Floating Animation Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {selectedMood && (
          <>
            <motion.div 
              className={`absolute top-20 left-20 w-16 h-16 rounded-full blur-xl opacity-30 ${
                selectedMood === 'happy' || selectedMood === 'excited' ? 'bg-yellow-400' : 
                selectedMood === 'sad' ? 'bg-blue-400' : 
                selectedMood === 'angry' ? 'bg-red-400' : 
                selectedMood === 'neutral' || selectedMood === 'calm' ? 'bg-teal-400' : 
                'bg-green-400'
              }`}
              animate={{ y: [0, 30, 0], x: [0, 20, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className={`absolute bottom-32 right-32 w-24 h-24 rounded-full blur-xl opacity-20 ${
                selectedMood === 'happy' || selectedMood === 'excited' ? 'bg-orange-400' : 
                selectedMood === 'sad' ? 'bg-indigo-400' : 
                selectedMood === 'angry' ? 'bg-orange-400' : 
                selectedMood === 'neutral' || selectedMood === 'calm' ? 'bg-purple-400' : 
                'bg-teal-400'
              }`}
              animate={{ y: [0, -20, 0], x: [0, -15, 0], rotate: [0, 180, 360] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        
        <AnimatePresence mode="wait">
          {!selectedMood ? (
            // Mood Selection Phase
            <motion.div
              key="mood-selection"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-md"
            >
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 1 }}
                className="text-4xl md:text-5xl font-bold gradient-text mb-6"
              >
                Moodsify
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-xl text-gray-700 dark:text-gray-300 mb-8"
              >
                How are you feeling right now?
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="grid grid-cols-3 gap-4 max-w-xs mx-auto"
              >
                {moodOptions.map((mood, index) => (
                  <motion.button
                    key={mood.label}
                    onClick={() => handleMoodSelect(mood.label as EmotionType)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 + index * 0.1, duration: 0.5 }}
                    className="p-4 glass rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <span className="text-4xl block mb-2">{mood.emoji}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {mood.name}
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            // Greeting Phase
            <motion.div
              key="greeting"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 1, type: "spring" }}
              className="text-center max-w-lg"
            >
              <motion.div 
                className="text-8xl mb-6 inline-block animate-bounce-soft"
              >
                {moodOptions.find(m => m.label === selectedMood)?.emoji}
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className={`text-3xl md:text-4xl font-bold mb-4 ${currentTheme?.accent}`}
              >
                {moodOptions.find(m => m.label === selectedMood)?.name}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
              >
                {currentTheme?.greeting}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="mt-8"
              >
                <div className="flex justify-center space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`w-2 h-2 rounded-full ${currentTheme?.accent.replace('text-', 'bg-')}`}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Preparing your experience...
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MoodSplash;
