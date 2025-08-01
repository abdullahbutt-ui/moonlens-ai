import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const EmailVerify = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resendConfirmation, user } = useAuth();
  
  const email = searchParams.get('email') || '';

  // Check if user is already verified and redirect to dashboard
  useEffect(() => {
    if (user && user.email_confirmed_at) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleResendEmail = async () => {
    if (!email) {
      toast.error("No email address found. Please try signing up again.");
      navigate('/login');
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await resendConfirmation(email);
      
      if (error) {
        toast.error("Failed to resend verification email. Please try again.");
      } else {
        toast.success("Verification email sent! Please check your inbox.");
      }
    } catch (error) {
      toast.error("Failed to resend verification email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background elements */}
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
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <Card className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-md border-white/30 dark:border-gray-700/30 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Mail className="h-16 w-16 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
              </motion.div>
              <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                Please verify your email
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                We need to verify your email address before you can access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <p className="font-medium mb-1">Please confirm your email</p>
                  <p>
                    We've sent a verification link to {email ? <strong>{email}</strong> : 'your email address'}. 
                    Click the link to verify your account and start using Moodsify.
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={handleResendEmail}
                  variant="outline"
                  className="w-full"
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? "Sending..." : "Resend verification email"}
                </Button>
                
                <Button 
                  onClick={() => navigate('/login')}
                  variant="ghost"
                  className="w-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to login
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default EmailVerify;