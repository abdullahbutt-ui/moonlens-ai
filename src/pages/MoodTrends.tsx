
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar, Lightbulb, Brain } from 'lucide-react';
import { generateMockEmotionData } from '@/utils/emotionData';
import { generateMoodInsight } from '@/utils/challenges';
import { MoodTrend } from '@/types/journal';
import Navbar from '@/components/layout/Navbar';
import { SparklesCore } from '@/components/ui/sparkles';

const MoodTrends = () => {
  // Mock data - replace with real data from Supabase
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  
  const mockTrends: MoodTrend[] = useMemo(() => {
    const trends = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const moods = ['happy', 'calm', 'anxious', 'excited', 'sad', 'grateful'];
      const dominantMood = moods[Math.floor(Math.random() * moods.length)];
      
      trends.push({
        date: date.toISOString().split('T')[0],
        dominantMood,
        moodCounts: {
          [dominantMood]: Math.floor(Math.random() * 10) + 5,
          happy: Math.floor(Math.random() * 8),
          calm: Math.floor(Math.random() * 6),
          anxious: Math.floor(Math.random() * 4)
        },
        averageConfidence: Math.random() * 0.3 + 0.7,
        journalEntries: Math.floor(Math.random() * 5) + 1,
        challengeCompleted: Math.random() > 0.3
      });
    }
    
    return trends;
  }, []);

  const chartData = mockTrends.map(trend => ({
    date: new Date(trend.date).toLocaleDateString('en', { weekday: 'short' }),
    confidence: Math.round(trend.averageConfidence * 100),
    entries: trend.journalEntries,
    mood: trend.dominantMood
  }));

  const moodDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};
    mockTrends.forEach(trend => {
      Object.entries(trend.moodCounts).forEach(([mood, count]) => {
        distribution[mood] = (distribution[mood] || 0) + count;
      });
    });
    
    return Object.entries(distribution).map(([mood, count]) => ({
      name: mood,
      value: count,
      color: {
        happy: '#10B981',
        sad: '#3B82F6',
        anxious: '#8B5CF6',
        excited: '#F59E0B',
        calm: '#6B7280',
        grateful: '#84CC16'
      }[mood] || '#6B7280'
    }));
  }, [mockTrends]);

  const aiInsight = generateMoodInsight(mockTrends);

  return (
    <div className="min-h-screen bg-black relative">
      {/* Background sparkles */}
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          id="trends-sparkles"
          background="transparent"
          minSize={0.3}
          maxSize={0.6}
          particleDensity={60}
          className="w-full h-full"
          particleColor="#8b5cf6"
          speed={0.2}
        />
      </div>

      <div className="relative z-10">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Mood Trends & Insights 📊
            </h1>
            <p className="text-gray-300">Discover patterns in your emotional journey</p>
          </div>

          {/* AI Insight Card */}
          <Card className="mb-8 bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-300">
                <Brain className="w-5 h-5" />
                AI Insight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-4 bg-black/30 rounded-lg">
                <Lightbulb className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                <p className="text-gray-200">{aiInsight}</p>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-black/50 backdrop-blur-sm border border-purple-500/20">
              <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:text-white">Overview</TabsTrigger>
              <TabsTrigger value="detailed" className="text-gray-300 data-[state=active]:text-white">Detailed Analysis</TabsTrigger>
              <TabsTrigger value="patterns" className="text-gray-300 data-[state=active]:text-white">Patterns</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-black/50 backdrop-blur-sm border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Confidence Levels
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #6B46C1',
                            borderRadius: '8px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="confidence" 
                          stroke="#8B5CF6" 
                          strokeWidth={3}
                          dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-black/50 backdrop-blur-sm border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white">Mood Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={moodDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                        >
                          {moodDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #6B46C1',
                            borderRadius: '8px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="detailed" className="space-y-6">
              <Card className="bg-black/50 backdrop-blur-sm border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Journal Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #6B46C1',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="entries" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="patterns" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-black/50 backdrop-blur-sm border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Most Active Day</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-purple-400">Tuesday</p>
                    <p className="text-gray-400 text-sm">You journal most on Tuesdays</p>
                  </CardContent>
                </Card>

                <Card className="bg-black/50 backdrop-blur-sm border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Streak</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-emerald-400">7 days</p>
                    <p className="text-gray-400 text-sm">Current logging streak</p>
                  </CardContent>
                </Card>

                <Card className="bg-black/50 backdrop-blur-sm border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Challenges</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-yellow-400">5/7</p>
                    <p className="text-gray-400 text-sm">Completed this week</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default MoodTrends;
