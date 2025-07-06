
import { useState } from 'react';
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Send, Sparkles, Calendar, Flame, Heart } from 'lucide-react';
import { EmotionType } from '@/types/emotion';
import DailyCheckIn from '@/components/dashboard/DailyCheckIn';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const FutureSelfLetter = () => {
  const [currentMood, setCurrentMood] = useState<EmotionType>('neutral');
  const [content, setContent] = useState('');
  const [deliveryPeriod, setDeliveryPeriod] = useState('7');
  const [isSealing, setIsSealing] = useState(false);
  const [checkInStreak, setCheckInStreak] = useState(7);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('notification');

  const getMoodPrompt = () => {
    const prompts = {
      happy: "You're radiating joy right now! ✨ What would you like to remind your future self about this beautiful moment?",
      sad: "You're going through something tough. 💙 What words of comfort would help you later?",
      anxious: "You're feeling anxious today. 🌸 What strength would you want to remember?",
      excited: "Your excitement is contagious! 🎉 What dreams are you nurturing right now?",
      calm: "You're in such a peaceful state. 🧘‍♀️ What wisdom would you share with your future self?",
      angry: "You're feeling intense emotions. 🌊 What would help you process this later?",
      neutral: "Take a moment to reflect. 💭 What's on your mind that future you should know?"
    };
    return prompts[currentMood] || prompts.neutral;
  };

  const handleSealLetter = async () => {
    if (!content.trim()) {
      toast.error("Your letter needs some words first! ✍️");
      return;
    }
    
    setIsSealing(true);

    // Calculate delivery date
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + parseInt(deliveryPeriod));

    // Simulate sealing animation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('📬 Future letter saved:', {
      content,
      deliveryDate: deliveryDate.toISOString(),
      currentMood,
      deliveryMethod
    });
    
    // Store in localStorage for demo purposes
    const existingLetters = JSON.parse(localStorage.getItem('futureLetters') || '[]');
    existingLetters.push({
      id: Date.now(),
      content,
      deliveryDate: deliveryDate.toISOString(),
      currentMood,
      deliveryMethod,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('futureLetters', JSON.stringify(existingLetters));
    
    toast.success(`Your letter is sealed! 💌 You'll receive it on ${deliveryDate.toLocaleDateString()}`);
    setContent('');
    setIsSealing(false);
  };

  const handleDailyCheckIn = (mood: EmotionType) => {
    setCurrentMood(mood);
    setHasCheckedInToday(true);
    setCheckInStreak(prev => prev + 1);
    toast.success("Daily check-in complete! 🌟");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <Navbar />
      
      {/* Streak indicator - top right corner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed top-20 right-4 z-40 flex items-center gap-1 bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-full px-3 py-2 shadow-lg border border-purple-200 dark:border-purple-700"
      >
        <Flame className="w-4 h-4 text-orange-500" />
        <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{checkInStreak}</span>
      </motion.div>
      
      <main className="max-w-2xl mx-auto px-4 py-8 pt-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text text-transparent mb-3">
            Letter to Future You 💌
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Write a message to your future self and receive it when you need it most
          </p>
        </motion.div>

        {/* Daily Check-in - only show if not completed */}
        {!hasCheckedInToday && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <DailyCheckIn onCheckIn={handleDailyCheckIn} currentStreak={checkInStreak} hasCheckedInToday={hasCheckedInToday} />
          </motion.div>
        )}

        {/* Future Self Letter Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-purple-200/50 dark:border-purple-500/20 shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-2 text-purple-800 dark:text-purple-200 text-xl">
                <Heart className="w-6 h-6" />
                Your Letter
              </CardTitle>
              <motion.p 
                key={currentMood}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-purple-600 dark:text-purple-300 mt-2"
              >
                {getMoodPrompt()}
              </motion.p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Your message</label>
                <Textarea 
                  placeholder="Hey future me! Right now I'm feeling..."
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  className="min-h-[200px] bg-white/70 dark:bg-black/30 border-purple-200 dark:border-purple-500/30 focus:border-purple-400 dark:focus:border-purple-400 transition-colors resize-none text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-xl" 
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {content.length}/1000 characters
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Deliver in
                  </label>
                  <Select value={deliveryPeriod} onValueChange={setDeliveryPeriod}>
                    <SelectTrigger className="bg-white/70 dark:bg-black/30 border-purple-200 dark:border-purple-500/30 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="30">1 month</SelectItem>
                      <SelectItem value="90">3 months</SelectItem>
                      <SelectItem value="180">6 months</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    How to receive
                  </label>
                  <Select value={deliveryMethod} onValueChange={setDeliveryMethod}>
                    <SelectTrigger className="bg-white/70 dark:bg-black/30 border-purple-200 dark:border-purple-500/30 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="notification">App notification</SelectItem>
                      <SelectItem value="email">Email reminder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                onClick={handleSealLetter} 
                disabled={!content.trim() || isSealing}
                className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 hover:from-purple-700 hover:via-pink-600 hover:to-indigo-700 text-white relative overflow-hidden h-14 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isSealing ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                    Sealing your letter...
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse" />
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Seal & Send to Future Me
                  </>
                )}
              </Button>
              
              <p className="text-xs text-purple-500 dark:text-purple-400 text-center">
                Your letter will be delivered as a gentle {deliveryMethod === 'email' ? 'email' : 'notification'} ✨
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default FutureSelfLetter;
