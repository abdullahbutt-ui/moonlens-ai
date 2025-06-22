import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateMockEmotionData } from "@/utils/emotionData";
import { EmotionData, EmotionStats } from "@/types/emotion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { generateMoodInsight } from "@/utils/challenges";
import { useTheme } from "@/contexts/ThemeContext";

const MoodTrends = () => {
  const { theme, toggleTheme } = useTheme();
  const [emotionData, setEmotionData] = useState<EmotionData[]>([]);
  const [dailySummary, setDailySummary] = useState<any[]>([]);
  const [moodInsight, setMoodInsight] = useState<string>("");

  useEffect(() => {
    // Mock data for now
    const mockData = generateMockEmotionData(100);
    setEmotionData(mockData);

    // Process data to get daily summaries
    const dailyData = processDailyData(mockData);
    setDailySummary(dailyData);

    // Generate mood insight
    const trends = dailyData.map(day => ({
      date: day.date,
      dominantMood: day.dominantEmotion,
      moodCounts: day.emotionCounts,
      averageConfidence: day.averageConfidence,
      journalEntries: Math.floor(Math.random() * 5),
      challengeCompleted: Math.random() > 0.5
    }));
    setMoodInsight(generateMoodInsight(trends));
  }, []);

  const processDailyData = (data: EmotionData[]) => {
    const dailyData: { [key: string]: EmotionData[] } = {};

    data.forEach(item => {
      const date = item.timestamp.toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = [];
      }
      dailyData[date].push(item);
    });

    return Object.entries(dailyData).map(([date, emotions]) => {
      const emotionCounts: { [key: string]: number } = {};
      let totalConfidence = 0;

      emotions.forEach(emotion => {
        emotionCounts[emotion.emotion] = (emotionCounts[emotion.emotion] || 0) + 1;
        totalConfidence += emotion.confidence;
      });

      const totalEmotions = emotions.length;
      const averageConfidence = totalConfidence / totalEmotions;

      let dominantEmotion = 'neutral';
      let maxCount = 0;
      Object.entries(emotionCounts).forEach(([emotion, count]) => {
        if (count > maxCount) {
          maxCount = count;
          dominantEmotion = emotion;
        }
      });

      return {
        date,
        dominantEmotion,
        emotionCounts,
        averageConfidence,
        totalDetections: totalEmotions
      };
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const calculateEmotionStats = (data: EmotionData[]): EmotionStats[] => {
    const emotionCounts: { [key: string]: number } = {};
    let totalConfidence: { [key: string]: number } = {};
    let emotionList: string[] = [];

    data.forEach(item => {
      emotionCounts[item.emotion] = (emotionCounts[item.emotion] || 0) + 1;
      totalConfidence[item.emotion] = (totalConfidence[item.emotion] || 0) + item.confidence;
      if (!emotionList.includes(item.emotion)) {
        emotionList.push(item.emotion);
      }
    });

    const totalEmotions = data.length;

    return emotionList.map(emotion => ({
      emotion: emotion as any,
      count: emotionCounts[emotion] || 0,
      percentage: ((emotionCounts[emotion] || 0) / totalEmotions) * 100,
      averageConfidence: (totalConfidence[emotion] || 0) / (emotionCounts[emotion] || 1)
    }));
  };

  const emotionStats = calculateEmotionStats(emotionData);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#a4de6c', '#d0ed57', '#ff7300', '#336699'];

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background sparkles effect */}
      <div className="absolute inset-0 w-full h-full">
        {/* You can use a Sparkles component here if you have one */}
        {/* Example: <SparklesCore ... /> */}
      </div>
      
      <div className="relative z-10">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                Mood Trends & Insights 📊
              </h1>
              <p className="text-muted-foreground text-lg">
                Discover patterns in your emotional journey with AI-powered analytics
              </p>
            </div>
            <Button
              onClick={toggleTheme}
              variant="outline"
              className="bg-background/50"
            >
              {theme === 'dark' ? '☀️' : '🌙'} Toggle Theme
            </Button>
          </div>

          {/* AI Insights Card */}
          <Card className="mb-8 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                <strong>AI Insights</strong>
              </CardTitle>
              <CardDescription className="text-gray-300">
                <strong>Personalized observations from your mood patterns</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
                  <p className="text-purple-200">
                    <strong>📈 Weekly Pattern:</strong> You tend to feel most positive on weekends and Wednesday afternoons.
                  </p>
                </div>
                <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-500/20">
                  <p className="text-blue-200">
                    <strong>🎯 Stress Triggers:</strong> Your anxiety levels peak around 8 PM - consider earlier wind-down routines.
                  </p>
                </div>
                <div className="p-4 bg-emerald-900/20 rounded-lg border border-emerald-500/20">
                  <p className="text-emerald-200">
                    <strong>💡 Recommendation:</strong> Your journal entries show improved mood after breathing exercises. Keep it up!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Emotion Stats Pie Chart */}
            <Card className="bg-black/50 backdrop-blur-sm border border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">
                  Emotion Distribution
                </CardTitle>
                <CardDescription className="text-sm text-gray-400">
                  Breakdown of your detected emotions
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={emotionStats}
                      dataKey="count"
                      nameKey="emotion"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      label
                    >
                      {emotionStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Daily Emotion Summary Bar Chart */}
            <Card className="bg-black/50 backdrop-blur-sm border border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">
                  Daily Emotion Summary
                </CardTitle>
                <CardDescription className="text-sm text-gray-400">
                  Dominant emotions over the past few days
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailySummary}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalDetections" fill="#8884d8" name="Total Detections" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MoodTrends;
