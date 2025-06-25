
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Sun, Moon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('mockAuth');
    navigate('/login');
  };

  const isSubPage = location.pathname !== '/dashboard';
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/mood-trends': return 'Mood Trends';
      case '/mood-wall': return 'Community Wall';
      case '/settings': return 'Settings';
      case '/profile': return 'Profile';
      case '/daily-challenge': return 'Daily Challenge';
      case '/live-emotion-detection': return 'Live Emotion Detection';
      case '/mood-journal': return 'Mood Journal';
      case '/future-self-letter': return 'Letter to Future Self';
      default: return '';
    }
  };

  return (
    <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Back button and title */}
          <div className="flex items-center space-x-4">
            {isSubPage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 p-2"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            )}
            {!isSubPage && (
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  MoodLens
                </span>
              </div>
            )}
            {isSubPage && (
              <span className="text-lg font-medium text-muted-foreground">
                {getPageTitle()}
              </span>
            )}
          </div>
          
          {/* Right side - Theme toggle and desktop navigation */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Toggle - always visible */}
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
                aria-label="Toggle dark mode"
              />
              <Moon className="h-4 w-4" />
            </div>
            
            {/* Desktop navigation - only show on dashboard */}
            {!isSubPage && (
              <div className="hidden md:flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/daily-challenge')}
                >
                  💭 Daily Challenge
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/mood-trends')}
                >
                  📊 Trends
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/mood-wall')}
                >
                  👥 Community
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/settings')}
                >
                  ⚙️ Settings
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/profile')}
                >
                  👤 Profile
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
