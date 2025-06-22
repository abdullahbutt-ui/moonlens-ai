
import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Bot, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface CoachMessage {
  id: string;
  content: string;
  isAI: boolean;
  timestamp: Date;
}

interface AIMoodCoachProps {
  currentMood: string;
  recentMoods: string[];
}

const AIMoodCoach = ({ currentMood, recentMoods }: AIMoodCoachProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<CoachMessage[]>([
    {
      id: '1',
      content: `I notice you're feeling ${currentMood} right now. I'm here to offer gentle support and insights about your emotional patterns. How can I help you today?`,
      isAI: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('anxious') || lowerMessage.includes('stress')) {
      return "I understand anxiety can feel overwhelming. Consider trying the 4-7-8 breathing technique: inhale for 4 counts, hold for 7, exhale for 8. You've shown resilience before - you can navigate this too.";
    }
    
    if (lowerMessage.includes('sad') || lowerMessage.includes('down')) {
      return "It's okay to feel sad sometimes. Your emotions are valid. I've noticed you tend to feel better after journaling or listening to calming sounds. Would either of those help right now?";
    }
    
    if (lowerMessage.includes('sleep') || lowerMessage.includes('tired')) {
      return "I've observed you often feel anxious in the evenings. Consider creating a wind-down routine 1-2 hours before sleep - perhaps some gentle breathing exercises or nature sounds?";
    }
    
    return "Thank you for sharing. Remember, every emotion serves a purpose. Your patterns show strength and growth. Take things one moment at a time.";
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: CoachMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      isAI: false,
      timestamp: new Date()
    };

    const aiResponse: CoachMessage = {
      id: (Date.now() + 1).toString(),
      content: generateAIResponse(inputMessage),
      isAI: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, aiResponse]);
    setInputMessage("");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="bg-purple-600/20 border-purple-500/50 hover:bg-purple-600/30">
          <Bot className="w-4 h-4 mr-2" />
          AI Coach
        </Button>
      </SheetTrigger>
      <SheetContent className="w-96 bg-black/95 border-purple-500/20">
        <SheetHeader>
          <SheetTitle className="text-purple-400 flex items-center">
            <Bot className="w-5 h-5 mr-2" />
            AI Mood Coach
          </SheetTitle>
          <SheetDescription className="text-gray-400">
            Your personal emotional wellness companion
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-col h-full max-h-[calc(100vh-120px)] mt-4">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isAI
                      ? 'bg-purple-900/30 text-purple-100 border border-purple-500/20'
                      : 'bg-blue-900/30 text-blue-100 border border-blue-500/20'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-60 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Textarea
              placeholder="Share what's on your mind..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 min-h-[80px] bg-gray-900/50 border-gray-700"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button 
              onClick={handleSendMessage}
              className="bg-purple-600 hover:bg-purple-700"
              disabled={!inputMessage.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AIMoodCoach;
