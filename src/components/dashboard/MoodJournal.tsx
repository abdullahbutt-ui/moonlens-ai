
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { PenTool, Mic, Send, Sparkles } from 'lucide-react';
import { analyzeEmotionFromText, generateAIFeedback } from '@/utils/nlpSimulator';
import { JournalEntry } from '@/types/journal';
import { emotionColors } from '@/utils/emotionData';
import AIFeedbackCard from './AIFeedbackCard';

interface MoodJournalProps {
  onAddEntry: (entry: Omit<JournalEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  recentEntries: JournalEntry[];
}

const MoodJournal = ({ onAddEntry, recentEntries }: MoodJournalProps) => {
  const [content, setContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [aiFeedback, setAIFeedback] = useState('');
  const [emotionTags, setEmotionTags] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const generateEnhancedAIResponse = (userMessage: string, emotions: string[]): { feedback: string; suggestions: string[] } => {
    const lowerMessage = userMessage.toLowerCase();
    const primaryEmotion = emotions[0] || 'neutral';
    
    let feedback = '';
    let suggestions: string[] = [];
    
    if (lowerMessage.includes('anxious') || lowerMessage.includes('stress') || primaryEmotion === 'anxious') {
      feedback = "I sense some tension in your words. Remember, anxiety often comes from our mind wandering to future 'what-ifs'. You're safe in this moment. 🌸";
      suggestions = ['Try 4-7-8 breathing', 'Listen to forest sounds', 'Write 3 gratitudes'];
    } else if (lowerMessage.includes('sad') || lowerMessage.includes('down') || primaryEmotion === 'sad') {
      feedback = "Your feelings are completely valid. Sometimes sadness is our heart's way of processing change or loss. Be gentle with yourself today. 💙";
      suggestions = ['Journal more', 'Listen to rain sounds', 'Take a warm bath'];
    } else if (lowerMessage.includes('happy') || lowerMessage.includes('joy') || primaryEmotion === 'happy') {
      feedback = "Your joy is beautiful and contagious! These moments of happiness are precious gifts - let yourself fully experience this lightness. ✨";
      suggestions = ['Share with a friend', 'Take a nature walk', 'Dance to music'];
    } else if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted')) {
      feedback = "Rest isn't a luxury, it's a necessity. Your body and mind are asking for care. Listen to what you need right now. 🍃";
      suggestions = ['Try meditation', 'Listen to sleep sounds', 'Early bedtime tonight'];
    } else {
      feedback = "Thank you for sharing your inner world with me. Every feeling you have matters, and I'm here to support your emotional journey. 🤍";
      suggestions = ['Continue journaling', 'Try breathing exercise', 'Listen to calming sounds'];
    }
    
    return { feedback, suggestions };
  };

  const handleAnalyze = () => {
    if (!content.trim()) return;
    
    setIsAnalyzing(true);
    setTimeout(() => {
      const tags = analyzeEmotionFromText(content);
      const { feedback, suggestions } = generateEnhancedAIResponse(content, tags);
      setEmotionTags(tags);
      setAIFeedback(feedback);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    console.log('User clicked suggestion:', suggestion);
    // Here you could trigger specific actions based on the suggestion
    if (suggestion.includes('breathing')) {
      // Could open breathing exercise
    } else if (suggestion.includes('sounds')) {
      // Could open sound center
    }
  };

  const handleSubmit = () => {
    if (!content.trim()) return;
    
    const newEntry: Omit<JournalEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
      content,
      emotionTags,
      aiGeneratedTags: emotionTags,
      mood: (emotionTags[0] as any) || 'neutral'
    };
    
    onAddEntry(newEntry);
    setContent('');
    setEmotionTags([]);
    setAIFeedback('');
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-50/80 to-blue-50/80 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200/50 dark:border-purple-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
            <PenTool className="w-5 h-5" />
            Mood Journal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Textarea
              placeholder="How are you feeling? Share your thoughts, emotions, or experiences..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] bg-white/70 dark:bg-gray-800/70 border-purple-200 dark:border-purple-500/30 focus:border-purple-400 dark:focus:border-purple-400 transition-colors text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute bottom-2 right-2 text-purple-600 dark:text-purple-400"
              onClick={() => setIsRecording(!isRecording)}
            >
              <Mic className={`w-4 h-4 ${isRecording ? 'text-red-500 animate-pulse' : ''}`} />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleAnalyze}
              disabled={!content.trim() || isAnalyzing}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'AI Analysis'}
            </Button>
            
            {emotionTags.length > 0 && (
              <Button
                onClick={handleSubmit}
                variant="outline"
                className="border-purple-300 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                <Send className="w-4 h-4 mr-2" />
                Save Entry
              </Button>
            )}
          </div>

          {emotionTags.length > 0 && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {emotionTags.map((tag, index) => (
                  <Badge
                    key={index}
                    className="bg-purple-100 dark:bg-purple-800/50 text-purple-800 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-700/50 transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              
              {aiFeedback && (
                <AIFeedbackCard
                  feedback={aiFeedback}
                  currentMood={emotionTags[0] as any}
                  suggestions={['Try 4-7-8 breathing', 'Listen to forest sounds', 'Write 3 gratitudes']}
                  onSuggestionClick={handleSuggestionClick}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {recentEntries.length > 0 && (
        <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg text-gray-700 dark:text-gray-200">Recent Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentEntries.slice(0, 3).map((entry) => (
                <div key={entry.id} className="p-3 bg-gray-50/70 dark:bg-gray-800/70 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">{entry.content}</p>
                  <div className="flex flex-wrap gap-1">
                    {entry.emotionTags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MoodJournal;
