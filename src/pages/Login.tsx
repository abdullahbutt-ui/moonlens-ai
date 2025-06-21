
import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);

  const toggleMode = () => {
    setIsSignup(!isSignup);
  };

  return isSignup ? (
    <SignupForm onToggleMode={toggleMode} />
  ) : (
    <LoginForm onToggleMode={toggleMode} />
  );
};

export default Login;
