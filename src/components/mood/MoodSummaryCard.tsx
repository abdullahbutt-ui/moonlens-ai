import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Share2, Download, Sparkles, Calendar, Award, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface MoodData {
  week: string;
  dominantMood: string;
  moodDistribution: Record<string, number>;
  challengesCompleted: number;
  streakCount: number;
}

interface MoodSummaryCardProps {
  moodData: MoodData;
  isPremium?: boolean;
  onUpgradeClick?: () => void;
  className?: string;
}

const MoodSummaryCard = ({ 
  moodData, 
  isPremium = false, 
  onUpgradeClick,
  className 
}: MoodSummaryCardProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCard = async () => {
    if (!isPremium) {
      onUpgradeClick?.();
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate card generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('✨ Mood card generated! Ready to share.');
    } catch (error) {
      toast.error('Failed to generate mood card');
    } finally {
      setIsGenerating(false);
    }
  };

  const shareCard = async () => {
    if (!isPremium) {
      onUpgradeClick?.();
      return;
    }

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Weekly Mood Summary',
          text: `This week I was mostly ${moodData.dominantMood} and completed ${moodData.challengesCompleted} wellness challenges!`,
          url: window.location.href
        });
      } else {
        // Fallback: copy to clipboard
        const shareText = `My Weekly Mood Summary 🌟\n\nDominant mood: ${moodData.dominantMood}\nChallenges completed: ${moodData.challengesCompleted}\nStreak: ${moodData.streakCount} days\n\nTrack your mental wellness with Moodsify! ✨`;
        await navigator.clipboard.writeText(shareText);
        toast.success('Mood summary copied to clipboard!');
      }
    } catch (error) {
      toast.error('Failed to share mood card');
    }
  };

  const getMoodEmoji = (mood: string) => {
    const emojis: Record<string, string> = {
      happy: '😊',
      sad: '😢',
      anxious: '😰',
      angry: '😠',
      excited: '🤩',
      calm: '😌',
      neutral: '😐',
      grateful: '🙏',
      stressed: '😅'
    };
    return emojis[mood.toLowerCase()] || '😐';
  };

  const getMoodColor = (mood: string) => {
    const colors: Record<string, string> = {
      happy: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      sad: 'bg-blue-100 text-blue-800 border-blue-200',
      anxious: 'bg-red-100 text-red-800 border-red-200',
      angry: 'bg-red-100 text-red-800 border-red-200',
      excited: 'bg-orange-100 text-orange-800 border-orange-200',
      calm: 'bg-green-100 text-green-800 border-green-200',
      neutral: 'bg-gray-100 text-gray-800 border-gray-200',
      grateful: 'bg-purple-100 text-purple-800 border-purple-200',
      stressed: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[mood.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (!isPremium) {
    return (
      <Card className={`bg-gradient-to-br from-pink-50/80 to-rose-50/80 dark:from-pink-900/20 dark:to-rose-900/20 border-pink-200/50 dark:border-pink-500/30 ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pink-800 dark:text-pink-200">
            <Share2 className="w-5 h-5" />
            Shareable Mood Card
            <Lock className="w-4 h-4 ml-auto" />
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="text-4xl mb-4">🎨✨</div>
          <h3 className="text-lg font-semibold mb-2">Premium Feature</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create beautiful, shareable mood summary cards to celebrate your wellness journey.
          </p>
          <Button onClick={onUpgradeClick} className="bg-pink-600 hover:bg-pink-700 text-white">
            Unlock Mood Cards
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-gradient-to-br from-pink-50/80 to-rose-50/80 dark:from-pink-900/20 dark:to-rose-900/20 border-pink-200/50 dark:border-pink-500/30 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-pink-800 dark:text-pink-200">
          <Share2 className="w-5 h-5" />
          Weekly Mood Summary
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Mood Card Preview */}
        <motion.div 
          className="p-6 bg-gradient-to-br from-white to-pink-50 dark:from-gray-800 dark:to-pink-900/20 rounded-xl border border-pink-200 dark:border-pink-500/30"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-center space-y-4">
            {/* Header */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-pink-600" />
              <span className="text-sm font-medium text-pink-700 dark:text-pink-300">
                {moodData.week}
              </span>
            </div>

            {/* Dominant Mood */}
            <div className="space-y-2">
              <div className="text-4xl">{getMoodEmoji(moodData.dominantMood)}</div>
              <Badge className={getMoodColor(moodData.dominantMood)}>
                Mostly {moodData.dominantMood}
              </Badge>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-3 bg-pink-100/50 dark:bg-pink-900/20 rounded-lg">
                <Award className="w-5 h-5 mx-auto mb-1 text-pink-600" />
                <div className="text-lg font-bold text-pink-700 dark:text-pink-300">
                  {moodData.challengesCompleted}
                </div>
                <div className="text-xs text-pink-600 dark:text-pink-400">
                  Challenges
                </div>
              </div>
              
              <div className="text-center p-3 bg-orange-100/50 dark:bg-orange-900/20 rounded-lg">
                <Sparkles className="w-5 h-5 mx-auto mb-1 text-orange-600" />
                <div className="text-lg font-bold text-orange-700 dark:text-orange-300">
                  {moodData.streakCount}
                </div>
                <div className="text-xs text-orange-600 dark:text-orange-400">
                  Day Streak
                </div>
              </div>
            </div>

            {/* Mood Distribution */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Weekly Mood Mix:
              </div>
              <div className="flex flex-wrap justify-center gap-1">
                {Object.entries(moodData.moodDistribution).map(([mood, count]) => (
                  <div 
                    key={mood}
                    className="flex items-center gap-1 px-2 py-1 bg-white/70 dark:bg-black/20 rounded-full text-xs"
                  >
                    <span>{getMoodEmoji(mood)}</span>
                    <span className="text-gray-600 dark:text-gray-400">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-pink-200 dark:border-pink-500/30">
              ✨ Created with Moodsify
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={generateCard}
            disabled={isGenerating}
            className="flex-1 bg-pink-600 hover:bg-pink-700 text-white"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Generate Card
              </>
            )}
          </Button>
          
          <Button 
            onClick={shareCard}
            variant="outline"
            className="border-pink-200 dark:border-pink-500/50 text-pink-700 dark:text-pink-300"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          💡 Share your wellness journey and inspire others!
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodSummaryCard;