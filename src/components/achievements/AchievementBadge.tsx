import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Flame, 
  Star, 
  Calendar, 
  Heart, 
  Target, 
  Zap,
  Trophy
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
}

const AchievementBadge = ({ achievement, size = 'md', showProgress = false }: AchievementBadgeProps) => {
  const getIcon = (iconName: string) => {
    const icons = {
      crown: Crown,
      flame: Flame,
      star: Star,
      calendar: Calendar,
      heart: Heart,
      target: Target,
      zap: Zap,
      trophy: Trophy
    };
    return icons[iconName as keyof typeof icons] || Star;
  };

  const Icon = getIcon(achievement.icon);

  const sizeStyles = {
    sm: {
      container: 'w-16 h-16',
      icon: 'w-6 h-6',
      text: 'text-xs'
    },
    md: {
      container: 'w-20 h-20',
      icon: 'w-8 h-8',
      text: 'text-sm'
    },
    lg: {
      container: 'w-24 h-24',
      icon: 'w-10 h-10',
      text: 'text-base'
    }
  };

  const styles = sizeStyles[size];

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center gap-2 cursor-pointer group"
    >
      <div className={`
        ${styles.container} 
        relative rounded-full border-2 transition-all duration-300
        ${achievement.earned 
          ? 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 border-yellow-400 shadow-lg shadow-yellow-500/25' 
          : 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 opacity-60'
        }
        ${achievement.earned ? 'group-hover:shadow-xl group-hover:shadow-yellow-500/40' : ''}
      `}>
        {/* Achievement Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className={`
            ${styles.icon}
            ${achievement.earned ? 'text-white' : 'text-gray-400 dark:text-gray-500'}
          `} />
        </div>

        {/* Progress Ring (if showing progress) */}
        {showProgress && achievement.progress !== undefined && achievement.maxProgress && !achievement.earned && (
          <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-300 dark:text-gray-600"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={`${(achievement.progress / achievement.maxProgress) * 283} 283`}
              className="text-purple-500 transition-all duration-500"
            />
          </svg>
        )}

        {/* Sparkle Effect for Earned Achievements */}
        {achievement.earned && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300"
          >
            ✨
          </motion.div>
        )}
      </div>

      {/* Achievement Details */}
      <div className="text-center max-w-20">
        <div className={`
          font-medium 
          ${styles.text}
          ${achievement.earned 
            ? 'text-gray-900 dark:text-white' 
            : 'text-gray-500 dark:text-gray-400'
          }
        `}>
          {achievement.title}
        </div>
        
        {achievement.earned && achievement.earnedAt && (
          <Badge variant="secondary" className="text-xs mt-1">
            {achievement.earnedAt.toLocaleDateString()}
          </Badge>
        )}

        {showProgress && achievement.progress !== undefined && achievement.maxProgress && !achievement.earned && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {achievement.progress}/{achievement.maxProgress}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AchievementBadge;