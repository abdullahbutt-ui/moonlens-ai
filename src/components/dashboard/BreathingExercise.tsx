
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wind, Play, Pause, RotateCcw, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BreathingExerciseProps {
  onComplete?: () => void;
}

const BreathingExercise = ({ onComplete }: BreathingExerciseProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [counter, setCounter] = useState(4);
  const [cycle, setCycle] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState('4-7-8');

  const exercises = {
    '4-7-8': { inhale: 4, hold: 7, exhale: 8, name: '4-7-8 Breathing', description: 'Classic relaxation technique' },
    '4-4-4': { inhale: 4, hold: 4, exhale: 4, name: 'Box Breathing', description: 'Equal count breathing for focus' },
    '4-2-6': { inhale: 4, hold: 2, exhale: 6, name: 'Calm Breathing', description: 'Gentle technique for anxiety' }
  };

  const currentExercise = exercises[selectedExercise as keyof typeof exercises];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && counter > 0) {
      interval = setInterval(() => {
        setCounter(counter - 1);
      }, 1000);
    } else if (isActive && counter === 0) {
      if (phase === 'inhale') {
        setPhase('hold');
        setCounter(currentExercise.hold);
      } else if (phase === 'hold') {
        setPhase('exhale');
        setCounter(currentExercise.exhale);
      } else if (phase === 'exhale') {
        setCycle(cycle + 1);
        if (cycle >= 3) {
          setIsActive(false);
          onComplete?.();
        } else {
          setPhase('inhale');
          setCounter(currentExercise.inhale);
        }
      }
    }

    return () => clearInterval(interval);
  }, [isActive, counter, phase, cycle, currentExercise, onComplete]);

  const startExercise = () => {
    setIsActive(true);
    setPhase('inhale');
    setCounter(currentExercise.inhale);
    setCycle(0);
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const resetExercise = () => {
    setIsActive(false);
    setPhase('inhale');
    setCounter(currentExercise.inhale);
    setCycle(0);
  };

  const getCircleSize = () => {
    if (phase === 'inhale') return 'scale-150';
    if (phase === 'hold') return 'scale-125';
    return 'scale-100';
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'bg-blue-500';
      case 'hold': return 'bg-yellow-500';
      case 'exhale': return 'bg-green-500';
    }
  };

  const quotes = [
    "Breathe in peace, breathe out stress.",
    "Your breath is your anchor to the present moment.",
    "With each breath, you create space for calm.",
    "Breathing deeply brings clarity to the mind.",
    "Let your breath guide you to serenity."
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-blue-100 dark:bg-blue-600/20 border-blue-300 dark:border-blue-500/50 hover:bg-blue-200 dark:hover:bg-blue-600/30 text-blue-800 dark:text-blue-200 shadow-sm">
          <Wind className="w-4 h-4 mr-2" />
          Breathing
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-white dark:bg-black/95 border-gray-200 dark:border-gray-800">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-blue-600 dark:text-blue-400 flex items-center">
              <Wind className="w-5 h-5 mr-2" />
              Mindful Breathing
            </DialogTitle>
            {/* Mobile back button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="md:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Take a moment to center yourself with guided breathing exercises
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.entries(exercises).map(([key, exercise]) => (
              <Card 
                key={key}
                className={`cursor-pointer transition-all ${
                  selectedExercise === key 
                    ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-500' 
                    : 'bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => {
                  setSelectedExercise(key);
                  resetExercise();
                }}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-900 dark:text-white">{exercise.name}</CardTitle>
                  <CardDescription className="text-xs text-gray-600 dark:text-gray-400">{exercise.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {exercise.inhale}-{exercise.hold}-{exercise.exhale} pattern
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-col items-center space-y-6">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <div 
                className={`w-32 h-32 rounded-full ${getPhaseColor()} transition-all duration-1000 ease-in-out ${getCircleSize()} flex items-center justify-center`}
              >
                <div className="text-white text-center">
                  <div className="text-lg font-semibold capitalize">{phase}</div>
                  <div className="text-2xl font-bold">{counter}</div>
                </div>
              </div>
              <div className="absolute bottom-0 text-center text-gray-600 dark:text-gray-400">
                <div className="text-sm">Cycle {cycle + 1} of 4</div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={startExercise} disabled={isActive}>
                <Play className="w-4 h-4 mr-2" />
                Start
              </Button>
              <Button onClick={pauseExercise} disabled={!isActive} variant="outline">
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
              <Button onClick={resetExercise} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            <div className="text-center text-gray-700 dark:text-gray-300 max-w-md">
              <p className="text-lg font-medium capitalize">{phase} for {counter} seconds</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic">"{randomQuote}"</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BreathingExercise;
