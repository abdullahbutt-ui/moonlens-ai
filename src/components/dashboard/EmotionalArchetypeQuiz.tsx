
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Users, RotateCcw } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: { text: string; archetype: string; weight: number }[];
}

interface ArchetypeResult {
  type: string;
  title: string;
  description: string;
  traits: string[];
  emoji: string;
  color: string;
}

const EmotionalArchetypeQuiz = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<ArchetypeResult | null>(null);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      text: "When faced with stress, you typically:",
      options: [
        { text: "Seek solitude to process feelings", archetype: "reflector", weight: 3 },
        { text: "Talk it through with friends", archetype: "connector", weight: 3 },
        { text: "Focus on solutions immediately", archetype: "achiever", weight: 3 },
        { text: "Look for the silver lining", archetype: "optimist", weight: 3 }
      ]
    },
    {
      id: 2,
      text: "Your ideal weekend involves:",
      options: [
        { text: "Journaling and self-reflection", archetype: "reflector", weight: 2 },
        { text: "Gathering with loved ones", archetype: "connector", weight: 2 },
        { text: "Working on personal goals", archetype: "achiever", weight: 2 },
        { text: "Trying something new and exciting", archetype: "optimist", weight: 2 }
      ]
    },
    {
      id: 3,
      text: "When someone shares bad news, you:",
      options: [
        { text: "Listen deeply and validate their feelings", archetype: "reflector", weight: 3 },
        { text: "Offer emotional support and comfort", archetype: "connector", weight: 3 },
        { text: "Help them brainstorm solutions", archetype: "achiever", weight: 3 },
        { text: "Remind them this too shall pass", archetype: "optimist", weight: 3 }
      ]
    },
    {
      id: 4,
      text: "Your emotional processing style is:",
      options: [
        { text: "Slow and thorough", archetype: "reflector", weight: 2 },
        { text: "Through connection with others", archetype: "connector", weight: 2 },
        { text: "Action-oriented", archetype: "achiever", weight: 2 },
        { text: "Naturally positive", archetype: "optimist", weight: 2 }
      ]
    },
    {
      id: 5,
      text: "What motivates you most?",
      options: [
        { text: "Understanding myself better", archetype: "reflector", weight: 3 },
        { text: "Building meaningful relationships", archetype: "connector", weight: 3 },
        { text: "Accomplishing my goals", archetype: "achiever", weight: 3 },
        { text: "Spreading joy and positivity", archetype: "optimist", weight: 3 }
      ]
    }
  ];

  const archetypes: Record<string, ArchetypeResult> = {
    reflector: {
      type: "reflector",
      title: "The Reflector",
      description: "You process emotions deeply and value introspection. You find wisdom in quiet moments and prefer meaningful conversations over small talk.",
      traits: ["Thoughtful", "Intuitive", "Self-aware", "Empathetic"],
      emoji: "🔮",
      color: "from-purple-400 to-indigo-500"
    },
    connector: {
      type: "connector",
      title: "The Connector",
      description: "You thrive on relationships and emotional bonds. You're naturally empathetic and find strength in community and shared experiences.",
      traits: ["Empathetic", "Social", "Supportive", "Understanding"],
      emoji: "🤝",
      color: "from-pink-400 to-rose-500"
    },
    achiever: {
      type: "achiever",
      title: "The Achiever",
      description: "You channel emotions into action and growth. You're resilient and prefer to overcome challenges through determination and planning.",
      traits: ["Determined", "Resilient", "Goal-oriented", "Practical"],
      emoji: "🎯",
      color: "from-green-400 to-emerald-500"
    },
    optimist: {
      type: "optimist",
      title: "The Optimist",
      description: "You naturally see the bright side and inspire others with your positive energy. You believe in the power of hope and maintain faith through difficulties.",
      traits: ["Positive", "Inspiring", "Hopeful", "Energetic"],
      emoji: "☀️",
      color: "from-yellow-400 to-orange-500"
    }
  };

  const handleAnswer = (option: { text: string; archetype: string; weight: number }) => {
    const newAnswers = { ...answers };
    newAnswers[option.archetype] = (newAnswers[option.archetype] || 0) + option.weight;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz complete, calculate result
      const topArchetype = Object.entries(newAnswers).reduce((a, b) => 
        newAnswers[a[0]] > newAnswers[b[0]] ? a : b
      )[0];
      
      setResult(archetypes[topArchetype]);
      setIsQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
    setIsQuizComplete(false);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-violet-100 dark:bg-violet-600/20 border-violet-300 dark:border-violet-500/50 hover:bg-violet-200 dark:hover:bg-violet-600/30 text-violet-800 dark:text-violet-200">
          <Users className="w-4 h-4 mr-2" />
          Discover Your Type
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-white dark:bg-black/95 border-gray-200 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-violet-600 dark:text-violet-400 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Emotional Archetype Quiz
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Discover your unique emotional processing style
          </DialogDescription>
        </DialogHeader>

        {!isQuizComplete ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <Card className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-violet-200 dark:border-violet-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {questions[currentQuestion].text}
                </h3>
                
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full text-left justify-start h-auto p-4 bg-white/70 dark:bg-black/30 hover:bg-violet-100 dark:hover:bg-violet-900/30 border-gray-200 dark:border-gray-700"
                      onClick={() => handleAnswer(option)}
                    >
                      {option.text}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : result && (
          <div className="space-y-6">
            <Card className={`bg-gradient-to-br ${result.color} text-white border-none`}>
              <CardContent className="p-6 text-center">
                <div className="text-6xl mb-4">{result.emoji}</div>
                <h3 className="text-2xl font-bold mb-2">{result.title}</h3>
                <p className="text-white/90">{result.description}</p>
              </CardContent>
            </Card>

            <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Your Key Traits:</h4>
              <div className="flex flex-wrap gap-2">
                {result.traits.map((trait, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-200 rounded-full text-sm"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={resetQuiz}
                variant="outline"
                className="flex-1"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Quiz
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-violet-600 hover:bg-violet-700"
              >
                Save Result
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmotionalArchetypeQuiz;
