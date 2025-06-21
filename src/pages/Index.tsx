
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";

const Index = () => {
  // Mock auth state - replace with real auth later
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated (mock check)
    const mockAuthCheck = localStorage.getItem('mockAuth');
    if (mockAuthCheck === 'true') {
      setIsAuthenticated(true);
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return <Login />;
  }

  return <Dashboard />;
};

export default Index;
