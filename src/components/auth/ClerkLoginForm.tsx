import React from "react";
import { SignIn } from "@clerk/clerk-react";
import { motion } from "framer-motion";

const ClerkLoginForm = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-50 to-teal-100 dark:from-purple-900 dark:via-blue-900 dark:to-teal-900 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob dark:bg-purple-700"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 dark:bg-blue-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 dark:bg-teal-700"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2"
          >
            Moodsify
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-gray-600 dark:text-gray-400"
          >
            Your AI-powered emotional wellness companion
          </motion.p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: 
                  'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-sm normal-case',
                card: 'bg-transparent shadow-none',
                headerTitle: 'text-2xl font-bold text-gray-900 dark:text-white',
                headerSubtitle: 'text-gray-600 dark:text-gray-400',
                socialButtonsBlockButton: 
                  'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
                formFieldInput: 
                  'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white',
                formFieldLabel: 'text-gray-700 dark:text-gray-300',
                dividerLine: 'bg-gray-200 dark:bg-gray-700',
                dividerText: 'text-gray-500 dark:text-gray-400',
                footerActionLink: 'text-purple-600 hover:text-purple-700',
              }
            }}
            redirectUrl="/dashboard"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default ClerkLoginForm;