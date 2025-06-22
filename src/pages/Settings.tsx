
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  ArrowLeft, 
  Activity, 
  Camera, 
  Mic, 
  Info, 
  Download, 
  Trash2,
  Shield,
  Clock
} from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState({
    camera: true,
    microphone: true
  });

  const handlePermissionToggle = async (type: 'camera' | 'microphone') => {
    try {
      if (type === 'camera') {
        if (!permissions.camera) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach(track => track.stop());
          setPermissions(prev => ({ ...prev, camera: true }));
          toast.success("Camera access enabled");
        } else {
          setPermissions(prev => ({ ...prev, camera: false }));
          toast.info("Camera access disabled");
        }
      } else {
        if (!permissions.microphone) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(track => track.stop());
          setPermissions(prev => ({ ...prev, microphone: true }));
          toast.success("Microphone access enabled");
        } else {
          setPermissions(prev => ({ ...prev, microphone: false }));
          toast.info("Microphone access disabled");
        }
      }
    } catch (error) {
      console.error("Permission error:", error);
      toast.error(`Failed to access ${type}. Please check browser settings.`);
    }
  };

  const handleExportData = () => {
    // Mock export functionality
    toast.success("Emotion history exported successfully!");
  };

  const handleDeleteAccount = () => {
    // Mock delete functionality with confirmation
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      toast.error("Account deletion is not yet implemented. Contact support if needed.");
    }
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
              <SettingsIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-gray-600">Manage your app preferences and data</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Activity Summary */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-purple-600" />
                <span>Activity Summary</span>
              </CardTitle>
              <CardDescription>Your MoodLens usage overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl">
                  <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-700">2h 34m</p>
                  <p className="text-sm text-purple-600">Time spent this week</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl">
                  <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-700">12</p>
                  <p className="text-sm text-blue-600">Sessions this week</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-100 to-green-50 rounded-xl">
                  <span className="text-2xl">😊</span>
                  <p className="text-2xl font-bold text-green-700 mt-2">Happy</p>
                  <p className="text-sm text-green-600">Most common mood</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Device Permissions */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <span>Device Permissions</span>
              </CardTitle>
              <CardDescription>Manage camera and microphone access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Camera className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-800">Camera Access</p>
                    <p className="text-sm text-gray-600">Required for emotion detection</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={permissions.camera ? "default" : "secondary"}>
                    {permissions.camera ? "Enabled" : "Disabled"}
                  </Badge>
                  <Switch
                    checked={permissions.camera}
                    onCheckedChange={() => handlePermissionToggle('camera')}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Mic className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-800">Microphone Access</p>
                    <p className="text-sm text-gray-600">For enhanced emotion analysis</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={permissions.microphone ? "default" : "secondary"}>
                    {permissions.microphone ? "Enabled" : "Disabled"}
                  </Badge>
                  <Switch
                    checked={permissions.microphone}
                    onCheckedChange={() => handlePermissionToggle('microphone')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* App Information */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="h-5 w-5 text-purple-600" />
                <span>App Information</span>
              </CardTitle>
              <CardDescription>About MoodLens and privacy policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-purple-50 to-white rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-2">Version</h4>
                  <p className="text-gray-600">MoodLens v1.0.0</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-2">Privacy</h4>
                  <p className="text-gray-600">All data processed locally</p>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-green-50 to-white rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-2">About MoodLens</h4>
                <p className="text-gray-600">
                  AI-powered emotion tracking that helps you understand and improve your mental wellbeing. 
                  Your privacy is our priority - all emotion detection happens on your device.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Controls */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5 text-purple-600" />
                <span>Data Controls</span>
              </CardTitle>
              <CardDescription>Export your data or manage your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleExportData}
                  variant="outline"
                  className="flex-1 rounded-xl border-purple-200 hover:bg-purple-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Emotion History
                </Button>
                
                <Button
                  onClick={handleDeleteAccount}
                  variant="destructive"
                  className="flex-1 rounded-xl"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 text-center">
                Data exports include your mood history and preferences. Account deletion is permanent and cannot be undone.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
