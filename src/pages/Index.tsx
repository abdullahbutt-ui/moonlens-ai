
import { useState } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";

const Index = () => {
  // Mock auth state - replace with real auth later
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <Login />;
  }

  return <Dashboard />;
};

export default Index;
