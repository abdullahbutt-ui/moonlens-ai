
import { useState, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import MobileNavigation from "@/components/layout/MobileNavigation";
import MobileDashboardCard from "@/components/dashboard/MobileDashboardCard";
import CurrentMood from "@/components/dashboard/CurrentMood";
import BreathingExercise from "@/components/dashboard/BreathingExercise";
import { EmotionType } from "@/types/emotion";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  Bot, 
  Headphones, 
  Wind, 
  TrendingUp, 
  Brain,
  Zap,
  Users,
  Mail,
  Sparkles,
  User,
  Settings,
  Moon,
  Sun
} from "lucide-react";

const NewDashboard = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [currentEmotion, setCurrentEmotion] = useState<EmotionType>('neutral');

  const features = [
    {
      title: "Mood Trends",
      description: "Track your emotional patterns over time",
      icon: TrendingUp,
      gradient: "bg-gradient-to-br from-pink-400 via-rose-500 to-red-500",
      action: () => navigate('/mood-trends')
    },
    {
      title: "Live Detection",
      description: "Real-time emotion recognition",
      icon: Zap,
      gradient: "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500",
      action: () => navigate('/live-emotion-detection')
    },
    {
      title: "Future Letter",
      description: "Write a message to your future self",
      icon: Mail,
      gradient: "bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-600",
      action: () => navigate('/future-self-letter')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <Navbar />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 px-4 py-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-500" />
                Moodsify
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Your mindful companion ✨
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/settings')}
                className="p-2"
              >
                <Settings className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/profile')}
                className="p-2"
              >
                <User className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-6 pb-24 md:max-w-7xl md:px-8">
        {/* Current Mood Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              How are you feeling?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Let's check in with your emotions
            </p>
          </div>
          <CurrentMood 
            emotion={currentEmotion} 
            confidence={0.8} 
            isDetecting={false} 
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 flex justify-center"
        >
          <BreathingExercise />
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="space-y-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0 lg:grid-cols-3">
          {features.map((feature, index) => (
            <MobileDashboardCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              onClick={feature.action}
              gradient={feature.gradient}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Quick Stats - Mobile Optimized */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            Today's Summary
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">3</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Check-ins</div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Mobile Navigation */}
      <MobileNavigation />
    </div>
  );
};

export default NewDashboard;
