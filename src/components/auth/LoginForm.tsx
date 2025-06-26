import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Mail, Lock, Eye, EyeOff, Check } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

interface LoginFormProps {
  onToggleMode: () => void;
  onForgotPassword?: () => void;
}

const LoginForm = ({ onToggleMode, onForgotPassword }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  // Simple validation states
  const isEmailValid = email.includes("@") && email.includes(".");
  const isPasswordValid = password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error("Login error:", error);
        
        if (error.message.includes('Invalid login credentials')) {
          toast.error("Invalid email or password. Please try again.");
        } else if (error.message.includes('Email not confirmed')) {
          toast.error("Please verify your email before signing in. Check your inbox for a confirmation link.");
        } else {
          toast.error("Unable to sign in. Please try again.");
        }
      } else {
        toast.success("Welcome back! We're glad you're here.");
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("We couldn't log you in. Let's try that again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-indigo-200/50 via-purple-200/30 to-blue-200/50 dark:from-indigo-900/50 dark:via-purple-900/30 dark:to-blue-900/50"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(99, 102, 241, 0.5), rgba(139, 92, 246, 0.3), rgba(59, 130, 246, 0.5))",
              "linear-gradient(45deg, rgba(139, 92, 246, 0.5), rgba(59, 130, 246, 0.3), rgba(99, 102, 241, 0.5))",
              "linear-gradient(45deg, rgba(59, 130, 246, 0.5), rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.5))"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Floating Elements */}
        <motion.div
          className="absolute top-32 left-16 w-28 h-28 bg-white/10 rounded-full blur-xl"
          animate={{ y: [0, 25, 0], x: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-40 right-20 w-36 h-36 bg-purple-300/15 rounded-full blur-xl"
          animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Animated Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-8"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0] 
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Brain className="h-16 w-16 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              MoodLens
            </h1>
            <p className="text-indigo-600/80 dark:text-indigo-300/80">AI-powered emotion tracking</p>
          </motion.div>

          {/* Glassmorphism Card */}
          <Card className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-md border-white/30 dark:border-gray-700/30 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                Welcome back
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                Let's check in with how you're feeling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-200 font-medium">
                    Your email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      className={`pl-10 bg-white/50 dark:bg-gray-800/50 border-gray-300/50 dark:border-gray-600/50 text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-300 ${
                        focusedField === "email" ? "ring-2 ring-indigo-400/50 scale-[1.02]" : ""
                      }`}
                      required
                      disabled={isLoading}
                    />
                    {isEmailValid && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute right-3 top-3"
                      >
                        <Check className="h-4 w-4 text-green-500" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-200 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      className={`pl-10 pr-10 bg-white/50 dark:bg-gray-800/50 border-gray-300/50 dark:border-gray-600/50 text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-300 ${
                        focusedField === "password" ? "ring-2 ring-indigo-400/50 scale-[1.02]" : ""
                      }`}
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    {isPasswordValid && !showPassword && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute right-10 top-3"
                      >
                        <Check className="h-4 w-4 text-green-500" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-3"
                >
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                    disabled={isLoading}
                  >
                    <motion.span
                      animate={isLoading ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 1, repeat: isLoading ? Infinity : 0 }}
                    >
                      {isLoading ? "Signing you in..." : "Log In to MoodLens"}
                    </motion.span>
                  </Button>
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                    Your emotions are safe here
                  </p>
                </motion.div>
              </form>

              {/* Additional Links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-6 space-y-4"
              >
                <div className="text-center">
                  <button
                    onClick={onForgotPassword}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors underline decoration-dotted underline-offset-4"
                  >
                    Forgot password?
                  </button>
                </div>
                
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    Don't have an account?{" "}
                    <button
                      onClick={onToggleMode}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
                    >
                      Start here
                    </button>
                  </p>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginForm;
