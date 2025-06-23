
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Mail, ArrowLeft, Send, Check } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface PasswordResetProps {
  onBackToLogin: () => void;
}

const PasswordReset = ({ onBackToLogin }: PasswordResetProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const isEmailValid = email.includes("@") && email.includes(".");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("Password reset attempt:", { email });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSubmitted(true);
      toast.success("Check your inbox for a gentle reminder!");
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("We couldn't find that one — want to try again?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Muted Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-slate-200/40 via-teal-200/20 to-cyan-200/40 dark:from-slate-800/40 dark:via-teal-900/20 dark:to-cyan-900/40"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(148, 163, 184, 0.4), rgba(45, 212, 191, 0.2), rgba(103, 232, 249, 0.4))",
              "linear-gradient(45deg, rgba(45, 212, 191, 0.4), rgba(103, 232, 249, 0.2), rgba(148, 163, 184, 0.4))",
              "linear-gradient(45deg, rgba(103, 232, 249, 0.4), rgba(148, 163, 184, 0.2), rgba(45, 212, 191, 0.4))"
            ]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Gentle Floating Elements */}
        <motion.div
          className="absolute top-24 right-24 w-20 h-20 bg-white/8 rounded-full blur-xl"
          animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-32 left-16 w-32 h-32 bg-teal-300/10 rounded-full blur-xl"
          animate={{ y: [0, -25, 0], x: [0, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-8"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.03, 1],
                rotate: [0, 1, -1, 0] 
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
              <Brain className="h-14 w-14 text-slate-600 dark:text-slate-400 mx-auto mb-4" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              MoodLens
            </h1>
          </motion.div>

          {/* Password Reset Card */}
          <Card className="bg-white/25 dark:bg-gray-900/25 backdrop-blur-md border-white/30 dark:border-gray-700/30 shadow-2xl">
            <CardHeader className="text-center pb-4">
              {!isSubmitted ? (
                <>
                  <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                    Let's help you get back in
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                    Enter your email and we'll send you a gentle way back
                  </CardDescription>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="mx-auto mb-4"
                  >
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <Send className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                  </motion.div>
                  <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                    Check your inbox
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                    We've sent a little reminder to your inbox 💌
                  </CardDescription>
                </>
              )}
            </CardHeader>
            <CardContent>
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email Field */}
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Label htmlFor="reset-email" className="text-gray-700 dark:text-gray-200 font-medium">
                      Your email address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        className={`pl-10 bg-white/50 dark:bg-gray-800/50 border-gray-300/50 dark:border-gray-600/50 text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-300 ${
                          focusedField === "email" ? "ring-2 ring-teal-400/50 scale-[1.02]" : ""
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
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-slate-600 to-teal-600 hover:from-slate-700 hover:to-teal-700 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                      disabled={isLoading || !isEmailValid}
                    >
                      <motion.span
                        animate={isLoading ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 1, repeat: isLoading ? Infinity : 0 }}
                        className="flex items-center gap-2"
                      >
                        <Send className="h-4 w-4" />
                        {isLoading ? "Sending magic link..." : "Send Me the Magic Link"}
                      </motion.span>
                    </Button>
                  </motion.div>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <Button 
                    onClick={onBackToLogin}
                    className="w-full bg-gradient-to-r from-slate-600 to-teal-600 hover:from-slate-700 hover:to-teal-700 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Login
                  </Button>
                </motion.div>
              )}

              {/* Back to Login Link */}
              {!isSubmitted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 text-center"
                >
                  <button
                    onClick={onBackToLogin}
                    className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to login
                  </button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PasswordReset;
