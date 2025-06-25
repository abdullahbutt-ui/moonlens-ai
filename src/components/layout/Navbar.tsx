
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Sun, Moon, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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

  const navItems = [
    { label: 'Daily Challenge', path: '/daily-challenge', emoji: '💭' },
    { label: 'Trends', path: '/mood-trends', emoji: '📊' },
    { label: 'Community', path: '/mood-wall', emoji: '👥' },
    { label: 'Settings', path: '/settings', emoji: '⚙️' },
    { label: 'Profile', path: '/profile', emoji: '👤' },
  ];

  return (
    <nav className={`border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'shadow-sm' : ''
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Left side - Back button and title */}
          <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
            {isSubPage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 p-2"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            )}
            {!isSubPage && (
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  MoodLens
                </span>
              </div>
            )}
            {isSubPage && (
              <span className="text-base sm:text-lg font-medium text-muted-foreground truncate">
                {getPageTitle()}
              </span>
            )}
          </div>
          
          {/* Right side - Theme toggle and navigation */}
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
              <>
                <div className="hidden lg:flex items-center gap-2">
                  {navItems.map((item) => (
                    <Button 
                      key={item.path}
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(item.path)}
                      className="hidden xl:flex items-center gap-1"
                    >
                      {item.emoji} {item.label}
                    </Button>
                  ))}
                </div>
                
                {/* Hamburger menu for medium screens */}
                <div className="lg:hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2"
                  >
                    {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {isMobileMenuOpen && !isSubPage && (
          <div className="lg:hidden border-t bg-background/95 backdrop-blur-sm">
            <div className="py-2 space-y-1">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start gap-2 px-4 py-2"
                >
                  {item.emoji} {item.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
