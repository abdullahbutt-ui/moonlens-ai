import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

const PremiumModal = ({ isOpen, onClose, onUpgrade }: PremiumModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      await onUpgrade();
    } finally {
      setIsLoading(false);
    }
  };

  const premiumFeatures = [
    { icon: Zap, title: "AI Journaling Prompts", description: "Personalized prompts based on your mood" },
    { icon: Crown, title: "Advanced Analytics", description: "Weekly & monthly mood insights with burnout alerts" },
    { icon: Sparkles, title: "Daily Challenges", description: "Mood-based self-care tasks & habit tracking" },
    { icon: Check, title: "Achievement System", description: "Streak tracking & milestone celebrations" },
    { icon: Check, title: "Shareable Mood Cards", description: "Beautiful mood summaries to share" },
    { icon: Check, title: "Private Mode", description: "Enhanced privacy with PIN protection" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-500/30">
        <DialogHeader className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
          >
            <Crown className="w-8 h-8 text-white" />
          </motion.div>
          
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Unlock Premium ✨
          </DialogTitle>
          
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Transform your mental wellness journey with premium features designed for creators and hustlers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-6">
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">$4.99</div>
            <div className="text-sm text-gray-500">per month</div>
            <Badge className="mt-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              🎯 Launch Special - 50% OFF
            </Badge>
          </div>

          <div className="space-y-3">
            {premiumFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-white/70 dark:bg-black/30 rounded-lg"
              >
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <feature.icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm">{feature.title}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{feature.description}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl py-3"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              <>
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Premium
              </>
            )}
          </Button>
          
          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Maybe Later
          </Button>
        </div>

        <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
          Cancel anytime • 7-day money-back guarantee
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumModal;