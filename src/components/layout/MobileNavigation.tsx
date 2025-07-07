
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Bot, Headphones, User, MoreHorizontal, Brain, TrendingUp, Settings, FileText, Heart, Smile } from 'lucide-react';
import { motion } from 'framer-motion';
import AIMoodCoach from '@/components/dashboard/AIMoodCoach';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const MobileNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isAICoachOpen, setIsAICoachOpen] = useState(false);

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/dashboard' },
    { id: 'coach', icon: Bot, label: 'Coach', path: '/mood-journal', isAICoach: true },
    { id: 'sounds', icon: Headphones, label: 'Sounds', path: '/sound-center' },
    { id: 'journal', icon: Brain, label: 'Journal', path: '/mood-journal' },
    { id: 'more', icon: MoreHorizontal, label: 'More', path: null },
  ];

  const moreItems = [
    { icon: FileText, label: 'Future Letter', path: '/future-self-letter' },
    { icon: Smile, label: 'Community', path: '/mood-wall' },
  ];

  const handleNavigation = (item: any) => {
    if (item.id === 'more') {
      setIsMoreOpen(true);
    } else if (item.isAICoach) {
      setIsAICoachOpen(true);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const isActive = (path: string | null) => {
    if (!path) return false;
    return location.pathname === path;
  };

  return (
    <>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-700/50 px-2 py-2 shadow-lg">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const isItemActive = isActive(item.path);
              return (
                <motion.div
                  key={item.id}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleNavigation(item)}
                    className={`flex flex-col items-center gap-1 h-auto py-3 px-2 rounded-2xl transition-all duration-300 w-full ${
                      isItemActive 
                        ? 'bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-600 dark:text-purple-400' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400'
                    }`}
                  >
                    <motion.div
                      animate={isItemActive ? { scale: 1.1 } : { scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <item.icon className="w-5 h-5" />
                    </motion.div>
                    <span className="text-xs font-medium">{item.label}</span>
                    {isItemActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-500 rounded-full"
                      />
                    )}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* More Menu Sheet */}
      <Sheet open={isMoreOpen} onOpenChange={setIsMoreOpen}>
        <SheetContent side="bottom" className="bg-white dark:bg-gray-900 rounded-t-3xl border-t border-gray-200 dark:border-gray-700">
          <SheetHeader className="text-center pb-4">
            <SheetTitle className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              More Features
            </SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-2 gap-3 pb-8">
            {moreItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate(item.path);
                    setIsMoreOpen(false);
                  }}
                  className="w-full h-16 rounded-2xl border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 transition-all duration-300 flex flex-col items-center gap-2"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* AI Coach Modal */}
      <Sheet open={isAICoachOpen} onOpenChange={setIsAICoachOpen}>
        <SheetContent className="w-96 bg-white dark:bg-gray-900 border-gray-200 dark:border-purple-500/20">
          <div onClick={(e) => e.stopPropagation()}>
            <AIMoodCoach currentMood="neutral" recentMoods={["neutral"]} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileNavigation;
