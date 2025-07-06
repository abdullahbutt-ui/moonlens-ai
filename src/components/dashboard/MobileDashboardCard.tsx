
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface MobileDashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  gradient: string;
  delay?: number;
}

const MobileDashboardCard = ({ 
  title, 
  description, 
  icon: Icon, 
  onClick, 
  gradient,
  delay = 0 
}: MobileDashboardCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card 
        onClick={onClick}
        className={`relative overflow-hidden cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${gradient}`}
      >
        <div className="p-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 dark:bg-black/20 rounded-2xl backdrop-blur-sm">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white text-lg mb-1">{title}</h3>
              <p className="text-white/80 text-sm leading-relaxed">{description}</p>
            </div>
          </div>
        </div>
        
        {/* Animated background particles */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full animate-pulse" />
          <div className="absolute bottom-6 left-6 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 right-8 w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      </Card>
    </motion.div>
  );
};

export default MobileDashboardCard;
