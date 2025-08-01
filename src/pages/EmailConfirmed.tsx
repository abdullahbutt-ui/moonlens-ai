import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const EmailConfirmed = () => {
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-green-200/60 via-blue-200/40 to-purple-200/60 dark:from-green-900/60 dark:via-blue-900/40 dark:to-purple-900/60"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(34, 197, 94, 0.6), rgba(59, 130, 246, 0.4), rgba(147, 51, 234, 0.6))",
              "linear-gradient(45deg, rgba(59, 130, 246, 0.6), rgba(147, 51, 234, 0.4), rgba(34, 197, 94, 0.6))",
              "linear-gradient(45deg, rgba(147, 51, 234, 0.6), rgba(34, 197, 94, 0.4), rgba(59, 130, 246, 0.6))"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <Card className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-md border-white/30 dark:border-gray-700/30 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="mx-auto mb-4"
              >
                <div className="relative">
                  <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full border-2 border-green-400"
                  />
                </div>
              </motion.div>
              <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                🎉 Email Verified!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="space-y-3">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-lg text-gray-700 dark:text-gray-300"
                >
                  Welcome to Moodsify! 🌟
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-gray-600 dark:text-gray-400"
                >
                  Your email has been successfully verified. You're all set to start your emotional wellness journey!
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
              >
                <div className="flex items-center justify-center space-x-2 text-green-700 dark:text-green-300">
                  <ArrowRight className="h-5 w-5" />
                  <span className="font-medium">
                    Redirecting to dashboard in {countdown} seconds...
                  </span>
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                onClick={() => navigate('/dashboard')}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors underline decoration-dotted underline-offset-4"
              >
                Go to dashboard now
              </motion.button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default EmailConfirmed;