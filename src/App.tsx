
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
import MoodTrendsEnhanced from "./pages/MoodTrendsEnhanced";
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
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import ContactSupport from '@/pages/ContactSupport';
import EmailVerify from '@/pages/EmailVerify';
import EmailConfirmed from '@/pages/EmailConfirmed';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

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
                <Route path="/mood-splash" element={<MoodSplash />} />
                <Route path="/login" element={<Login />} />
                <Route path="/verify" element={<EmailVerify />} />
                <Route path="/email-confirmed" element={<EmailConfirmed />} />
                <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><NewDashboard /></ProtectedRoute>} />
                <Route path="/old-dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><EnhancedProfile /></ProtectedRoute>} />
                <Route path="/live-emotion-detection" element={<ProtectedRoute><LiveEmotionDetection /></ProtectedRoute>} />
                <Route path="/mood-journal" element={<ProtectedRoute><MoodJournalPage /></ProtectedRoute>} />
                <Route path="/mood-trends" element={<ProtectedRoute><MoodTrendsEnhanced /></ProtectedRoute>} />
                <Route path="/future-self-letter" element={<ProtectedRoute><FutureSelfLetter /></ProtectedRoute>} />
                <Route path="/mood-wall" element={<ProtectedRoute><MoodWall /></ProtectedRoute>} />
                <Route path="/sound-center" element={<ProtectedRoute><SoundCenter /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/daily-challenge" element={<ProtectedRoute><DailyChallenge /></ProtectedRoute>} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/contact-support" element={<ContactSupport />} />
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
