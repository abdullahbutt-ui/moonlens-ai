
import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import PasswordReset from "@/components/auth/PasswordReset";

const Login = () => {
  const [currentView, setCurrentView] = useState<"login" | "signup" | "reset">("login");

  const toggleMode = () => {
    setCurrentView(currentView === "login" ? "signup" : "login");
  };

  const showPasswordReset = () => {
    setCurrentView("reset");
  };

  const backToLogin = () => {
    setCurrentView("login");
  };

  if (currentView === "signup") {
    return <SignupForm onToggleMode={toggleMode} />;
  }

  if (currentView === "reset") {
    return <PasswordReset onBackToLogin={backToLogin} />;
  }

  return (
    <LoginForm 
      onToggleMode={toggleMode} 
      onForgotPassword={showPasswordReset}
    />
  );
};

export default Login;
