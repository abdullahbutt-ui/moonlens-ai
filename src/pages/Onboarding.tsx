
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Shield, TrendingUp, ArrowRight, ChevronRight, Heart, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState({
    season: '',
    vibe: '',
    goal: '',
    experience: ''
  });

  const steps = [
    {
      type: "intro",
      icon: Heart,
      title: "Welcome to Your Mental Wellness Journey",
      description: "MoodLens uses AI to understand your emotions and help you grow. Ready to start? ✨",
      color: "text-pink-600 dark:text-pink-400"
    },
    {
      type: "question",
      icon: Sparkles,
      title: "What's your current season vibe?",
      description: "Pick what resonates with your energy right now:",
      color: "text-purple-600 dark:text-purple-400",
      options: [
        { emoji: "🌸", text: "Spring - Fresh starts & growth", value: "spring" },
        { emoji: "☀️", text: "Summer - High energy & adventure", value: "summer" },
        { emoji: "🍂", text: "Autumn - Cozy & reflective", value: "autumn" },
        { emoji: "❄️", text: "Winter - Quiet & introspective", value: "winter" }
      ],
      key: "season"
    },
    {
      type: "question",
      icon: Camera,
      title: "How's your mental space lately?",
      description: "No judgment - just checking in:",
      color: "text-indigo-600 dark:text-indigo-400",
      options: [
        { emoji: "🚀", text: "Thriving - feeling unstoppable", value: "thriving" },
        { emoji: "🌊", text: "Flowing - going with the waves", value: "flowing" },
        { emoji: "🌱", text: "Growing - working on myself", value: "growing" },
        { emoji: "🔋", text: "Recharging - need some TLC", value: "recharging" }
      ],
      key: "vibe"
    },
    {
      type: "question",
      icon: TrendingUp,
      title: "What do you want from your mind today?",
      description: "Your mental wellness goals:",
      color: "text-teal-600 dark:text-teal-400",
      options: [
        { emoji: "🧘‍♀️", text: "More peace & calm vibes", value: "peace" },
        { emoji: "💪", text: "Build emotional strength", value: "strength" },
        { emoji: "🎯", text: "Better focus & clarity", value: "focus" },
        { emoji: "💝", text: "Self-love & confidence", value: "confidence" }
      ],
      key: "goal"
    },
    {
      type: "privacy",
      icon: Shield,
      title: "Your Privacy Matters",
      description: "Your data stays private and secure. We're here to support your growth, not invade your space. 🔒",
      color: "text-green-600 dark:text-green-400"
    }
  ];

  const handleAnswer = (key: string, value: string) => {
    setUserAnswers(prev => ({ ...prev, [key]: value }));
    setTimeout(() => handleNext(), 300);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save user preferences
      localStorage.setItem('onboardingAnswers', JSON.stringify(userAnswers));
      navigate('/login');
    }
  };

  const handleSkip = () => {
    navigate('/login');
  };

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 dark:from-purple-900 dark:via-pink-900 dark:to-indigo-900">
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent dark:from-black/20" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 right-20 w-32 h-32 bg-purple-200/30 dark:bg-purple-500/20 rounded-full blur-xl"
          animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-24 h-24 bg-pink-200/30 dark:bg-pink-500/20 rounded-full blur-xl"
          animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <motion.div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index <= currentStep 
                    ? 'bg-purple-600 dark:bg-purple-400 w-8' 
                    : 'bg-gray-300 dark:bg-gray-600 w-2'
                }`}
                animate={{ width: index <= currentStep ? 32 : 8 }}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-gray-200/50 dark:border-gray-700/50 shadow-2xl rounded-3xl">
              <CardContent className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                  className="mb-6"
                >
                  <div className={`inline-flex p-4 rounded-full bg-gray-100 dark:bg-gray-700 ${currentStepData.color}`}>
                    <IconComponent className="h-12 w-12" />
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
                >
                  {currentStepData.title}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6"
                >
                  {currentStepData.description}
                </motion.p>

                {/* Question Options */}
                {currentStepData.type === "question" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-3"
                  >
                    {currentStepData.options?.map((option, index) => (
                      <motion.button
                        key={option.value}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        onClick={() => handleAnswer(currentStepData.key!, option.value)}
                        className="w-full p-4 text-left bg-white/60 dark:bg-gray-700/60 rounded-2xl hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-300 border border-gray-200/50 dark:border-gray-600/50 hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{option.emoji}</span>
                          <span className="text-gray-800 dark:text-gray-200 font-medium">
                            {option.text}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons - only show for non-question steps */}
        {currentStepData.type !== "question" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex justify-between w-full max-w-md mt-8"
          >
            <Button
              onClick={handleSkip}
              variant="ghost"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-xl"
            >
              <ChevronRight className="h-4 w-4 mr-2" />
              Skip
            </Button>

            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transform hover:scale-105 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl"
            >
              {currentStep === steps.length - 1 ? 'Get Started! 🚀' : 'Next'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
