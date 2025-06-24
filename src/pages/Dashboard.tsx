import { useState, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import CurrentMood from "@/components/dashboard/CurrentMood";
import WebcamEmotionDetector from "@/components/dashboard/WebcamEmotionDetector";
import MoodJournal from "@/components/dashboard/MoodJournal";
import DailyChallenge from "@/components/dashboard/DailyChallenge";
import { EmotionType } from "@/types/emotion";
import { JournalEntry, DailyChallenge as DailyChallengeType } from "@/types/journal";
import { SparklesCore } from "@/components/ui/sparkles";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AIMoodCoach from "@/components/dashboard/AIMoodCoach";
import SoundCenter from "@/components/dashboard/SoundCenter";
import BreathingExercise from "@/components/dashboard/BreathingExercise";
import EmotionalAvatar from "@/components/dashboard/EmotionalAvatar";
import FutureSelfLetter from "@/components/dashboard/FutureSelfLetter";
import DailyCheckIn from "@/components/dashboard/DailyCheckIn";
import EmotionTimeline from "@/components/dashboard/EmotionTimeline";
import WeeklyChallenges from "@/components/dashboard/WeeklyChallenges";
import MoodTriggerInsights from "@/components/dashboard/MoodTriggerInsights";
import EmotionalArchetypeQuiz from "@/components/dashboard/EmotionalArchetypeQuiz";
import SmartAudioSuggestions from "@/components/dashboard/SmartAudioSuggestions";

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentEmotion, setCurrentEmotion] = useState<EmotionType>('neutral');
  const [confidence, setConfidence] = useState(0.8);
  const [isDetecting, setIsDetecting] = useState(false);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [todaysChallenge, setTodaysChallenge] = useState<DailyChallengeType>();
  const [checkInStreak, setCheckInStreak] = useState(7);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [timelineEntries, setTimelineEntries] = useState([
    { date: '2024-01-15', emotion: 'happy' as EmotionType, note: 'Great morning meditation' },
    { date: '2024-01-14', emotion: 'sad' as EmotionType, note: 'Tough day at work' },
    { date: '2024-01-13', emotion: 'neutral' as EmotionType },
  ]);
  const [weeklyChallenges, setWeeklyChallenges] = useState([
    {
      id: '1',
      title: 'Morning Breathing',
      description: 'Practice 5 minutes of deep breathing when you wake up',
      category: 'breathing' as const,
      completed: false,
      difficulty: 'easy' as const
    },
    {
      id: '2', 
      title: 'Nature Sounds Session',
      description: 'Listen to forest sounds for 15 minutes during your break',
      category: 'audio' as const,
      completed: true,
      difficulty: 'medium' as const
    },
    {
      id: '3',
      title: 'Gratitude Moment',
      description: 'Write down three things you\'re grateful for today',
      category: 'mindfulness' as const,
      completed: false,
      difficulty: 'easy' as const
    }
  ]);
  const [triggerPatterns, setTriggerPatterns] = useState([
    {
      id: '1',
      pattern: 'You often feel anxious on Monday evenings',
      frequency: 4,
      timeOfDay: 'evening',
      dayOfWeek: 'Monday',
      suggestion: 'Try a 10-minute forest rain session before dinner on Mondays',
      severity: 'medium' as const
    }
  ]);
  const [audioSessions, setAudioSessions] = useState([
    {
      id: '1',
      soundName: 'Forest Rain',
      duration: 15,
      startMood: 'sad' as EmotionType,
      endMood: 'neutral' as EmotionType,
      rating: 4,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    }
  ]);

  const handleEmotionDetected = useCallback((emotion: EmotionType, conf: number) => {
    console.log(`🎭 Detected emotion: ${emotion} (${Math.round(conf * 100)}% confidence)`);
    setCurrentEmotion(emotion);
    setConfidence(conf);
  }, []);

  const toggleDetection = () => {
    setIsDetecting(!isDetecting);
  };

  const handleAddJournalEntry = (entry: Omit<JournalEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: `journal-${Date.now()}`,
      userId: 'current-user',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setJournalEntries(prev => [newEntry, ...prev]);
  };

  const handleCompleteChallenge = (response: string) => {
    const challenge: DailyChallengeType = {
      id: `challenge-${Date.now()}`,
      userId: 'current-user',
      challengeText: "Name one thing that made you smile today.",
      response,
      completed: true,
      completedAt: new Date(),
      date: new Date().toISOString().split('T')[0]
    };
    setTodaysChallenge(challenge);
  };

  const handleSaveFutureLetter = (letter: {
    content: string;
    deliveryDate: string;
    currentMood: EmotionType;
  }) => {
    console.log('📬 Future letter saved:', letter);
    // In a real app, this would save to the database
    // For now, we'll just show a success message
    alert('Your letter has been sealed and will be delivered on time! ✨');
  };

  const handleDailyCheckIn = (mood: EmotionType) => {
    setCurrentEmotion(mood);
    setHasCheckedInToday(true);
    setCheckInStreak(prev => prev + 1);
    
    const today = new Date().toISOString().split('T')[0];
    setTimelineEntries(prev => [
      { date: today, emotion: mood },
      ...prev.filter(entry => entry.date !== today)
    ]);
  };

  const handleCompleteChallenge = (challengeId: string) => {
    setWeeklyChallenges(prev => 
      prev.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, completed: true }
          : challenge
      )
    );
  };

  const handleApplySuggestion = (patternId: string) => {
    const pattern = triggerPatterns.find(p => p.id === patternId);
    if (pattern && pattern.suggestion.includes('forest rain')) {
      // Open sound center with forest rain
      console.log('Opening forest rain sounds');
    }
  };

  const handleStartAudio = (soundId: string) => {
    const newSession = {
      id: `session-${Date.now()}`,
      soundName: soundId.replace('-', ' '),
      duration: 0,
      startMood: currentEmotion,
      timestamp: new Date()
    };
    setAudioSessions(prev => [newSession, ...prev]);
  };

  const handleRateSession = (sessionId: string, rating: number, endMood: EmotionType) => {
    setAudioSessions(prev =>
      prev.map(session =>
        session.id === sessionId
          ? { ...session, rating, endMood }
          : session
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black relative">
      {/* Background sparkles effect - only in dark mode */}
      <div className="absolute inset-0 w-full h-full dark:block hidden">
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
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  MoodLens Dashboard ✨
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Real-time AI emotion detection powered by your webcam and microphone
                </p>
              </div>
              <EmotionalAvatar 
                currentEmotion={currentEmotion}
                confidence={confidence}
                className="hidden sm:block"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <EmotionalArchetypeQuiz />
              <FutureSelfLetter 
                currentMood={currentEmotion}
                onSaveLetter={handleSaveFutureLetter}
              />
              <AIMoodCoach 
                currentMood={currentEmotion}
                recentMoods={[currentEmotion]}
              />
              <SoundCenter currentMood={currentEmotion} />
              <BreathingExercise />
              <Button
                onClick={() => navigate('/mood-trends')}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                View Trends
              </Button>
            </div>
          </div>

          {/* First row: Daily Check-in and Core Detection */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            <div className="xl:col-span-1 space-y-6">
              <DailyCheckIn
                onCheckIn={handleDailyCheckIn}
                currentStreak={checkInStreak}
                hasCheckedInToday={hasCheckedInToday}
              />
              <CurrentMood 
                emotion={currentEmotion}
                confidence={confidence}
                isDetecting={isDetecting}
              />
              {/* Show avatar on mobile */}
              <div className="sm:hidden flex justify-center">
                <EmotionalAvatar 
                  currentEmotion={currentEmotion}
                  confidence={confidence}
                />
              </div>
            </div>
            
            <div className="xl:col-span-2">
              <WebcamEmotionDetector
                onEmotionDetected={handleEmotionDetected}
                isActive={isDetecting}
                onToggle={toggleDetection}
              />
            </div>
          </div>

          {/* Second row: Timeline and Challenges */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <EmotionTimeline entries={timelineEntries} />
            <WeeklyChallenges
              challenges={weeklyChallenges}
              onCompleteChallenge={handleCompleteChallenge}
            />
          </div>

          {/* Third row: Insights and Audio */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <MoodTriggerInsights
              patterns={triggerPatterns}
              onApplySuggestion={handleApplySuggestion}
            />
            <SmartAudioSuggestions
              currentMood={currentEmotion}
              recentSessions={audioSessions}
              onStartAudio={handleStartAudio}
              onRateSession={handleRateSession}
            />
          </div>

          {/* Fourth row: Journal and Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <MoodJournal
              onAddEntry={handleAddJournalEntry}
              recentEntries={journalEntries}
            />
            
            <div className="space-y-6">
              <DailyChallenge
                todaysChallenge={todaysChallenge}
                onCompleteChallenge={handleCompleteChallenge}
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
                    <span className="text-gray-600 dark:text-gray-400">Journal Entries Today</span>
                    <span className="text-purple-600 dark:text-purple-400 font-semibold">{journalEntries.length}</span>
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
      </div>
    </div>
  );
};

export default Dashboard;
