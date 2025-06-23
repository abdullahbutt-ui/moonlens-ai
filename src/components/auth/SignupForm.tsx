
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Mail, Lock, User, Check, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface SignupFormProps {
  onToggleMode: () => void;
}

const SignupForm = ({ onToggleMode }: SignupFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [greeting, setGreeting] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const navigate = useNavigate();

  // Validation states
  const isNameValid = name.length > 0;
  const isEmailValid = email.includes("@") && email.includes(".");
  const isPasswordValid = password.length >= 6;
  const isConfirmPasswordValid = confirmPassword === password && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("Signup attempt:", { name, email, password, greeting });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Your emotional space has been created! Welcome to MoodLens!");
      
      // Redirect to dashboard after successful signup
      navigate('/dashboard');
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-200/60 via-blue-200/40 to-teal-200/60 dark:from-purple-900/60 dark:via-blue-900/40 dark:to-teal-900/60"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(147, 51, 234, 0.6), rgba(59, 130, 246, 0.4), rgba(20, 184, 166, 0.6))",
              "linear-gradient(45deg, rgba(59, 130, 246, 0.6), rgba(20, 184, 166, 0.4), rgba(147, 51, 234, 0.6))",
              "linear-gradient(45deg, rgba(20, 184, 166, 0.6), rgba(147, 51, 234, 0.4), rgba(59, 130, 246, 0.6))"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-32 w-24 h-24 bg-purple-300/20 rounded-full blur-xl"
          animate={{ y: [0, -20, 0], x: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-32 left-1/3 w-40 h-40 bg-teal-300/15 rounded-full blur-xl"
          animate={{ y: [0, 25, 0], x: [0, 15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
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
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Brain className="h-16 w-16 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent mb-2">
              MoodLens
            </h1>
            <p className="text-purple-600/80 dark:text-purple-300/80">AI-powered emotion tracking</p>
          </motion.div>

          {/* Glassmorphism Card */}
          <Card className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-md border-white/30 dark:border-gray-700/30 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                Let's get to know you
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                Your thoughts and feelings deserve a safe space
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-200 font-medium">
                    What should we call you?
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your first name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      className={`pl-10 bg-white/50 dark:bg-gray-800/50 border-gray-300/50 dark:border-gray-600/50 text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-300 ${
                        focusedField === "name" ? "ring-2 ring-purple-400/50 scale-[1.02]" : ""
                      }`}
                      required
                    />
                    {isNameValid && (
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

                {/* Email Field */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-200 font-medium">
                    Your email address
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
                        focusedField === "email" ? "ring-2 ring-purple-400/50 scale-[1.02]" : ""
                      }`}
                      required
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
                  <p className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    We'll only use this to keep your account secure
                  </p>
                </motion.div>

                {/* Password Field */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-200 font-medium">
                    Create a password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      className={`pl-10 bg-white/50 dark:bg-gray-800/50 border-gray-300/50 dark:border-gray-600/50 text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-300 ${
                        focusedField === "password" ? "ring-2 ring-purple-400/50 scale-[1.02]" : ""
                      }`}
                      required
                    />
                    {isPasswordValid && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute right-3 top-3"
                      >
                        <Check className="h-4 w-4 text-green-500" />
                      </motion.div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    We'll keep this safe. Promise.
                  </p>
                </motion.div>

                {/* Confirm Password Field */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-200 font-medium">
                    Confirm your password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setFocusedField("confirmPassword")}
                      onBlur={() => setFocusedField(null)}
                      className={`pl-10 bg-white/50 dark:bg-gray-800/50 border-gray-300/50 dark:border-gray-600/50 text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-300 ${
                        focusedField === "confirmPassword" ? "ring-2 ring-purple-400/50 scale-[1.02]" : ""
                      }`}
                      required
                    />
                    {isConfirmPasswordValid && (
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

                {/* Optional Greeting Field */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Label htmlFor="greeting" className="text-gray-700 dark:text-gray-200 font-medium">
                    How would you like MoodLens to greet you? (optional)
                  </Label>
                  <Input
                    id="greeting"
                    type="text"
                    placeholder="e.g., Good morning sunshine!"
                    value={greeting}
                    onChange={(e) => setGreeting(e.target.value)}
                    onFocus={() => setFocusedField("greeting")}
                    onBlur={() => setFocusedField(null)}
                    className={`bg-white/50 dark:bg-gray-800/50 border-gray-300/50 dark:border-gray-600/50 text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-300 ${
                      focusedField === "greeting" ? "ring-2 ring-purple-400/50 scale-[1.02]" : ""
                    }`}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    Make it personal—we'll remember this for you
                  </p>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                    disabled={isLoading}
                  >
                    <motion.span
                      animate={isLoading ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 1, repeat: isLoading ? Infinity : 0 }}
                    >
                      {isLoading ? "Creating your emotional space..." : "Create My Space"}
                    </motion.span>
                  </Button>
                </motion.div>
              </form>

              {/* Support Links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-6 space-y-4"
              >
                <div className="text-center">
                  <button className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    <HelpCircle className="h-4 w-4 mr-1" />
                    Need help?
                  </button>
                </div>
                
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    Already have an account?{" "}
                    <button
                      onClick={onToggleMode}
                      className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
                    >
                      Welcome back
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

export default SignupForm;
