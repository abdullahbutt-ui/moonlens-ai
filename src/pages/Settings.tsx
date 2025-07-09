import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import { Bell, Lock, Palette, Clock, Mail, Phone, MessageSquare, Shield, Camera, Mic, Info, ExternalLink, Heart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [micPermission, setMicPermission] = useState(false);
  const [dataCollection, setDataCollection] = useState(true);
  const handlePermissionRequest = async (type: 'camera' | 'microphone') => {
    try {
      if (type === 'camera') {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
        stream.getTracks().forEach(track => track.stop());
        setCameraPermission(true);
        toast.success("Camera access granted! 📷");
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true
        });
        stream.getTracks().forEach(track => track.stop());
        setMicPermission(true);
        toast.success("Microphone access granted! 🎤");
      }
    } catch (error) {
      toast.error(`${type === 'camera' ? 'Camera' : 'Microphone'} permission denied`);
    }
  };
  const settingSections = [{
    title: "Notifications",
    icon: Bell,
    items: [{
      label: "Push Notifications",
      description: "Get gentle reminders and insights",
      value: notifications,
      onChange: setNotifications
    }, {
      label: "Daily Check-ins",
      description: "Remind me to log my mood",
      value: dailyReminders,
      onChange: setDailyReminders
    }]
  }, {
    title: "Privacy & Permissions",
    icon: Shield,
    items: [{
      label: "Camera Access",
      description: "For emotion detection features",
      value: cameraPermission,
      onChange: () => handlePermissionRequest('camera'),
      isPermission: true
    }, {
      label: "Microphone Access",
      description: "For voice emotion analysis",
      value: micPermission,
      onChange: () => handlePermissionRequest('microphone'),
      isPermission: true
    }, {
      label: "Anonymous Analytics",
      description: "Help improve the app experience",
      value: dataCollection,
      onChange: setDataCollection
    }]
  }];
  const supportItems = [{
    icon: Info,
    label: "About Moodsify",
    description: "Version 1.0.0 • Made with ❤️",
    action: () => toast.info("Moodsify v1.0.0 - Your mental wellness companion")
  }, {
    icon: MessageSquare,
    label: "Send Feedback",
    description: "Help us improve your experience",
    action: () => window.open('mailto:feedback@moodsify.app?subject=App Feedback')
  }, {
    icon: Phone,
    label: "Contact Support",
    description: "Get help when you need it",
    action: () => window.open('mailto:support@moodsify.app?subject=Support Request')
  }, {
    icon: ExternalLink,
    label: "Privacy Policy",
    description: "How we protect your data",
    action: () => window.open('/privacy-policy', '_blank')
  }, {
    icon: ExternalLink,
    label: "Terms of Service",
    description: "Our terms and conditions",
    action: () => window.open('/terms-of-service', '_blank')
  }];
  return <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <Navbar />
      
      <main className="max-w-2xl mx-auto px-4 py-8 pt-24">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">Settings </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Customize your Moodsify experience
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Settings Sections */}
          {settingSections.map((section, sectionIndex) => <motion.div key={section.title} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: sectionIndex * 0.1
        }}>
              <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-purple-200/50 dark:border-purple-500/20 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
                    <section.icon className="w-5 h-5" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.items.map((item, itemIndex) => <div key={itemIndex} className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {item.label}
                          </h3>
                          {item.isPermission && <Badge variant="secondary" className="text-xs">
                              {item.value ? 'Granted' : 'Required'}
                            </Badge>}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {item.description}
                        </p>
                      </div>
                      {item.isPermission ? <Button size="sm" variant={item.value ? "secondary" : "default"} onClick={item.onChange as () => void} disabled={item.value} className="ml-4">
                          {item.value ? 'Granted' : 'Allow'}
                        </Button> : <Switch checked={item.value} onCheckedChange={item.onChange as (checked: boolean) => void} />}
                    </div>)}
                </CardContent>
              </Card>
            </motion.div>)}

          {/* Time Spent Stats */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.3
        }}>
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-purple-200/50 dark:border-purple-500/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
                  <Clock className="w-5 h-5" />
                  Your Wellness Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">15m</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Today</div>
                  </div>
                  <div className="text-center p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
                    <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">2.5h</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">This week</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Support & Legal */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.4
        }}>
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-purple-200/50 dark:border-purple-500/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
                  <Heart className="w-5 h-5" />
                  Support & Legal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {supportItems.map((item, index) => <button key={index} onClick={item.action} className="w-full p-4 text-left bg-white/50 dark:bg-gray-800/50 rounded-xl hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 group">
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {item.label}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </button>)}
              </CardContent>
            </Card>
          </motion.div>

          {/* Rate the App */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.5
        }}>
            <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 border-purple-200/50 dark:border-purple-500/20 shadow-lg">
              <CardContent className="p-6 text-center">
                <Star className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  Loving Moodsify? ✨
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Your review helps others discover their wellness journey
                </p>
                <Button onClick={() => toast.success("Thank you! This would redirect to the app store 🌟")} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl">
                  Rate on App Store
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>;
};
export default Settings;