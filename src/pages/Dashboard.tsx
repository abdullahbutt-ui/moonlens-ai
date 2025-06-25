
import { useState, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import CurrentMood from "@/components/dashboard/CurrentMood";
import DailyCheckIn from "@/components/dashboard/DailyCheckIn";
import EmotionTimeline from "@/components/dashboard/EmotionTimeline";
import WeeklyChallenges from "@/components/dashboard/WeeklyChallenges";
import SmartAudioSuggestions from "@/components/dashboard/SmartAudioSuggestions";
import ScrollFadeFeatures from "@/components/dashboard/ScrollFadeFeatures";
import { EmotionType } from "@/types/emotion";
import { SparklesCore } from "@/components/ui/sparkles";
import { Button } from "@/components/ui/button";
import { TrendingUp, Mail, Zap, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AIMoodCoach from "@/components/dashboard/AIMoodCoach";
import SoundCenter from "@/components/dashboard/SoundCenter";
import BreathingExercise from "@/components/dashboard/BreathingExercise";

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentEmotion, setCurrentEmotion] = useState<EmotionType>('neutral');
  const [checkInStreak, setCheckInStreak] = useState(7);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [timelineEntries, setTimelineEntries] = useState([{
    date: '2024-01-15',
    emotion: 'happy' as EmotionType,
    note: 'Great morning meditation'
  }, {
    date: '2024-01-14',
    emotion: 'sad' as EmotionType,
    note: 'Tough day at work'
  }, {
    date: '2024-01-13',
    emotion: 'neutral' as EmotionType
  }]);
  const [weeklyChallenges, setWeeklyChallenges] = useState([{
    id: '1',
    title: 'Morning Breathing',
    description: 'Practice 5 minutes of deep breathing when you wake up',
    category: 'breathing' as const,
    completed: false,
    difficulty: 'easy' as const
  }, {
    id: '2',
    title: 'Nature Sounds Session',
    description: 'Listen to forest sounds for 15 minutes during your break',
    category: 'audio' as const,
    completed: true,
    difficulty: 'medium' as const
  }, {
    id: '3',
    title: 'Gratitude Moment',
    description: 'Write down three things you\'re grateful for today',
    category: 'mindfulness' as const,
    completed: false,
    difficulty: 'easy' as const
  }]);
  const [audioSessions, setAudioSessions] = useState([{
    id: '1',
    soundName: 'Forest Rain',
    duration: 15,
    startMood: 'sad' as EmotionType,
    endMood: 'neutral' as EmotionType,
    rating: 4,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
  }]);

  const handleDailyCheckIn = (mood: EmotionType) => {
    setCurrentEmotion(mood);
    setHasCheckedInToday(true);
    setCheckInStreak(prev => prev + 1);
    const today = new Date().toISOString().split('T')[0];
    setTimelineEntries(prev => [{
      date: today,
      emotion: mood
    }, ...prev.filter(entry => entry.date !== today)]);
  };

  const handleCompleteWeeklyChallenge = (challengeId: string) => {
    setWeeklyChallenges(prev => prev.map(challenge => challenge.id === challengeId ? {
      ...challenge,
      completed: true
    } : challenge));
  };

  const handleStartAudio = (soundId: string) => {
    const newSession = {
      id: `session-${Date.now()}`,
      soundName: soundId.replace('-', ' '),
      duration: 0,
      startMood: currentEmotion,
      endMood: 'neutral' as EmotionType,
      rating: 0,
      timestamp: new Date()
    };
    setAudioSessions(prev => [newSession, ...prev]);
  };

  const handleRateSession = (sessionId: string, rating: number, endMood: EmotionType) => {
    setAudioSessions(prev => prev.map(session => session.id === sessionId ? {
      ...session,
      rating,
      endMood
    } : session));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black relative">
      {/* Background sparkles effect - only in dark mode on desktop */}
      <div className="absolute inset-0 w-full h-full dark:block hidden md:block">
        <SparklesCore 
          id="dashboard-sparkles" 
          background="transparent" 
          minSize={0.4} 
          maxSize={0.8} 
          particleDensity={80} 
          className="w-full h-full" 
          particleColor="#8b5cf6" 
          speed={0.3} 
        />
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
                🧘‍♀️ Dashboard ✨
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Your personal mindfulness and emotion tracking hub
              </p>
            </div>
            
            {/* Desktop buttons - hidden on mobile */}
            <div className="hidden md:flex flex-wrap gap-3">
              <Button onClick={() => navigate('/live-emotion-detection')} variant="outline" className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-500/30">
                <Zap className="w-4 h-4 mr-2" />
                Live Detection
              </Button>
              <Button onClick={() => navigate('/mood-journal')} variant="outline" className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-green-200 dark:border-green-500/30">
                <Brain className="w-4 h-4 mr-2" />
                Mood Journal
              </Button>
              <Button onClick={() => navigate('/future-self-letter')} variant="outline" className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-500/30">
                <Mail className="w-4 h-4 mr-2" />
                Letter to Future Self
              </Button>
              <AIMoodCoach currentMood={currentEmotion} recentMoods={[currentEmotion]} />
              <SoundCenter currentMood={currentEmotion} />
              <BreathingExercise />
              <Button onClick={() => navigate('/mood-trends')} className="bg-purple-600 hover:bg-purple-700 text-white">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Trends
              </Button>
            </div>
          </div>

          {/* Main content grid */}
          <div className="space-y-8">
            {/* Daily Check-in - only show if not completed */}
            {!hasCheckedInToday && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <DailyCheckIn 
                    onCheckIn={handleDailyCheckIn} 
                    currentStreak={checkInStreak} 
                    hasCheckedInToday={hasCheckedInToday} 
                  />
                </div>
                <div className="lg:col-span-2">
                  <CurrentMood emotion={currentEmotion} confidence={0.8} isDetecting={false} />
                </div>
              </div>
            )}

            {/* If checked in, just show current mood */}
            {hasCheckedInToday && (
              <div className="max-w-md mx-auto">
                <CurrentMood emotion={currentEmotion} confidence={0.8} isDetecting={false} />
              </div>
            )}

            {/* Timeline and Challenges */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <EmotionTimeline entries={timelineEntries} />
              <WeeklyChallenges challenges={weeklyChallenges} onCompleteChallenge={handleCompleteWeeklyChallenge} />
            </div>

            {/* Audio Suggestions and Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SmartAudioSuggestions 
                currentMood={currentEmotion} 
                recentSessions={audioSessions} 
                onStartAudio={handleStartAudio} 
                onRateSession={handleRateSession} 
              />
              
              <div className="bg-white dark:bg-black/50 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-purple-500/20">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
                  📈 Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Current Streak</span>
                    <span className="text-orange-600 dark:text-orange-400 font-semibold">{checkInStreak} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Weekly Challenges</span>
                    <span className="text-teal-600 dark:text-teal-400 font-semibold">
                      {weeklyChallenges.filter(c => c.completed).length}/{weeklyChallenges.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Audio Sessions</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{audioSessions.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Mobile floating feature buttons */}
        <ScrollFadeFeatures currentMood={currentEmotion} />
      </div>
    </div>
  );
};

export default Dashboard;
