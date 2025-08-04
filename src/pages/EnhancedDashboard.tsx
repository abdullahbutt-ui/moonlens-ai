import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import CurrentMood from '@/components/dashboard/CurrentMood';
import DailyCheckIn from '@/components/dashboard/DailyCheckIn';
import AIMoodAssistant from '@/components/dashboard/AIMoodAssistant';
import EnhancedDailyChallenge from '@/components/dashboard/EnhancedDailyChallenge';
import AchievementsPanel from '@/components/achievements/AchievementsPanel';
import MoodSummaryCard from '@/components/mood/MoodSummaryCard';
import PrivateModeToggle from '@/components/privacy/PrivateModeToggle';
import PremiumModal from '@/components/premium/PremiumModal';
import { EmotionType } from '@/types/emotion';
import { SparklesCore } from '@/components/ui/sparkles';
import { Button } from '@/components/ui/button';
import { Crown, TrendingUp, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const EnhancedDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentEmotion, setCurrentEmotion] = useState<EmotionType>('neutral');
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [totalChallenges, setTotalChallenges] = useState(0);
  const [weeklyMoodData, setWeeklyMoodData] = useState({
    week: 'This Week',
    dominantMood: 'happy',
    moodDistribution: { happy: 3, calm: 2, excited: 1, neutral: 1 },
    challengesCompleted: 5,
    streakCount: 7
  });

  useEffect(() => {
    if (user) {
      checkUserSubscription();
      loadUserStats();
    }
  }, [user]);

  const checkUserSubscription = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('user_preferences')
        .select('subscription_status, subscription_end_date')
        .eq('user_id', user.id)
        .single();

      if (data) {
        const isActive = data.subscription_status === 'premium' && 
          (!data.subscription_end_date || new Date(data.subscription_end_date) > new Date());
        setIsPremium(isActive);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const loadUserStats = async () => {
    if (!user) return;

    try {
      // Load streak and challenge count
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('streak_count')
        .eq('user_id', user.id)
        .single();

      if (preferences) {
        setStreakCount(preferences.streak_count || 0);
      }

      // Load total completed challenges
      const { data: challenges } = await supabase
        .from('daily_challenges')
        .select('id')
        .eq('user_id', user.id)
        .eq('completed', true);

      setTotalChallenges(challenges?.length || 0);

      // Check if user has checked in today
      const today = new Date().toISOString().split('T')[0];
      const { data: todayCheckIn } = await supabase
        .from('daily_checkins')
        .select('id')
        .eq('user_id', user.id)
        .eq('check_in_date', today)
        .single();

      setHasCheckedInToday(!!todayCheckIn);
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleDailyCheckIn = async (mood: EmotionType) => {
    setCurrentEmotion(mood);
    setHasCheckedInToday(true);
    
    if (user) {
      try {
        const today = new Date().toISOString().split('T')[0];
        await supabase
          .from('daily_checkins')
          .upsert({
            user_id: user.id,
            mood: mood,
            check_in_date: today
          });
        
        // Update mood analytics
        await supabase
          .rpc('update_mood_analytics', {
            user_uuid: user.id,
            mood_type: mood
          });

        toast.success('Daily check-in completed! 🌟');
      } catch (error) {
        console.error('Error saving check-in:', error);
        toast.error('Failed to save check-in');
      }
    }
  };

  const handleUpgrade = async () => {
    try {
      // Simulate subscription upgrade
      toast.success('🚀 Redirecting to upgrade...');
      
      // In a real app, this would integrate with Stripe
      setTimeout(() => {
        setIsPremium(true);
        setShowPremiumModal(false);
        toast.success('✨ Welcome to Premium! All features unlocked.');
      }, 2000);
    } catch (error) {
      toast.error('Failed to upgrade. Please try again.');
    }
  };

  const handleChallengeComplete = (newStreak: number) => {
    setStreakCount(newStreak);
    setTotalChallenges(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black relative">
      {/* Background sparkles effect */}
      <div className="absolute inset-0 w-full h-full dark:block hidden">
        <SparklesCore 
          id="enhanced-dashboard-sparkles" 
          background="transparent" 
          minSize={0.4} 
          maxSize={0.8} 
          particleDensity={50} 
          className="w-full h-full" 
          particleColor="#8b5cf6" 
          speed={0.3} 
        />
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-20 md:pb-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-center sm:text-left w-full sm:w-auto">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Mental Wellness Hub ✨
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
                Your personalized space for mindful growth and self-care
              </p>
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center gap-3">
              {!isPremium && (
                <Button 
                  onClick={() => setShowPremiumModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade
                </Button>
              )}
              
              <Button 
                onClick={() => navigate('/mood-trends')}
                variant="outline"
                className="border-purple-200 dark:border-purple-500/50"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              
              <Button 
                onClick={() => navigate('/settings')}
                variant="ghost"
                size="sm"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Main content grid */}
          <div className="space-y-6 sm:space-y-8">
            {/* Daily Check-in Row */}
            {!hasCheckedInToday ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2">
                  <DailyCheckIn onCheckIn={handleDailyCheckIn} />
                </div>
                <div className="lg:col-span-1">
                  <PrivateModeToggle />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="lg:col-span-1">
                  <CurrentMood emotion={currentEmotion} confidence={0.85} isDetecting={false} />
                </div>
                <div className="lg:col-span-2">
                  <AchievementsPanel 
                    streakCount={streakCount} 
                    totalChallenges={totalChallenges} 
                  />
                </div>
                <div className="lg:col-span-1">
                  <PrivateModeToggle />
                </div>
              </div>
            )}

            {/* AI Coach and Daily Challenge Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <AIMoodAssistant 
                  currentMood={currentEmotion}
                  isPremium={isPremium}
                  onUpgradeClick={() => setShowPremiumModal(true)}
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <EnhancedDailyChallenge 
                  currentMood={currentEmotion}
                  isPremium={isPremium}
                  onUpgradeClick={() => setShowPremiumModal(true)}
                  onChallengeComplete={handleChallengeComplete}
                />
              </motion.div>
            </div>

            {/* Mood Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-md mx-auto"
            >
              <MoodSummaryCard 
                moodData={weeklyMoodData}
                isPremium={isPremium}
                onUpgradeClick={() => setShowPremiumModal(true)}
              />
            </motion.div>
          </div>
        </main>
      </div>

      {/* Premium Modal */}
      <PremiumModal 
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
};

export default EnhancedDashboard;