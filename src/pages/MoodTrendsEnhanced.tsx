import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Brain, Calendar, Heart, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";
import { motion } from "framer-motion";

interface MoodEntry {
  date: string;
  mood: string;
  count: number;
}

interface MoodSummary {
  emotion: string;
  count: number;
  percentage: number;
  color: string;
}

const MoodTrendsEnhanced = () => {
  const { user } = useAuth();
  const [moodData, setMoodData] = useState<MoodEntry[]>([]);
  const [moodSummary, setMoodSummary] = useState<MoodSummary[]>([]);
  const [weeklyInsights, setWeeklyInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const emotionColors = {
    happy: "#10B981",
    sad: "#3B82F6", 
    angry: "#EF4444",
    surprised: "#F59E0B",
    fearful: "#8B5CF6",
    disgusted: "#84CC16",
    neutral: "#6B7280",
    excited: "#F97316",
    calm: "#06B6D4",
    anxious: "#EF4444"
  };

  const emotionEmojis = {
    happy: "😊",
    sad: "😢",
    angry: "😠",
    surprised: "😲",
    fearful: "😨",
    disgusted: "🤢",
    neutral: "😐",
    excited: "🤩",
    calm: "😌",
    anxious: "😰"
  };

  useEffect(() => {
    if (user) {
      fetchMoodData();
    }
  }, [user]);

  const fetchMoodData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch last 7 days of check-ins
      const sevenDaysAgo = subDays(new Date(), 7).toISOString().split('T')[0];
      
      const { data: checkIns, error } = await (supabase
        .from('daily_checkins' as any)
        .select('*')
        .eq('user_id', user.id)
        .gte('check_in_date', sevenDaysAgo)
        .order('check_in_date', { ascending: true }) as any);

      if (error) throw error;

      // Process data for charts
      const dailyData: { [key: string]: { [mood: string]: number } } = {};
      const moodCounts: { [mood: string]: number } = {};
      
      (checkIns as any[])?.forEach((checkIn: any) => {
        const date = checkIn.check_in_date;
        const mood = checkIn.mood;
        
        if (!dailyData[date]) {
          dailyData[date] = {};
        }
        dailyData[date][mood] = (dailyData[date][mood] || 0) + 1;
        moodCounts[mood] = (moodCounts[mood] || 0) + 1;
      });

      // Create chart data
      const chartData = Object.entries(dailyData).map(([date, moods]) => {
        // Get the dominant mood for this date
        const moodEntries = Object.entries(moods);
        const dominantMood = moodEntries.length > 0 ? moodEntries.reduce((a, b) => moods[a[0]] > moods[b[0]] ? a : b)[0] : 'neutral';
        const totalCount = Object.values(moods).reduce((sum, count) => sum + count, 0);
        
        return {
          date: format(new Date(date), 'MMM dd'),
          fullDate: date,
          mood: dominantMood,
          count: totalCount,
          ...moods
        };
      });

      // Create mood summary
      const totalEntries = Object.values(moodCounts).reduce((sum, count) => sum + count, 0);
      const summary = Object.entries(moodCounts).map(([mood, count]) => ({
        emotion: mood,
        count,
        percentage: Math.round((count / totalEntries) * 100),
        color: emotionColors[mood as keyof typeof emotionColors] || "#6B7280"
      })).sort((a, b) => b.count - a.count);

      setMoodData(chartData);
      setMoodSummary(summary);
      
      // Generate insights
      generateInsights(summary, chartData);
      
    } catch (error) {
      console.error('Error fetching mood data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = (summary: MoodSummary[], chartData: any[]) => {
    const insights: string[] = [];
    
    if (summary.length > 0) {
      const topMood = summary[0];
      insights.push(`You were ${topMood.emotion} most often this week (${topMood.percentage}% of the time)`);
      
      if (summary.length > 1) {
        const secondMood = summary[1];
        insights.push(`Your second most common mood was ${secondMood.emotion} (${secondMood.percentage}%)`);
      }
    }

    // Find best and worst days
    if (chartData.length > 0) {
      const positiveMoods = ['happy', 'excited', 'calm'];
      const bestDay = chartData.reduce((best, day) => {
        const positiveCount = positiveMoods.reduce((sum, mood) => sum + (day[mood] || 0), 0);
        const bestPositiveCount = positiveMoods.reduce((sum, mood) => sum + (best[mood] || 0), 0);
        return positiveCount > bestPositiveCount ? day : best;
      });
      
      insights.push(`${bestDay.date} was your best day this week!`);
      
      // Weekly pattern
      const weekendData = chartData.filter(day => {
        const date = new Date(day.fullDate);
        const dayOfWeek = date.getDay();
        return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
      });
      
      if (weekendData.length > 0) {
        const weekendPositive = weekendData.reduce((sum, day) => {
          return sum + positiveMoods.reduce((moodSum, mood) => moodSum + (day[mood] || 0), 0);
        }, 0);
        
        const weekdayPositive = chartData.filter(day => {
          const date = new Date(day.fullDate);
          const dayOfWeek = date.getDay();
          return dayOfWeek !== 0 && dayOfWeek !== 6;
        }).reduce((sum, day) => {
          return sum + positiveMoods.reduce((moodSum, mood) => moodSum + (day[mood] || 0), 0);
        }, 0);
        
        if (weekendPositive > weekdayPositive) {
          insights.push("You tend to feel better on weekends - try to bring some weekend vibes to your weekdays!");
        }
      }
    }
    
    setWeeklyInsights(insights);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {emotionEmojis[entry.dataKey as keyof typeof emotionEmojis]} {entry.dataKey}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            Your Mood Journey
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Discover patterns in your emotional journey with real-time insights
          </p>
        </motion.div>

        {/* Insights Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {weeklyInsights.map((insight, index) => (
            <Card key={index} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border-purple-200/50 dark:border-purple-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full">
                    {index === 0 && <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                    {index === 1 && <Heart className="w-4 h-4 text-pink-600 dark:text-pink-400" />}
                    {index === 2 && <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{insight}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Mood Trends */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  Weekly Mood Trends
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                  Your mood patterns over the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {moodData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={moodData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#6B7280"
                        fontSize={12}
                      />
                      <YAxis stroke="#6B7280" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      {Object.keys(emotionColors).map((emotion) => (
                        <Area
                          key={emotion}
                          type="monotone"
                          dataKey={emotion}
                          stackId="1"
                          stroke={emotionColors[emotion as keyof typeof emotionColors]}
                          fill={emotionColors[emotion as keyof typeof emotionColors]}
                          fillOpacity={0.6}
                        />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                      <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Start checking in daily to see your mood trends!</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Mood Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  Emotion Overview
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                  Your emotional patterns this week
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {moodSummary.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={moodSummary}
                        dataKey="count"
                        nameKey="emotion"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ emotion, percentage }) => 
                          `${emotionEmojis[emotion as keyof typeof emotionEmojis]} ${emotion} ${percentage}%`
                        }
                        labelLine={false}
                      >
                        {moodSummary.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                      <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Check in daily to see your emotion distribution!</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Mood Summary Cards */}
        {moodSummary.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">This Week's Emotions</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {moodSummary.map((mood, index) => (
                <Card key={mood.emotion} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">
                      {emotionEmojis[mood.emotion as keyof typeof emotionEmojis]}
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-white capitalize">
                      {mood.emotion}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {mood.percentage}% of time
                    </p>
                    <div 
                      className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2"
                    >
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${mood.percentage}%`,
                          backgroundColor: mood.color
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default MoodTrendsEnhanced;