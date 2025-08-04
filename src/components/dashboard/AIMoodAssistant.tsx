import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, Sparkles, Heart, User, Loader2 } from 'lucide-react';
import { EmotionType } from '@/types/emotion';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  isAI: boolean;
  timestamp: Date;
}

interface AIMoodAssistantProps {
  currentMood: EmotionType;
  isPremium?: boolean;
  onUpgradeClick?: () => void;
}

const AIMoodAssistant = ({ currentMood, isPremium = false, onUpgradeClick }: AIMoodAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with welcome message based on mood
  const initializeChat = () => {
    const welcomeMessages = {
      happy: "I can sense your positive energy! 😊 I'm here to help you maintain and share that wonderful mood. What's bringing you joy today?",
      sad: "I'm here for you during this difficult time. 💙 Your feelings are valid, and it's okay to not be okay. Would you like to talk about what's on your mind?",
      anxious: "I understand you're feeling anxious right now. 🌸 Let's work through this together. Take a deep breath with me. What's causing you to feel this way?",
      angry: "I can feel your frustration. 🌊 It's completely normal to feel angry sometimes. Let's explore these feelings in a safe space. What triggered this emotion?",
      excited: "Your excitement is contagious! ✨ I love seeing this energy. What amazing thing is happening in your life right now?",
      calm: "What a beautiful state of mind you're in. 🧘‍♀️ I'm here to help you maintain this peace. How can we nurture this calmness?",
      neutral: "I'm here to support you wherever you are emotionally. 🤝 Sometimes neutral is exactly where we need to be. How are you truly feeling beneath the surface?"
    };

    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: welcomeMessages[currentMood] || welcomeMessages.neutral,
        isAI: true,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  };

  // Simulate AI response (replace with actual OpenAI integration)
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const responses = {
      happy: [
        "That's wonderful to hear! 🌟 Your joy is truly infectious. Have you considered sharing this positive energy with someone close to you today?",
        "I love your enthusiasm! ✨ This happiness you're feeling - let's think about what specific moments or thoughts are creating it.",
        "Your positivity is beautiful! 🌈 How can we help you remember this feeling during challenging times?"
      ],
      sad: [
        "Thank you for sharing that with me. 💙 Your courage to express these feelings shows incredible strength. Remember, it's okay to feel sad.",
        "I hear you, and I want you to know that these feelings will pass. 🌙 You're not alone in this. What small thing could bring you a moment of comfort right now?",
        "Your feelings are completely valid. 🤗 Sometimes we need to sit with sadness to process it. What would help you feel supported right now?"
      ],
      anxious: [
        "Let's take this one step at a time. 🌊 Anxiety can feel overwhelming, but you're stronger than you know. What's one thing you can control right now?",
        "I understand how consuming anxiety can be. 🌸 Let's ground ourselves - can you name 3 things you can see around you right now?",
        "Your anxiety is trying to protect you, but sometimes it goes too far. 💚 What would you tell a friend feeling exactly the same way?"
      ],
      angry: [
        "Anger often protects other feelings underneath. 🔥 It's okay to feel this way. What do you think your anger is trying to tell you?",
        "Thank you for trusting me with these intense feelings. 🌋 Let's channel this energy constructively. What change would make the biggest difference?",
        "Your anger is valid and important information. ⚡ Sometimes it signals that boundaries have been crossed. What needs to change?"
      ],
      excited: [
        "Your excitement is absolutely contagious! 🎉 I can feel your energy from here. How can you share this amazing feeling with others?",
        "This is so wonderful to witness! ✨ Your enthusiasm lights up everything around you. What's the best part about this experience?",
        "I love seeing you this animated! 🌟 This excitement you're feeling - how can we harness it to create something meaningful?"
      ],
      calm: [
        "This peaceful energy you have is truly beautiful. 🧘‍♀️ You've found something special. What helped you reach this state of calm?",
        "There's such wisdom in your tranquility. 🌊 How can you return to this feeling when life gets chaotic?",
        "Your serenity is inspiring. 🕊️ This inner peace you've cultivated - it's a gift to yourself and others around you."
      ],
      neutral: [
        "Sometimes being neutral is exactly where we need to be. 🤍 There's wisdom in not forcing emotions. What's really going on beneath the surface?",
        "I appreciate your honesty about feeling neutral. 🌫️ Sometimes this is our mind's way of processing. What would help you connect with your feelings?",
        "Neutral can be a peaceful place to rest. ⚖️ There's no pressure to feel anything specific. What would serve you best right now?"
      ]
    };

    const moodResponses = responses[currentMood] || responses.neutral;
    return moodResponses[Math.floor(Math.random() * moodResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    if (!isPremium) {
      onUpgradeClick?.();
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isAI: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(input);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isAI: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast.error('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMoodColor = (mood: EmotionType) => {
    const colors = {
      happy: 'from-yellow-400/20 to-orange-400/20 border-yellow-300',
      sad: 'from-blue-400/20 to-indigo-400/20 border-blue-300',
      anxious: 'from-purple-400/20 to-pink-400/20 border-purple-300',
      angry: 'from-red-400/20 to-orange-400/20 border-red-300',
      excited: 'from-green-400/20 to-teal-400/20 border-green-300',
      calm: 'from-teal-400/20 to-blue-400/20 border-teal-300',
      neutral: 'from-gray-400/20 to-slate-400/20 border-gray-300'
    };
    return colors[mood] || colors.neutral;
  };

  const getMoodEmoji = (mood: EmotionType) => {
    const emojis = {
      happy: '😊',
      sad: '💙',
      anxious: '🌸',
      angry: '🌊',
      excited: '✨',
      calm: '🧘‍♀️',
      neutral: '🤍'
    };
    return emojis[mood] || '🤍';
  };

  // Initialize chat when component mounts or mood changes
  if (messages.length === 0) {
    initializeChat();
  }

  if (!isPremium) {
    return (
      <Card className={`bg-gradient-to-br ${getMoodColor(currentMood)} dark:from-gray-900/40 dark:to-gray-800/40`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <Bot className="w-5 h-5" />
            AI Mood Assistant
            <span className="text-lg ml-auto">{getMoodEmoji(currentMood)}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="text-4xl mb-4">🤖💭</div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Premium Feature
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Chat with an AI assistant that understands your emotions and provides personalized, empathetic responses to help you navigate your feelings.
          </p>
          <Button 
            onClick={onUpgradeClick} 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Unlock AI Assistant
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-gradient-to-br ${getMoodColor(currentMood)} dark:from-gray-900/40 dark:to-gray-800/40 h-[500px] flex flex-col`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-gray-800 dark:text-gray-200">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            AI Mood Assistant
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">{getMoodEmoji(currentMood)}</span>
            <span className="text-sm capitalize px-2 py-1 bg-white/50 dark:bg-black/20 rounded-full">
              {currentMood}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-3 min-h-0">
        {/* Messages Area */}
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[85%] ${message.isAI ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.isAI 
                        ? 'bg-gradient-to-br from-purple-500 to-indigo-500 text-white' 
                        : 'bg-gradient-to-br from-blue-500 to-teal-500 text-white'
                    }`}>
                      {message.isAI ? <Heart className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.isAI 
                        ? 'bg-white/70 dark:bg-black/30 text-gray-800 dark:text-gray-200' 
                        : 'bg-gradient-to-r from-blue-500 to-teal-500 text-white'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-start gap-2 max-w-[85%]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white flex items-center justify-center">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div className="rounded-2xl px-4 py-3 bg-white/70 dark:bg-black/30">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Thinking...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share what's on your mind..."
            className="flex-1 bg-white/50 dark:bg-black/20 border-white/50 dark:border-gray-600/50 focus:border-purple-400"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIMoodAssistant;