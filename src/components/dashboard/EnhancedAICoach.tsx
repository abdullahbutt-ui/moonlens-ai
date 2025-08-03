import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, RefreshCw, Send, Sparkles, Lock } from 'lucide-react';
import { EmotionType } from '@/types/emotion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface EnhancedAICoachProps {
  currentMood: EmotionType;
  isPremium?: boolean;
  onUpgradeClick?: () => void;
}

const EnhancedAICoach = ({ currentMood, isPremium = false, onUpgradeClick }: EnhancedAICoachProps) => {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generatePrompt = async () => {
    if (!isPremium) {
      onUpgradeClick?.();
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-journal-prompt', {
        body: { mood: currentMood, promptType: 'reflection' }
      });

      if (error) throw error;
      
      setPrompt(data.prompt);
      setHasGenerated(true);
      toast.success('✨ AI prompt generated!');
    } catch (error) {
      console.error('Error generating prompt:', error);
      toast.error('Failed to generate prompt. Please try again.');
      
      // Fallback to default prompts
      const fallbackPrompts = {
        happy: "What brought you joy today, and how can you nurture more moments like this?",
        sad: "What emotions are you experiencing right now, and what would bring you comfort?",
        anxious: "What thoughts are creating anxiety for you today? Let's explore them gently.",
        angry: "What triggered your anger today? Explore these feelings without judging yourself.",
        excited: "What's energizing you today? How can you channel this excitement productively?",
        calm: "What's contributing to your sense of peace today?",
        neutral: "How are you truly feeling beneath the surface today?"
      };
      
      setPrompt(fallbackPrompts[currentMood] || fallbackPrompts.neutral);
      setHasGenerated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const saveJournalEntry = async () => {
    if (!response.trim() || !user) return;

    try {
      const { error } = await supabase
        .from('ai_journal_entries')
        .insert({
          user_id: user.id,
          content: response,
          ai_prompt: prompt,
          mood_at_entry: currentMood,
          emotion_tags: [currentMood]
        });

      if (error) throw error;
      
      toast.success('Journal entry saved! 📝');
      setResponse('');
      setPrompt('');
      setHasGenerated(false);
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast.error('Failed to save entry. Please try again.');
    }
  };

  const getMoodEmoji = (mood: EmotionType) => {
    const emojis = {
      happy: '😊',
      sad: '😢',
      anxious: '😰',
      angry: '😠',
      excited: '🤩',
      calm: '😌',
      neutral: '😐'
    };
    return emojis[mood] || '😐';
  };

  if (!isPremium) {
    return (
      <Card className="bg-gradient-to-br from-purple-50/80 to-indigo-50/80 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200/50 dark:border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
            <Bot className="w-5 h-5" />
            AI Journaling Coach
            <Lock className="w-4 h-4 ml-auto" />
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="text-4xl mb-4">🤖✨</div>
          <h3 className="text-lg font-semibold mb-2">Premium Feature</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Get personalized journaling prompts powered by AI, tailored to your current mood and emotional state.
          </p>
          <Button onClick={onUpgradeClick} className="bg-purple-600 hover:bg-purple-700 text-white">
            Unlock AI Coach
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50/80 to-indigo-50/80 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200/50 dark:border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-purple-800 dark:text-purple-200">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            AI Journaling Coach
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{getMoodEmoji(currentMood)}</span>
            <span className="text-sm capitalize text-purple-600 dark:text-purple-400">
              {currentMood}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!hasGenerated ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-6"
          >
            <div className="text-4xl mb-4">✨</div>
            <h3 className="font-semibold mb-2">Ready for some reflection?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              I'll create a personalized journaling prompt based on your current mood: <strong>{currentMood}</strong>
            </p>
            <Button 
              onClick={generatePrompt}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate AI Prompt
                </>
              )}
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* AI Generated Prompt */}
            <div className="p-4 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-lg border border-purple-200 dark:border-purple-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Your personalized prompt:
                </span>
              </div>
              <p className="text-purple-800 dark:text-purple-200 leading-relaxed">
                {prompt}
              </p>
            </div>

            {/* Journal Response Area */}
            <div className="space-y-3">
              <Textarea
                placeholder="Take your time to reflect and write your thoughts..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="min-h-[120px] bg-white/70 dark:bg-black/30 border-purple-200 dark:border-purple-500/50 focus:border-purple-400 dark:focus:border-purple-400"
              />
              
              <div className="flex gap-2">
                <Button
                  onClick={saveJournalEntry}
                  disabled={!response.trim()}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Save Entry
                </Button>
                
                <Button
                  onClick={generatePrompt}
                  variant="outline"
                  disabled={isLoading}
                  className="border-purple-200 dark:border-purple-500/50 text-purple-700 dark:text-purple-300"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedAICoach;