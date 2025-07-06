
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wind, Play, Pause, RotateCcw, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface BreathingExerciseProps {
  onComplete?: () => void;
}

const BreathingExercise = ({ onComplete }: BreathingExerciseProps) => {
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
        setCounter(prev => prev - 1);
      }, 1000);
    } else if (isActive && counter === 0) {
      if (phase === 'inhale') {
        setPhase('hold');
        setCounter(currentExercise.hold);
      } else if (phase === 'hold') {
        setPhase('exhale');
        setCounter(currentExercise.exhale);
      } else if (phase === 'exhale') {
        const newCycle = cycle + 1;
        setCycle(newCycle);
        if (newCycle >= 4) {
          setIsActive(false);
          setCycle(0);
          setPhase('inhale');
          setCounter(currentExercise.inhale);
          onComplete?.();
        } else {
          setPhase('inhale');
          setCounter(currentExercise.inhale);
        }
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
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

  const getCircleScale = () => {
    if (phase === 'inhale') return 1.5;
    if (phase === 'hold') return 1.25;
    return 1;
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'from-blue-400 to-blue-600';
      case 'hold': return 'from-yellow-400 to-yellow-600';
      case 'exhale': return 'from-green-400 to-green-600';
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
        <Button variant="outline" className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-500/30 hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-800/30 dark:hover:to-cyan-800/30 text-blue-700 dark:text-blue-300 shadow-sm rounded-2xl px-6 py-3">
          <Wind className="w-4 h-4 mr-2" />
          Breathing
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-blue-600 dark:text-blue-400 flex items-center text-xl">
              <Wind className="w-5 h-5 mr-2" />
              Mindful Breathing
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-gray-500 dark:text-gray-400"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Take a moment to center yourself with guided breathing exercises
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 p-2">
          {/* Exercise Selection */}
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(exercises).map(([key, exercise]) => (
              <Card 
                key={key}
                className={`cursor-pointer transition-all duration-300 ${
                  selectedExercise === key 
                    ? 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-blue-300 dark:border-blue-500 shadow-md' 
                    : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
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

          {/* Breathing Circle */}
          <div className="flex flex-col items-center space-y-6 py-8">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <motion.div 
                className={`w-32 h-32 rounded-full bg-gradient-to-br ${getPhaseColor()} flex items-center justify-center shadow-lg`}
                animate={{ 
                  scale: getCircleScale(),
                }}
                transition={{ 
                  duration: 1, 
                  ease: "easeInOut"
                }}
              >
                <div className="text-white text-center">
                  <motion.div 
                    className="text-lg font-semibold capitalize mb-1"
                    key={phase}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {phase}
                  </motion.div>
                  <motion.div 
                    className="text-3xl font-bold"
                    key={counter}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {counter}
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Progress indicator */}
              <div className="absolute -bottom-6 text-center text-gray-600 dark:text-gray-400">
                <div className="text-sm font-medium">Cycle {cycle + 1} of 4</div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              <Button 
                onClick={startExercise} 
                disabled={isActive}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-full px-6 py-2"
              >
                <Play className="w-4 h-4 mr-2" />
                Start
              </Button>
              <Button 
                onClick={pauseExercise} 
                disabled={!isActive} 
                variant="outline"
                className="border-blue-300 dark:border-blue-500 text-blue-600 dark:text-blue-400 rounded-full px-6 py-2"
              >
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
              <Button 
                onClick={resetExercise} 
                variant="outline"
                className="border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-full px-6 py-2"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            {/* Instructions and Quote */}
            <div className="text-center text-gray-700 dark:text-gray-300 max-w-sm space-y-4">
              <motion.p 
                className="text-lg font-medium capitalize"
                key={`${phase}-${counter}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {isActive ? `${phase} for ${counter} seconds` : `Ready to ${phase}`}
              </motion.p>
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                "{randomQuote}"
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BreathingExercise;
