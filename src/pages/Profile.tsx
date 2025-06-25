
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Save, 
  ArrowLeft, 
  Camera, 
  Heart,
  Brain,
  Target,
  Trophy,
  Headphones,
  Bot,
  Wind,
  TrendingUp,
  Shield,
  Palette,
  Fingerprint,
  Lock,
  Settings
} from "lucide-react";
import { toast } from "sonner";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [profileData, setProfileData] = useState({
    username: "mooduser123",
    fullName: "Alex Johnson",
    bio: "Finding balance through mindful living 🌸",
    dateOfBirth: "1995-03-15",
    profilePicture: null as string | null,
    theme: "calm",
    moodCheckFrequency: "real-time",
    emailNotifications: true,
    pushNotifications: false,
    biometricLogin: false
  });

  const [goals, setGoals] = useState([
    { id: '1', title: 'Daily Check-in', progress: 85, target: 7, current: 6, icon: Heart },
    { id: '2', title: 'Meditation Sessions', progress: 60, target: 10, current: 6, icon: Brain },
    { id: '3', title: 'Weekly Streak', progress: 100, target: 1, current: 1, icon: Trophy }
  ]);

  const moodData = [
    { day: 'Mon', mood: 4 },
    { day: 'Tue', mood: 3 },
    { day: 'Wed', mood: 5 },
    { day: 'Thu', mood: 3 },
    { day: 'Fri', mood: 4 },
    { day: 'Sat', mood: 5 },
    { day: 'Sun', mood: 4 }
  ];

  const favoriteFeatures = [
    { name: 'AI Mood Coach', icon: Bot, uses: 15, color: 'bg-purple-100 text-purple-600' },
    { name: 'Sound Center', icon: Headphones, uses: 12, color: 'bg-blue-100 text-blue-600' },
    { name: 'Breathing Exercise', icon: Wind, uses: 8, color: 'bg-green-100 text-green-600' },
    { name: 'Mood Trends', icon: TrendingUp, uses: 5, color: 'bg-orange-100 text-orange-600' }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({ ...prev, profilePicture: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getThemeGradient = () => {
    switch (profileData.theme) {
      case 'calm': return 'from-blue-50 via-purple-50 to-pink-50';
      case 'focus': return 'from-gray-50 via-slate-50 to-zinc-50';
      case 'nature': return 'from-green-50 via-emerald-50 to-teal-50';
      case 'dark': return 'from-gray-900 via-slate-900 to-black';
      default: return 'from-blue-50 via-purple-50 to-pink-50';
    }
  };

  const getMoodEmoji = () => {
    const avgMood = moodData.reduce((sum, d) => sum + d.mood, 0) / moodData.length;
    if (avgMood >= 4.5) return '😊';
    if (avgMood >= 3.5) return '😌';
    return '😐';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getThemeGradient()} transition-all duration-500`}>
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4 text-purple-600 hover:text-purple-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Your Profile
              </h1>
              <p className="text-gray-600">Manage your wellness journey</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-2">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'insights', label: 'Insights', icon: Brain },
            { id: 'goals', label: 'Goals', icon: Target },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 rounded-xl transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                  : 'hover:bg-gray-100'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{tab.label}</span>
            </Button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Profile Info Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-100 to-blue-100 pb-6">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                      <AvatarImage src={profileData.profilePicture || undefined} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-2xl">
                        {profileData.fullName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <label className="absolute -bottom-2 -right-2 bg-purple-600 rounded-full p-2 cursor-pointer hover:bg-purple-700 transition-colors">
                        <Camera className="h-4 w-4 text-white" />
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    )}
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2">
                      <h2 className="text-2xl font-bold text-gray-800">{profileData.fullName}</h2>
                      <span className="text-2xl">{getMoodEmoji()}</span>
                    </div>
                    <p className="text-gray-600 mb-2">@{profileData.username}</p>
                    <p className="text-sm text-gray-500 max-w-md">{profileData.bio}</p>
                    <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                        {profileData.theme} theme
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        7 day streak
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-gray-700 font-medium">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                      disabled={!isEditing}
                      className="rounded-xl border-purple-200 focus:border-purple-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-gray-700 font-medium">Bio</Label>
                    <Input
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      disabled={!isEditing}
                      className="rounded-xl border-purple-200 focus:border-purple-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="theme" className="text-gray-700 font-medium">Theme</Label>
                    <Select
                      value={profileData.theme}
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, theme: value }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="rounded-xl border-purple-200 focus:border-purple-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="calm">🌸 Calm</SelectItem>
                        <SelectItem value="focus">⚡ Focus</SelectItem>
                        <SelectItem value="nature">🌿 Nature</SelectItem>
                        <SelectItem value="dark">🌙 Dark</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Favorite Features */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-pink-500" />
                  Favorite Features
                </CardTitle>
                <CardDescription>Your most used wellness tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favoriteFeatures.map((feature) => (
                    <div key={feature.name} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className={`p-2 rounded-lg ${feature.color}`}>
                        <feature.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{feature.name}</p>
                        <p className="text-sm text-gray-500">{feature.uses} uses this week</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-6 animate-fade-in">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-purple-500" />
                  Mood Insights
                </CardTitle>
                <CardDescription>Your emotional journey this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">Weekly Mood Trend</h4>
                    <ChartContainer config={{ mood: { label: "Mood", color: "#8b5cf6" } }} className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={moodData}>
                          <XAxis dataKey="day" />
                          <YAxis domain={[1, 5]} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line type="monotone" dataKey="mood" stroke="#8b5cf6" strokeWidth={3} />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">Emotion Breakdown</h4>
                    <div className="space-y-3">
                      {[
                        { emotion: 'Happy', percentage: 40, emoji: '😊', color: 'bg-yellow-400' },
                        { emotion: 'Calm', percentage: 30, emoji: '😌', color: 'bg-blue-400' },
                        { emotion: 'Neutral', percentage: 20, emoji: '😐', color: 'bg-gray-400' },
                        { emotion: 'Sad', percentage: 10, emoji: '😢', color: 'bg-blue-300' }
                      ].map((item) => (
                        <div key={item.emotion} className="flex items-center space-x-3">
                          <span className="text-lg">{item.emoji}</span>
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">{item.emotion}</span>
                              <span className="text-gray-500">{item.percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.percentage}%` }}></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="space-y-6 animate-fade-in">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-green-500" />
                  Wellness Goals
                </CardTitle>
                <CardDescription>Track your progress towards better mental health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {goals.map((goal) => (
                    <div key={goal.id} className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <goal.icon className="h-5 w-5 text-purple-600" />
                          <h4 className="font-medium text-gray-800">{goal.title}</h4>
                        </div>
                        <Badge variant={goal.progress === 100 ? "default" : "secondary"}>
                          {goal.current}/{goal.target}
                        </Badge>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                      <p className="text-sm text-gray-500 mt-2">{goal.progress}% complete</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fade-in">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-blue-500" />
                  Security & Privacy
                </CardTitle>
                <CardDescription>Manage your account security and data preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Fingerprint className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-800">Biometric Login</p>
                      <p className="text-sm text-gray-600">Use Face ID or Touch ID</p>
                    </div>
                  </div>
                  <Switch
                    checked={profileData.biometricLogin}
                    onCheckedChange={(checked) => setProfileData(prev => ({ ...prev, biometricLogin: checked }))}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Lock className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-800">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive mood insights via email</p>
                    </div>
                  </div>
                  <Switch
                    checked={profileData.emailNotifications}
                    onCheckedChange={(checked) => setProfileData(prev => ({ ...prev, emailNotifications: checked }))}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl"
            >
              Edit Profile
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
