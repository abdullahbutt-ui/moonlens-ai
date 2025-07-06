
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import MoodSplash from "./pages/MoodSplash";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import MoodTrends from "./pages/MoodTrends";
import MoodWall from "./pages/MoodWall";
import DailyChallenge from "./pages/DailyChallenge";
import FutureSelfLetter from "./pages/FutureSelfLetter";
import LiveEmotionDetection from "./pages/LiveEmotionDetection";
import MoodJournalPage from "./pages/MoodJournalPage";
import SoundCenter from "./pages/SoundCenter";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import NewDashboard from '@/pages/NewDashboard';
import EnhancedProfile from '@/pages/EnhancedProfile';

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <Toaster />
            <Sonner />
            <TooltipProvider>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/dashboard" element={<NewDashboard />} />
                <Route path="/old-dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<EnhancedProfile />} />
                <Route path="/live-emotion-detection" element={<LiveEmotionDetection />} />
                <Route path="/mood-journal" element={<MoodJournalPage />} />
                <Route path="/mood-trends" element={<MoodTrends />} />
                <Route path="/future-self-letter" element={<FutureSelfLetter />} />
                <Route path="/mood-wall" element={<MoodWall />} />
                <Route path="/sound-center" element={<SoundCenter />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/daily-challenge" element={<DailyChallenge />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </QueryClientProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
