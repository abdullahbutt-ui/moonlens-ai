
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Shield, TrendingUp, ArrowRight, Skip } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: Camera,
      title: "AI-Powered Emotion Detection",
      description: "MoodLens uses your camera & voice to understand how you feel in real-time.",
      color: "text-purple-600 dark:text-purple-400"
    },
    {
      icon: Shield,
      title: "Your Privacy Matters",
      description: "Your data is private and secure. We help you grow emotionally while keeping your information safe.",
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: TrendingUp,
      title: "Track Your Journey",
      description: "Let's begin your emotional journey with personalized insights and calming experiences.",
      color: "text-teal-600 dark:text-teal-400"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
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
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-blue-50 to-teal-100 dark:from-purple-900 dark:via-blue-900 dark:to-teal-900">
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
          className="absolute bottom-20 left-20 w-24 h-24 bg-teal-200/30 dark:bg-teal-500/20 rounded-full blur-xl"
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
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index <= currentStep 
                    ? 'bg-purple-600 dark:bg-purple-400' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
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
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-xl">
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
                  className="text-gray-600 dark:text-gray-300 leading-relaxed"
                >
                  {currentStepData.description}
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex justify-between w-full max-w-md mt-8"
        >
          <Button
            onClick={handleSkip}
            variant="ghost"
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <Skip className="h-4 w-4 mr-2" />
            Skip
          </Button>

          <Button
            onClick={handleNext}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300"
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Onboarding;
