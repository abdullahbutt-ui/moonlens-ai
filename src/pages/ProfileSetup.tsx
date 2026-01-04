import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Heart,
  Sparkles,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

const ProfileSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    interests: [] as string[],
    moodSensitivity: [5],
    goals: [] as string[]
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleting, setIsCompleting] = useState(false);

  const interestOptions = [
    'Mindfulness', 'Meditation', 'Self-care', 'Fitness', 'Music', 
    'Reading', 'Nature', 'Yoga', 'Journaling', 'Art', 'Breathing Exercises'
  ];

  const goalOptions = [
    'Reduce stress', 'Better sleep', 'Increase happiness', 'Manage anxiety',
    'Build confidence', 'Improve focus', 'Track emotions', 'Practice gratitude'
  ];

  const toggleSelection = (item: string, type: 'interests' | 'goals') => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].includes(item) 
        ? prev[type].filter(i => i !== item)
        : [...prev[type], item]
    }));
  };

  const handleComplete = async () => {
    if (!user) return;
    
    setIsCompleting(true);
    try {
      // Update user metadata in Supabase auth
      await supabase.auth.updateUser({
        data: {
          full_name: `${formData.firstName} ${formData.lastName}`,
          first_name: formData.firstName,
          last_name: formData.lastName,
          profile_completed: true,
          interests: formData.interests,
          mood_sensitivity: formData.moodSensitivity[0],
          goals: formData.goals,
          setup_completed_at: new Date().toISOString()
        }
      });

      toast.success("Welcome to Moodsify! Your profile is ready! ✨");
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Profile setup error:', error);
      toast.error("Failed to complete setup. Please try again.");
    } finally {
      setIsCompleting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName.trim() && formData.lastName.trim();
      case 2:
        return formData.interests.length > 0;
      case 3:
        return formData.goals.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-teal-100 dark:from-purple-900 dark:via-blue-900 dark:to-teal-900 p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* Progress indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-8 h-0.5 ${
                    step < currentStep ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 rounded-3xl">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl text-gray-800 dark:text-white">
                  <Sparkles className="w-6 h-6 text-purple-500" />
                  Welcome to Moodsify!
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400">
                  Let's get to know you better
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="mt-1 rounded-2xl border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="mt-1 rounded-2xl border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50"
                    placeholder="Enter your last name"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Interests */}
          {currentStep === 2 && (
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 rounded-3xl">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl text-gray-800 dark:text-white">
                  <Heart className="w-6 h-6 text-purple-500" />
                  Your Interests
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400">
                  What activities bring you joy? (Select at least one)
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {interestOptions.map((interest) => (
                    <Badge
                      key={interest}
                      variant={formData.interests.includes(interest) ? "default" : "outline"}
                      className={`cursor-pointer p-3 text-center justify-center ${
                        formData.interests.includes(interest)
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'hover:bg-purple-50 dark:hover:bg-purple-900/20'
                      }`}
                      onClick={() => toggleSelection(interest, 'interests')}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Goals & Sensitivity */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 rounded-3xl">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2 text-2xl text-gray-800 dark:text-white">
                    <User className="w-6 h-6 text-purple-500" />
                    Your Goals
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400">
                    What would you like to improve? (Select at least one)
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {goalOptions.map((goal) => (
                      <Badge
                        key={goal}
                        variant={formData.goals.includes(goal) ? "default" : "outline"}
                        className={`cursor-pointer p-3 text-center justify-center ${
                          formData.goals.includes(goal)
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : 'hover:bg-purple-50 dark:hover:bg-purple-900/20'
                        }`}
                        onClick={() => toggleSelection(goal, 'goals')}
                      >
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-gray-800 dark:text-white">Mood Sensitivity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Label className="text-gray-700 dark:text-gray-300 block">
                      How sensitive are you to mood changes?
                    </Label>
                    <Slider
                      value={formData.moodSensitivity}
                      onValueChange={(value) => setFormData({ ...formData, moodSensitivity: value })}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>Less sensitive</span>
                      <span>Very sensitive</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="flex-1 rounded-2xl"
              >
                Back
              </Button>
            )}
            
            {currentStep < 3 ? (
              <Button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!canProceed()}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!canProceed() || isCompleting}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl"
              >
                {isCompleting ? 'Setting up...' : 'Complete Setup'}
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileSetup;
