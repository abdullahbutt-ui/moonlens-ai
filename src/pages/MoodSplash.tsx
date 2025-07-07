import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Heart, Smile, Frown, Angry, Meh, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { EmotionType } from "@/types/emotion";

const MoodSplash = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<EmotionType | null>(null);
  const [showNext, setShowNext] = useState(false);

  const moodOptions = [
    {
      emotion: "happy" as EmotionType,
      emoji: "😊",
      label: "Happy",
      icon: Smile,
      color: "text-green-500",
      description: "Feeling joyful and positive"
    },
    {
      emotion: "sad" as EmotionType,
      emoji: "😢",
      label: "Sad",
      icon: Frown,
      color: "text-blue-500",
      description: "Feeling down or melancholic"
    },
    {
      emotion: "angry" as EmotionType,
      emoji: "😠",
      label: "Angry",
      icon: Angry,
      color: "text-red-500",
      description: "Feeling frustrated or upset"
    },
    {
      emotion: "calm" as EmotionType,
      emoji: "😌",
      label: "Calm",
      icon: Meh,
      color: "text-purple-500",
      description: "Feeling peaceful and centered"
    }
  ];

  const handleMoodSelect = (emotion: EmotionType) => {
    setSelectedMood(emotion);
    setShowNext(true);
  };

  const handleContinue = () => {
    // Store selected mood for onboarding
    if (selectedMood) {
      localStorage.setItem('initialMood', selectedMood);
    }
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-teal-100 dark:from-purple-900 dark:via-blue-900 dark:to-teal-900 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Brain className="h-12 w-12 text-purple-600 dark:text-purple-400 mr-2" />
            <Heart className="h-10 w-10 text-pink-500 dark:text-pink-400" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Welcome to Moodsify
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            How are you feeling right now?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {moodOptions.map((mood) => (
            <motion.div key={mood.emotion} whileTap={{ scale: 0.95 }}>
              <Card 
                onClick={() => handleMoodSelect(mood.emotion)}
                className={`cursor-pointer transition-all duration-300 p-6 text-center hover:shadow-lg ${
                  selectedMood === mood.emotion 
                    ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <div className="text-4xl mb-2">{mood.emoji}</div>
                <div className="font-semibold text-gray-900 dark:text-white mb-1">
                  {mood.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {mood.description}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {showNext && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Button 
              onClick={handleContinue}
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MoodSplash;