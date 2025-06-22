
import { Button } from "@/components/ui/button";
import { Brain, User, Settings, LogOut, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Mock sign out - replace with real auth later
    localStorage.removeItem('mockAuth');
    navigate('/login');
  };

  return (
    <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                MoodLens
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/mood-trends')}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Trends
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/settings')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/profile')}
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
