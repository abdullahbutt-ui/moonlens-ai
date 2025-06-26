
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
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/landing" element={<Landing />} />
              <Route path="/mood-splash" element={<MoodSplash />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/live-emotion-detection" element={<LiveEmotionDetection />} />
              <Route path="/mood-journal" element={<MoodJournalPage />} />
              <Route path="/mood-trends" element={<MoodTrends />} />
              <Route path="/mood-wall" element={<MoodWall />} />
              <Route path="/daily-challenge" element={<DailyChallenge />} />
              <Route path="/future-self-letter" element={<FutureSelfLetter />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
