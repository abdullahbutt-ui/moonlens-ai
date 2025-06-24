
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Brain, User, Settings, LogOut, TrendingUp, Users, ArrowLeft, Sun, Moon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

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
      default: return '';
    }
  };

  return (
    <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center py-3 sm:py-0 sm:h-16 gap-4 sm:gap-0">
          <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-start">
            {isSubPage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            )}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                MoodLens
              </span>
            </div>
            {isSubPage && (
              <span className="text-lg font-medium text-muted-foreground hidden sm:block">
                {getPageTitle()}
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-4 w-full sm:w-auto">
            {/* Theme Toggle */}
            <div className="flex items-center space-x-2 order-last sm:order-none">
              <Sun className="h-4 w-4" />
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
                aria-label="Toggle dark mode"
              />
              <Moon className="h-4 w-4" />
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/mood-trends')}
              className="flex items-center space-x-1"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Trends</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/mood-wall')}
              className="flex items-center space-x-1"
            >
              <Users className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Community</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/settings')}
              className="flex items-center space-x-1"
            >
              <Settings className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Settings</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/profile')}
              className="flex items-center space-x-1"
            >
              <User className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Profile</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSignOut}
              className="flex items-center space-x-1"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
