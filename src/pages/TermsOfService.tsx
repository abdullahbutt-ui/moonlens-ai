import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
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
            Terms of Service
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
          <CardContent className="p-8 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Acceptance of Terms
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                By accessing and using Moodsify, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Use License
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Permission is granted to temporarily use Moodsify for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to reverse engineer any software</li>
                <li>Remove any copyright or other proprietary notations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Medical Disclaimer
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Moodsify is a wellness app designed to help track mood and provide mindfulness exercises. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                User Responsibilities
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You agree to use Moodsify responsibly and agree not to:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Interfere with the app's functionality</li>
                <li>Upload harmful or malicious content</li>
                <li>Impersonate others or create false accounts</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Limitation of Liability
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                In no event shall Moodsify or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Moodsify, even if Moodsify or an authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                If you have any questions about these Terms of Service, please contact us at{' '}
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

export default TermsOfService;