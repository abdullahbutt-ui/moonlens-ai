import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Mail, 
  Calendar, 
  Camera, 
  Moon, 
  Sun, 
  Heart,
  ArrowLeft,
  Sparkles,
  Settings,
  LogOut,
  Save
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import MobileNavigation from '@/components/layout/MobileNavigation';
import { toast } from 'sonner';

const EnhancedProfile = () => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userMetadata = user?.user_metadata || {};

  const [formData, setFormData] = useState({
    fullName: userMetadata.full_name || '',
    email: user?.email || '',
    dateOfBirth: userMetadata.dob || '',
    bio: userMetadata.bio || '',
    interests: userMetadata.interests || ['Mindfulness', 'Meditation', 'Self-care'],
    moodSensitivity: [userMetadata.mood_sensitivity || 5]
  });

  const [profileImage, setProfileImage] = useState<string | null>(userMetadata.avatar_url || null);
  const [isSaving, setIsSaving] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
          dob: formData.dateOfBirth,
          bio: formData.bio,
          interests: formData.interests,
          mood_sensitivity: formData.moodSensitivity[0],
          avatar_url: profileImage,
          profile_updated_at: new Date().toISOString()
        }
      });

      if (error) throw error;
      
      toast.success("Profile updated successfully! ✨");
      
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully! 👋");
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  const getUserInitials = () => {
    if (formData.fullName) {
      return formData.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <Navbar />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-purple-600 dark:text-purple-400"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Profile
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-gray-600 dark:text-gray-400"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-6 pb-24 md:max-w-2xl">
        {/* Profile Picture Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="relative inline-block">
            <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white shadow-lg">
              <AvatarImage src={profileImage || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-2xl">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Camera className="w-4 h-4" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            {formData.fullName || 'Your Name'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-2">{user?.email}</p>
          <div className="flex justify-center gap-2">
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
              <Heart className="w-3 h-3 mr-1" />
              Mindful Explorer
            </Badge>
          </div>
        </motion.div>

        {/* Profile Form */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
                  <User className="w-5 h-5 text-purple-500" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fullName" className="text-gray-700 dark:text-gray-300">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="mt-1 rounded-2xl border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="mt-1 rounded-2xl border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 opacity-60"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="bio" className="text-gray-700 dark:text-gray-300">Bio</Label>
                  <Input
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="mt-1 rounded-2xl border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50"
                    placeholder="Tell us about yourself"
                  />
                </div>
                <div>
                  <Label htmlFor="dob" className="text-gray-700 dark:text-gray-300">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="mt-1 rounded-2xl border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
                  <Heart className="w-5 h-5 text-purple-500" />
                  Mood Sensitivity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300 mb-2 block">
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
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <span>Less sensitive</span>
                      <span>Very sensitive</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Settings */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
                  <Settings className="w-5 h-5 text-purple-500" />
                  Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {theme === 'light' ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-blue-500" />}
                    <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
                  </div>
                  <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-2xl shadow-lg"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                onClick={handleSignOut}
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 font-semibold py-3 rounded-2xl"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNavigation />
    </div>
  );
};

export default EnhancedProfile;
