import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Heart, Smile, Frown, Angry, Meh } from "lucide-react";
import { motion } from "framer-motion";
const Landing = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showMoodFeedback, setShowMoodFeedback] = useState(false);
  const moodOptions = [{
    emoji: "😊",
    label: "Happy",
    icon: Smile,
    color: "text-green-500"
  }, {
    emoji: "😢",
    label: "Sad",
    icon: Frown,
    color: "text-blue-500"
  }, {
    emoji: "😠",
    label: "Angry",
    icon: Angry,
    color: "text-red-500"
  }, {
    emoji: "😌",
    label: "Calm",
    icon: Meh,
    color: "text-purple-500"
  }];
  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setShowMoodFeedback(true);
    setTimeout(() => setShowMoodFeedback(false), 3000);
  };
  const handleGetStarted = () => {
    navigate('/mood-splash');
  };
  const handleLogin = () => {
    navigate('/login');
  };
  return <div className="min-h-screen relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-blue-50 to-teal-100 dark:from-purple-900 dark:via-blue-900 dark:to-teal-900">
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent dark:from-black/20" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div className="absolute top-20 left-20 w-32 h-32 bg-purple-200/30 dark:bg-purple-500/20 rounded-full blur-xl" animate={{
        y: [0, 20, 0],
        x: [0, 10, 0]
      }} transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }} />
        <motion.div className="absolute top-40 right-32 w-24 h-24 bg-blue-200/30 dark:bg-blue-500/20 rounded-full blur-xl" animate={{
        y: [0, -15, 0],
        x: [0, -10, 0]
      }} transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }} />
        <motion.div className="absolute bottom-32 left-32 w-40 h-40 bg-teal-200/30 dark:bg-teal-500/20 rounded-full blur-xl" animate={{
        y: [0, 25, 0],
        x: [0, 15, 0]
      }} transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        
        {/* Animated Logo */}
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 1,
        ease: "easeOut"
      }} className="mb-8">
          <div className="flex items-center justify-center mb-6">
            <motion.div animate={{
            rotate: [0, 5, -5, 0]
          }} transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}>
              <Brain className="h-20 w-20 text-purple-600 dark:text-purple-400 mr-4" />
            </motion.div>
            <motion.div animate={{
            scale: [1, 1.05, 1]
          }} transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}>
              <Heart className="h-16 w-16 text-pink-500 dark:text-pink-400" />
            </motion.div>
          </div>
          
          <motion.h1 initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.5,
          duration: 2
        }} className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent mb-4">Moodsify</motion.h1>
        </motion.div>

        {/* Tagline */}
        <motion.p initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 1,
        duration: 1
      }} className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-2xl leading-relaxed">
          Understand your emotions. One glance, one breath at a time.
        </motion.p>

        {/* Call to Action Buttons */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 1.5,
        duration: 1
      }} className="flex flex-col sm:flex-row gap-4 mb-12">
          <Button onClick={handleGetStarted} size="lg" className="px-8 py-4 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            Get Started
          </Button>
          <Button onClick={handleLogin} variant="outline" size="lg" className="px-8 py-4 text-lg border-purple-300 dark:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transform hover:scale-105 transition-all duration-300">
            Log In
          </Button>
        </motion.div>

        {/* Mood Selector */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 2,
        duration: 1
      }} className="max-w-md">
          <p className="text-gray-600 dark:text-gray-400 mb-4">How are you feeling today?</p>
          <div className="flex justify-center gap-4">
            {moodOptions.map(mood => <motion.button key={mood.label} onClick={() => handleMoodSelect(mood.label)} whileHover={{
            scale: 1.1
          }} whileTap={{
            scale: 0.95
          }} className={`p-4 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg hover:shadow-xl transition-all duration-300 ${selectedMood === mood.label ? 'ring-2 ring-purple-500' : ''}`}>
                <span className="text-3xl">{mood.emoji}</span>
              </motion.button>)}
          </div>

          {/* Mood Feedback */}
          {showMoodFeedback && selectedMood && <motion.div initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0
        }} className="mt-4">
              <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <p className="text-green-700 dark:text-green-300">
                  Thanks for sharing — we'll keep that in mind today.
                </p>
              </Card>
            </motion.div>}
        </motion.div>
      </div>
    </div>;
};
export default Landing;