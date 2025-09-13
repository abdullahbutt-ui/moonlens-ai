
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
import NewDashboard from '@/pages/NewDashboard';
import EnhancedProfile from '@/pages/EnhancedProfile';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import ContactSupport from '@/pages/ContactSupport';
import ClerkProtectedRoute from '@/components/auth/ClerkProtectedRoute';
import ClerkLoginForm from '@/components/auth/ClerkLoginForm';

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <Toaster />
          <Sonner />
          <TooltipProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/mood-splash" element={<MoodSplash />} />
                <Route path="/login" element={<ClerkLoginForm />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/dashboard" element={<ClerkProtectedRoute><NewDashboard /></ClerkProtectedRoute>} />
                <Route path="/old-dashboard" element={<ClerkProtectedRoute><Dashboard /></ClerkProtectedRoute>} />
                <Route path="/profile" element={<ClerkProtectedRoute><EnhancedProfile /></ClerkProtectedRoute>} />
                <Route path="/live-emotion-detection" element={<ClerkProtectedRoute><LiveEmotionDetection /></ClerkProtectedRoute>} />
                <Route path="/mood-journal" element={<ClerkProtectedRoute><MoodJournalPage /></ClerkProtectedRoute>} />
                <Route path="/mood-trends" element={<ClerkProtectedRoute><MoodTrendsEnhanced /></ClerkProtectedRoute>} />
                <Route path="/future-self-letter" element={<ClerkProtectedRoute><FutureSelfLetter /></ClerkProtectedRoute>} />
                <Route path="/mood-wall" element={<ClerkProtectedRoute><MoodWall /></ClerkProtectedRoute>} />
                <Route path="/sound-center" element={<ClerkProtectedRoute><SoundCenter /></ClerkProtectedRoute>} />
                <Route path="/settings" element={<ClerkProtectedRoute><Settings /></ClerkProtectedRoute>} />
                <Route path="/daily-challenge" element={<ClerkProtectedRoute><DailyChallenge /></ClerkProtectedRoute>} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/contact-support" element={<ContactSupport />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
