import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Sun, Moon, User, Settings, LogOut, ArrowLeft, Home, Brain } from "lucide-react";
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    theme,
    toggleTheme
  } = useTheme();
  const { signOut } = useAuth();
  const { user } = useUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };
  const isOnDashboard = location.pathname === '/dashboard';
  const showBackButton = !isOnDashboard && location.pathname !== '/login' && location.pathname !== '/landing' && location.pathname !== '/' && user;
  return <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Back button */}
          <div className="flex items-center space-x-4">
            {showBackButton ? <Button variant="ghost" size="sm" onClick={handleBackToDashboard} className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <Home className="h-4 w-4 sm:hidden" />
              </Button> : <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/dashboard')}>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Moodsify</span>
                </div>
              </div>}
          </div>

          {/* Right side - Theme toggle and User menu */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>

            {/* User Menu */}
            {user && <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Avatar className="h-10 w-10 border-2 border-purple-200 dark:border-purple-500/30">
                      <AvatarImage src={user?.imageUrl || undefined} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm">
                        {user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : user?.primaryEmailAddress?.emailAddress?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user?.fullName && <p className="font-medium text-gray-900 dark:text-white">
                          {user.fullName}
                        </p>}
                      <p className="w-[200px] truncate text-sm text-gray-500 dark:text-gray-400">
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20" disabled={isLoggingOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>}
          </div>
        </div>
      </div>
    </nav>;
};
export default Navbar;