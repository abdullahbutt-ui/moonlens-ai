
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { PenTool, Mic, Send, Sparkles } from 'lucide-react';
import { analyzeEmotionFromText, generateAIFeedback } from '@/utils/nlpSimulator';
import { JournalEntry } from '@/types/journal';
import { emotionColors } from '@/utils/emotionData';

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

  const handleAnalyze = () => {
    if (!content.trim()) return;
    
    setIsAnalyzing(true);
    setTimeout(() => {
      const tags = analyzeEmotionFromText(content);
      const feedback = generateAIFeedback(tags, content);
      setEmotionTags(tags);
      setAIFeedback(feedback);
      setIsAnalyzing(false);
    }, 1500);
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
      <Card className="bg-gradient-to-br from-purple-50/80 to-blue-50/80 border-purple-200/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
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
              className="min-h-[120px] bg-white/70 border-purple-200 focus:border-purple-400 transition-colors"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute bottom-2 right-2 text-purple-600"
              onClick={() => setIsRecording(!isRecording)}
            >
              <Mic className={`w-4 h-4 ${isRecording ? 'text-red-500 animate-pulse' : ''}`} />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleAnalyze}
              disabled={!content.trim() || isAnalyzing}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'AI Analysis'}
            </Button>
            
            {emotionTags.length > 0 && (
              <Button
                onClick={handleSubmit}
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <Send className="w-4 h-4 mr-2" />
                Save Entry
              </Button>
            )}
          </div>

          {emotionTags.length > 0 && (
            <div className="space-y-3 p-4 bg-white/60 rounded-lg border border-purple-200/50">
              <div className="flex flex-wrap gap-2">
                {emotionTags.map((tag, index) => (
                  <Badge
                    key={index}
                    className="bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              
              {aiFeedback && (
                <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-purple-400">
                  <p className="text-sm text-purple-700 font-medium">AI Insight:</p>
                  <p className="text-purple-600 mt-1">{aiFeedback}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {recentEntries.length > 0 && (
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-gray-700">Recent Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentEntries.slice(0, 3).map((entry) => (
                <div key={entry.id} className="p-3 bg-gray-50/70 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">{entry.content}</p>
                  <div className="flex flex-wrap gap-1">
                    {entry.emotionTags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
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
