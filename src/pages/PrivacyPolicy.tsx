import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-purple-600 dark:text-purple-400"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Privacy Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
          <CardContent className="p-8 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Information We Collect
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                At Moodsify, we collect information you provide directly to us, such as:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                <li>Account information (email, name)</li>
                <li>Mood tracking data and journal entries</li>
                <li>App usage patterns and preferences</li>
                <li>Device information for app optimization</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                How We Use Your Information
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We use your information to:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                <li>Provide personalized mood tracking and insights</li>
                <li>Improve our app features and user experience</li>
                <li>Send you important updates about the service</li>
                <li>Ensure the security and integrity of our platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Data Security
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We implement industry-standard security measures to protect your personal information. Your data is encrypted in transit and at rest, and we regularly review our security practices.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Your Rights
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                <li>Access, update, or delete your personal information</li>
                <li>Export your data in a portable format</li>
                <li>Opt out of certain communications</li>
                <li>Request clarification about our data practices</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Contact Us
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a 
                  href="mailto:support@moodsify.com" 
                  className="text-purple-600 dark:text-purple-400 hover:underline"
                >
                  support@moodsify.com
                </a>
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;