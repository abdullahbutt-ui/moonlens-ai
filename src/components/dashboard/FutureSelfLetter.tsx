
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Send, Sparkles, Calendar } from 'lucide-react';
import { EmotionType } from '@/types/emotion';
import { emotionColors } from '@/utils/emotionData';

interface FutureSelfLetterProps {
  currentMood: EmotionType;
  onSaveLetter: (letter: {
    content: string;
    deliveryDate: string;
    currentMood: EmotionType;
  }) => void;
}

const FutureSelfLetter = ({ currentMood, onSaveLetter }: FutureSelfLetterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [deliveryPeriod, setDeliveryPeriod] = useState('7');
  const [isSealing, setIsSealing] = useState(false);

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
    
    onSaveLetter({
      content,
      deliveryDate: deliveryDate.toISOString(),
      currentMood
    });
    
    setContent('');
    setIsSealing(false);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-500/30 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-800/30 dark:hover:to-pink-800/30 text-purple-700 dark:text-purple-300"
      >
        <Mail className="w-4 h-4 mr-2" />
        Letter to Future Self
      </Button>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-white/80 to-purple-50/50 dark:from-black/50 dark:to-purple-900/20 border-purple-200/50 dark:border-purple-500/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
          <Mail className="w-5 h-5" />
          Letter to Future Self
        </CardTitle>
        <p className="text-sm text-purple-600 dark:text-purple-300">
          {getMoodPrompt()}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Dear Future Me..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[120px] bg-white/70 dark:bg-black/30 border-purple-200 dark:border-purple-500/30 focus:border-purple-400 dark:focus:border-purple-400 transition-colors resize-none"
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
        
        <div className="flex gap-2">
          <Button
            onClick={handleSealLetter}
            disabled={!content.trim() || isSealing}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white relative overflow-hidden"
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
                Seal & Send
              </>
            )}
          </Button>
          
          <Button
            onClick={() => setIsOpen(false)}
            variant="outline"
            className="border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300"
          >
            Cancel
          </Button>
        </div>
        
        <p className="text-xs text-purple-500 dark:text-purple-400 text-center">
          Your letter will be delivered as a gentle notification ✨
        </p>
      </CardContent>
    </Card>
  );
};

export default FutureSelfLetter;
