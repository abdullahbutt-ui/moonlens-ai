
import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Bot, Send, Heart, Lightbulb, Music } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { EmotionType } from "@/types/emotion";

interface CoachMessage {
  id: string;
  content: string;
  isAI: boolean;
  timestamp: Date;
  suggestions?: string[];
  activities?: string[];
}

interface AIMoodCoachProps {
  currentMood: EmotionType;
  recentMoods: EmotionType[];
}

const AIMoodCoach = ({ currentMood, recentMoods }: AIMoodCoachProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  const getMoodSpecificWelcome = (mood: EmotionType) => {
    const responses = {
      happy: {
        content: "I can sense your positive energy! ✨ It's wonderful to see you feeling happy. How can I help you nurture and maintain this beautiful state?",
        suggestions: ["Share your joy with someone", "Write about what made you happy", "Take a gratitude moment"],
        activities: ["Dance to uplifting music", "Call a friend", "Go for a nature walk"]
      },
      sad: {
        content: "I notice you're feeling sad right now, and that's completely okay. 💙 Your emotions are valid, and I'm here to offer gentle support. What's on your heart?",
        suggestions: ["Practice self-compassion", "Express your feelings through writing", "Allow yourself to feel"],
        activities: ["Listen to calming music", "Take a warm bath", "Practice gentle breathing"]
      },
      anxious: {
        content: "I can sense some anxiety in your energy. 🌸 Remember, you're safe in this moment. Let's work together to find your calm center. What's causing you worry?",
        suggestions: ["Focus on your breath", "Ground yourself in the present", "Challenge worried thoughts"],
        activities: ["Try 4-7-8 breathing", "Listen to forest sounds", "Do progressive muscle relaxation"]
      },
      excited: {
        content: "Your excitement is absolutely infectious! 🎉 It's beautiful to feel this energized. How can I help you channel this wonderful energy?",
        suggestions: ["Share your excitement", "Plan something fun", "Celebrate the moment"],
        activities: ["Create something new", "Exercise or dance", "Connect with friends"]
      },
      calm: {
        content: "I love this peaceful energy you're radiating. 🍃 You seem centered and balanced. This is a perfect time for reflection or planning. What's on your mind?",
        suggestions: ["Reflect on your growth", "Set gentle intentions", "Practice mindfulness"],
        activities: ["Meditate quietly", "Journal your thoughts", "Enjoy nature sounds"]
      },
      angry: {
        content: "I can feel the intensity of your emotions right now. 🔥 Anger often signals that something important to you needs attention. Let's explore this together safely.",
        suggestions: ["Acknowledge your feelings", "Find healthy outlets", "Identify the real issue"],
        activities: ["Try physical exercise", "Punch a pillow", "Write out your feelings"]
      },
      neutral: {
        content: "You seem to be in a balanced, neutral space right now. 🌅 This can be a wonderful place for self-reflection and planning. What would you like to explore?",
        suggestions: ["Check in with yourself", "Set daily intentions", "Practice gratitude"],
        activities: ["Try gentle meditation", "Listen to ambient sounds", "Write in your journal"]
      }
    };

    return responses[mood] || responses.neutral;
  };

  const generateAIResponse = (userMessage: string, currentMood: EmotionType): CoachMessage => {
    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    let suggestions: string[] = [];
    let activities: string[] = [];
    
    // Mood-specific responses with journaling prompts and activities
    if (lowerMessage.includes('anxious') || lowerMessage.includes('stress') || lowerMessage.includes('worry')) {
      response = "I hear that you're feeling anxious. This is your mind's way of trying to protect you, but sometimes it can be overwhelming. Let's work on bringing you back to the present moment. Try this: name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.";
      suggestions = ["Practice the 5-4-3-2-1 grounding technique", "Write down your worries and challenge them", "Focus on what you can control right now"];
      activities = ["Listen to rain sounds", "Try box breathing (4-4-4-4)", "Do gentle yoga stretches"];
    } else if (lowerMessage.includes('sad') || lowerMessage.includes('down') || lowerMessage.includes('depressed')) {
      response = "Your sadness is completely valid, and I want you to know that feeling this way doesn't define your worth. Sometimes our hearts need time to process difficult emotions. Be gentle with yourself today. What would bring you even a tiny bit of comfort right now?";
      suggestions = ["Write a letter to yourself with compassion", "List three things you're grateful for", "Remember: this feeling is temporary"];
      activities = ["Listen to soothing music", "Take a warm, mindful shower", "Hug a pillow or pet"];
    } else if (lowerMessage.includes('happy') || lowerMessage.includes('joy') || lowerMessage.includes('excited')) {
      response = "Your happiness is radiating through your words! 🌟 These moments of joy are precious gifts. Take a moment to really savor this feeling. What specifically is bringing you this happiness? Capturing these details can help you recreate similar moments in the future.";
      suggestions = ["Write about what's making you happy", "Share your joy with someone you care about", "Take a photo to remember this moment"];
      activities = ["Dance to your favorite song", "Call someone you love", "Spend time in nature"];
    } else if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted')) {
      response = "Your body and mind are asking for rest, and that's a wise message to listen to. Rest isn't selfish—it's necessary for your well-being. What kind of rest do you think you need right now? Physical, mental, or emotional?";
      suggestions = ["Honor your need for rest", "Practice saying 'no' to non-essential tasks", "Create a calming bedtime routine"];
      activities = ["Listen to sleep sounds", "Try progressive muscle relaxation", "Take a power nap if possible"];
    } else if (lowerMessage.includes('angry') || lowerMessage.includes('frustrated')) {
      response = "I can feel the intensity of your emotions. Anger often shows up when something important to us feels threatened or when we feel unheard. Your feelings are valid. Let's find a healthy way to honor this energy while also finding your center.";
      suggestions = ["Write out your anger without censoring", "Identify what boundary was crossed", "Ask: what do I need right now?"];
      activities = ["Do jumping jacks or push-ups", "Scream into a pillow", "Listen to powerful, energizing music"];
    } else {
      response = "Thank you for sharing with me. I'm here to listen and support you on your emotional journey. Every feeling you experience is part of your human experience and deserves acknowledgment. What would be most helpful for you right now?";
      suggestions = ["Check in with your body and breath", "Practice self-compassion", "Set a gentle intention for the day"];
      activities = ["Try a 5-minute meditation", "Listen to your favorite calming sounds", "Write three things you appreciate about yourself"];
    }
    
    return {
      id: (Date.now() + 1).toString(),
      content: response,
      isAI: true,
      timestamp: new Date(),
      suggestions,
      activities
    };
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: CoachMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      isAI: false,
      timestamp: new Date()
    };

    const aiResponse = generateAIResponse(inputMessage, currentMood);

    setMessages(prev => [...prev, userMessage, aiResponse]);
    setInputMessage("");
  };

  const handleOpenSheet = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      const welcome = getMoodSpecificWelcome(currentMood);
      const welcomeMessage: CoachMessage = {
        id: '1',
        content: welcome.content,
        isAI: true,
        timestamp: new Date(),
        suggestions: welcome.suggestions,
        activities: welcome.activities
      };
      setMessages([welcomeMessage]);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          onClick={handleOpenSheet}
          variant="outline" 
          className="bg-purple-100 dark:bg-purple-600/20 border-purple-300 dark:border-purple-500/50 hover:bg-purple-200 dark:hover:bg-purple-600/30 text-purple-800 dark:text-purple-200 shadow-sm"
        >
          <Bot className="w-4 h-4 mr-2" />
          AI Coach
        </Button>
      </SheetTrigger>
      <SheetContent className="w-96 bg-white dark:bg-black/95 border-gray-200 dark:border-purple-500/20">
        <SheetHeader>
          <SheetTitle className="text-purple-600 dark:text-purple-400 flex items-center">
            <Bot className="w-5 h-5 mr-2" />
            AI Mood Coach
          </SheetTitle>
          <SheetDescription className="text-gray-600 dark:text-gray-400">
            Your personal emotional wellness companion • Currently feeling: <Badge variant="outline" className="ml-1 capitalize">{currentMood}</Badge>
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
                  className={`max-w-[85%] p-3 rounded-lg ${
                    message.isAI
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-100 border border-purple-200 dark:border-purple-500/20'
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-100 border border-blue-200 dark:border-blue-500/20'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-1 text-xs font-medium opacity-80">
                        <Lightbulb className="w-3 h-3" />
                        Mindful Tips:
                      </div>
                      {message.suggestions.map((suggestion, index) => (
                        <div key={index} className="text-xs bg-white/50 dark:bg-black/20 rounded px-2 py-1 border border-current/20">
                          • {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {message.activities && message.activities.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-1 text-xs font-medium opacity-80">
                        <Heart className="w-3 h-3" />
                        Try This:
                      </div>
                      {message.activities.map((activity, index) => (
                        <div key={index} className="text-xs bg-white/50 dark:bg-black/20 rounded px-2 py-1 border border-current/20">
                          🎯 {activity}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <span className="text-xs opacity-60 mt-2 block">
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
              className="flex-1 min-h-[80px] bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button 
              onClick={handleSendMessage}
              className="bg-purple-600 hover:bg-purple-700 text-white"
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
