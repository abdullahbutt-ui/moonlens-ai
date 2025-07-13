
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  TrendingUp, 
  Brain, 
  Users, 
  Settings, 
  User,
  Zap,
  Wind,
  Headphones,
  Bot
} from 'lucide-react';
import AIMoodCoach from './AIMoodCoach';
import SoundCenter from './SoundCenter';
import BreathingExercise from './BreathingExercise';
import { EmotionType } from '@/types/emotion';

interface MobileBottomNavProps {
  currentMood: EmotionType;
}

const MobileBottomNav = ({ currentMood }: MobileBottomNavProps) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : 'translate-y-full'
    }`}>
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 px-2 py-2">
        {/* Main navigation row */}
        <div className="flex items-center justify-around mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/live-emotion-detection')}
            className="flex flex-col items-center gap-1 h-auto py-1 px-2 text-xs"
          >
            <Zap className="w-4 h-4" />
            <span>Detection</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/mood-journal')}
            className="flex flex-col items-center gap-1 h-auto py-1 px-2 text-xs"
          >
            <Brain className="w-4 h-4" />
            <span>Journal</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/mood-trends')}
            className="flex flex-col items-center gap-1 h-auto py-1 px-2 text-xs"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Trends</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/mood-wall')}
            className="flex flex-col items-center gap-1 h-auto py-1 px-2 text-xs"
          >
            <Users className="w-4 h-4" />
            <span>Community</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/profile')}
            className="flex flex-col items-center gap-1 h-auto py-1 px-2 text-xs"
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </Button>
        </div>

        {/* Secondary features row */}
        <div className="flex items-center justify-around">
          <div className="flex flex-col items-center">
            <AIMoodCoach currentMood={currentMood} recentMoods={[currentMood]} />
            <span className="text-xs text-gray-600 dark:text-gray-400">AI</span>
          </div>
          
          <div className="flex flex-col items-center">
            <SoundCenter currentMood={currentMood} />
            <span className="text-xs text-gray-600 dark:text-gray-400">Sounds</span>
          </div>
          
          <div className="flex flex-col items-center">
            <BreathingExercise />
            <span className="text-xs text-gray-600 dark:text-gray-400">Breathe</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/future-self-letter')}
            className="flex flex-col items-center gap-1 h-auto py-1 px-2 text-xs"
          >
            <Mail className="w-4 h-4" />
            <span>Letter</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/settings')}
            className="flex flex-col items-center gap-1 h-auto py-1 px-2 text-xs"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileBottomNav;
