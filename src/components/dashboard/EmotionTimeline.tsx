
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { EmotionType } from '@/types/emotion';
import { emotionEmojis, emotionColors } from '@/utils/emotionData';

interface DayEntry {
  date: string;
  emotion: EmotionType;
  note?: string;
}

interface EmotionTimelineProps {
  entries: DayEntry[];
}

const EmotionTimeline = ({ entries }: EmotionTimelineProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const entry = entries.find(e => e.date === dateString);
      days.push({ day, entry });
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  const days = getDaysInMonth(currentMonth);

  return (
    <Card className="bg-gradient-to-br from-slate-50/80 to-gray-50/80 dark:from-gray-900/50 dark:to-gray-800/50 border-slate-200/50 dark:border-gray-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-slate-800 dark:text-white">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Emotion Timeline
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[140px] text-center">{monthName}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-xs text-gray-500 dark:text-gray-400 text-center py-2 font-medium">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.map((item, index) => (
            <div
              key={index}
              className="aspect-square flex items-center justify-center relative"
            >
              {item && (
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium cursor-pointer transition-all duration-200 hover:scale-110 ${
                    item.entry 
                      ? 'text-white shadow-md' 
                      : 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  style={item.entry ? { 
                    backgroundColor: emotionColors[item.entry.emotion],
                    boxShadow: `0 2px 8px ${emotionColors[item.entry.emotion]}40`
                  } : {}}
                  title={item.entry ? `${item.entry.emotion} - ${item.entry.note || 'No note'}` : 'No check-in'}
                >
                  {item.entry ? emotionEmojis[item.entry.emotion] : item.day}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-xs text-gray-600 dark:text-gray-400 text-center">
          Tap any day to see your mood and notes
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionTimeline;
