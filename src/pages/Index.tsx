
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated (mock auth)
    const isAuthenticated = localStorage.getItem('mockAuth') === 'true';
    
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      // Navigate to landing page instead of direct login
      navigate('/landing');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
    </div>
  );
};

export default Index;
