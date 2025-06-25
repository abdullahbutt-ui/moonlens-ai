
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Mail, TrendingUp, Brain, Users, Headphones, Wind, Zap } from 'lucide-react';
import AIMoodCoach from './AIMoodCoach';
import SoundCenter from './SoundCenter';
import BreathingExercise from './BreathingExercise';
import { EmotionType } from '@/types/emotion';

interface ScrollFadeFeaturesProps {
  currentMood: EmotionType;
}

const ScrollFadeFeatures = ({ currentMood }: ScrollFadeFeaturesProps) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-in-out ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
    } md:hidden`}>
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl p-3 shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 overflow-x-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/live-emotion-detection')}
            className="flex-shrink-0 flex items-center gap-1 text-xs"
          >
            <Zap className="w-4 h-4" />
            Detection
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/mood-journal')}
            className="flex-shrink-0 flex items-center gap-1 text-xs"
          >
            <Brain className="w-4 h-4" />
            Journal
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/future-self-letter')}
            className="flex-shrink-0 flex items-center gap-1 text-xs"
          >
            <Mail className="w-4 h-4" />
            Letter
          </Button>
          
          <AIMoodCoach currentMood={currentMood} recentMoods={[currentMood]} />
          <SoundCenter currentMood={currentMood} />
          <BreathingExercise />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/mood-trends')}
            className="flex-shrink-0 flex items-center gap-1 text-xs"
          >
            <TrendingUp className="w-4 h-4" />
            Trends
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/mood-wall')}
            className="flex-shrink-0 flex items-center gap-1 text-xs"
          >
            <Users className="w-4 h-4" />
            Community
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/settings')}
            className="flex-shrink-0 flex items-center gap-1 text-xs"
          >
            ⚙️
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/profile')}
            className="flex-shrink-0 flex items-center gap-1 text-xs"
          >
            👤
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScrollFadeFeatures;
