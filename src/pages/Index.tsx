
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SparklesPreviewColorful } from "@/components/ui/demo";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated (mock auth)
    const isAuthenticated = localStorage.getItem('mockAuth') === 'true';
    
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      // Add a delay and then navigate to login
      const timer = setTimeout(() => {
        navigate('/login');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen">
      <SparklesPreviewColorful />
    </div>
  );
};

export default Index;
