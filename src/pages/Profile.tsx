
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { User, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Mock user data - replace with Supabase user data later
  const [profileData, setProfileData] = useState({
    username: "mooduser123",
    fullName: "Alex Johnson",
    dateOfBirth: "1995-03-15",
    moodCheckFrequency: "real-time",
    emailNotifications: true,
    pushNotifications: false
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call - replace with Supabase update later
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

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4 text-purple-600 hover:text-purple-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Your Profile
              </h1>
              <p className="text-gray-600">Manage your MoodLens account settings</p>
            </div>
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Personal Information</CardTitle>
            <CardDescription>
              Update your profile details and mood tracking preferences
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700 font-medium">Username</Label>
                <Input
                  id="username"
                  value={profileData.username}
                  onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                  disabled={!isEditing}
                  className="rounded-xl border-purple-200 focus:border-purple-400 transition-colors duration-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-700 font-medium">Full Name</Label>
                <Input
                  id="fullName"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                  disabled={!isEditing}
                  className="rounded-xl border-purple-200 focus:border-purple-400 transition-colors duration-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-gray-700 font-medium">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  disabled={!isEditing}
                  className="rounded-xl border-purple-200 focus:border-purple-400 transition-colors duration-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="frequency" className="text-gray-700 font-medium">Mood Check Frequency</Label>
                <Select
                  value={profileData.moodCheckFrequency}
                  onValueChange={(value) => setProfileData(prev => ({ ...prev, moodCheckFrequency: value }))}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="rounded-xl border-purple-200 focus:border-purple-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="real-time">Real-time</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Notification Preferences</h3>
              
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-800">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive mood insights via email</p>
                </div>
                <Switch
                  checked={profileData.emailNotifications}
                  onCheckedChange={(checked) => setProfileData(prev => ({ ...prev, emailNotifications: checked }))}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-800">Push Notifications</p>
                  <p className="text-sm text-gray-600">Get reminders and updates</p>
                </div>
                <Switch
                  checked={profileData.pushNotifications}
                  onCheckedChange={(checked) => setProfileData(prev => ({ ...prev, pushNotifications: checked }))}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-purple-100">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
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
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
