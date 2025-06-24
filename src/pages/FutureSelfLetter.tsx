
import { useState } from 'react';
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Send, Sparkles, Calendar, Flame } from 'lucide-react';
import { EmotionType } from '@/types/emotion';
import DailyCheckIn from '@/components/dashboard/DailyCheckIn';

const FutureSelfLetter = () => {
  const [currentMood, setCurrentMood] = useState<EmotionType>('neutral');
  const [content, setContent] = useState('');
  const [deliveryPeriod, setDeliveryPeriod] = useState('7');
  const [isSealing, setIsSealing] = useState(false);
  const [checkInStreak, setCheckInStreak] = useState(7);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);

  const getMoodPrompt = () => {
    const prompts = {
      happy: "You're feeling wonderful right now! What would you like to remind your future self about this joy?",
      sad: "You're going through something difficult. What words of comfort would help you later?",
      anxious: "You're feeling anxious today. What strength would you want to remember?",
      excited: "Your excitement is beautiful! What dreams are you nurturing right now?",
      calm: "You're in a peaceful state. What wisdom would you share with your future self?",
      angry: "You're feeling intense emotions. What would help you process this later?",
      neutral: "Take a moment to reflect. What's on your mind that future you should know?"
    };
    return prompts[currentMood] || prompts.neutral;
  };

  const handleSealLetter = async () => {
    if (!content.trim()) return;
    
    setIsSealing(true);
    
    // Calculate delivery date
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + parseInt(deliveryPeriod));
    
    // Simulate sealing animation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('📬 Future letter saved:', {
      content,
      deliveryDate: deliveryDate.toISOString(),
      currentMood
    });
    
    alert('Your letter has been sealed and will be delivered on time! ✨');
    
    setContent('');
    setIsSealing(false);
  };

  const handleDailyCheckIn = (mood: EmotionType) => {
    setCurrentMood(mood);
    setHasCheckedInToday(true);
    setCheckInStreak(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navbar />
      
      {/* Streak indicator - top right corner */}
      <div className="fixed top-20 right-4 z-40 flex items-center gap-1 bg-white dark:bg-black/80 rounded-full px-3 py-1 shadow-lg border border-gray-200 dark:border-gray-700">
        <Flame className="w-4 h-4 text-orange-500" />
        <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{checkInStreak}</span>
      </div>
      
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Letter to Future Self ✨
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Write a message to your future self and receive it when you need it most
          </p>
        </div>

        {/* Daily Check-in - only show if not completed */}
        {!hasCheckedInToday && (
          <div className="mb-8">
            <DailyCheckIn
              onCheckIn={handleDailyCheckIn}
              currentStreak={checkInStreak}
              hasCheckedInToday={hasCheckedInToday}
            />
          </div>
        )}

        {/* Future Self Letter Form */}
        <Card className="bg-gradient-to-br from-white/80 to-purple-50/50 dark:from-black/50 dark:to-purple-900/20 border-purple-200/50 dark:border-purple-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
              <Mail className="w-6 h-6" />
              Your Letter
            </CardTitle>
            <p className="text-sm text-purple-600 dark:text-purple-300">
              {getMoodPrompt()}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Textarea
              placeholder="Dear Future Me,&#10;&#10;Today I'm feeling..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] bg-white/70 dark:bg-black/30 border-purple-200 dark:border-purple-500/30 focus:border-purple-400 dark:focus:border-purple-400 transition-colors resize-none text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm text-purple-700 dark:text-purple-300">Deliver in:</span>
              </div>
              <Select value={deliveryPeriod} onValueChange={setDeliveryPeriod}>
                <SelectTrigger className="w-32 bg-white/70 dark:bg-black/30 border-purple-200 dark:border-purple-500/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button
              onClick={handleSealLetter}
              disabled={!content.trim() || isSealing}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white relative overflow-hidden h-12"
            >
              {isSealing ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Sealing Letter...
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse" />
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Seal & Send to Future
                </>
              )}
            </Button>
            
            <p className="text-xs text-purple-500 dark:text-purple-400 text-center">
              Your letter will be delivered as a gentle notification ✨
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default FutureSelfLetter;
