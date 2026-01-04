import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Shield, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface PrivateModeToggleProps {
  className?: string;
}

const PrivateModeToggle = ({ className }: PrivateModeToggleProps) => {
  const { user } = useAuth();
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [confirmPin, setConfirmPin] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');

  useEffect(() => {
    loadPrivateSettings();
  }, [user]);

  const loadPrivateSettings = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('user_preferences')
        .select('private_mode_enabled, pin_code')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setIsPrivateMode(data.private_mode_enabled || false);
        if (data.private_mode_enabled && data.pin_code) {
          setIsLocked(true);
        }
      }
    } catch (error) {
      console.error('Error loading private settings:', error);
    }
  };

  const togglePrivateMode = async () => {
    if (!user) return;

    try {
      if (!isPrivateMode) {
        // Turning ON private mode - need to set up PIN
        setShowPinSetup(true);
      } else {
        // Turning OFF private mode
        await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            private_mode_enabled: false,
            pin_code: null
          });
        
        setIsPrivateMode(false);
        setIsLocked(false);
        setPinCode('');
        toast.success('Private mode disabled');
      }
    } catch (error) {
      console.error('Error toggling private mode:', error);
      toast.error('Failed to update private mode settings');
    }
  };

  const setupPin = async () => {
    if (!user) return;

    if (pinCode.length < 4) {
      toast.error('PIN must be at least 4 digits');
      return;
    }

    if (pinCode !== confirmPin) {
      toast.error('PINs do not match');
      return;
    }

    try {
      await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          private_mode_enabled: true,
          pin_code: pinCode
        });

      setIsPrivateMode(true);
      setShowPinSetup(false);
      setIsLocked(true);
      setPinCode('');
      setConfirmPin('');
      toast.success('🔒 Private mode enabled with PIN protection');
    } catch (error) {
      console.error('Error setting up PIN:', error);
      toast.error('Failed to set up PIN');
    }
  };

  const unlockWithPin = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('user_preferences')
        .select('pin_code')
        .eq('user_id', user.id)
        .single();

      if (data && data.pin_code === enteredPin) {
        setIsLocked(false);
        setEnteredPin('');
        toast.success('🔓 Private mode unlocked');
      } else {
        toast.error('Incorrect PIN');
        setEnteredPin('');
      }
    } catch (error) {
      console.error('Error unlocking:', error);
      toast.error('Failed to unlock');
    }
  };

  if (isLocked) {
    return (
      <Card className={`bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700 ${className}`}>
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-lg font-semibold mb-2">Private Mode Active</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Enter your PIN to access your data
          </p>
          
          <div className="max-w-xs mx-auto space-y-3">
            <Input
              type="password"
              placeholder="Enter PIN"
              value={enteredPin}
              onChange={(e) => setEnteredPin(e.target.value)}
              className="text-center text-lg tracking-wider"
              maxLength={6}
            />
            <Button 
              onClick={unlockWithPin}
              disabled={enteredPin.length < 4}
              className="w-full"
            >
              <Lock className="w-4 h-4 mr-2" />
              Unlock
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showPinSetup) {
    return (
      <Card className={`bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-500/30 ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <Shield className="w-5 h-5" />
            Set Up Private Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            Create a PIN to protect your data when the app is idle or when others might access your device.
          </p>
          
          <div className="space-y-3">
            <Input
              type="password"
              placeholder="Create PIN (min 4 digits)"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              className="text-center tracking-wider"
            />
            
            <Input
              type="password"
              placeholder="Confirm PIN"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              className="text-center tracking-wider"
            />
            
            <div className="flex gap-2">
              <Button 
                onClick={setupPin}
                disabled={pinCode.length < 4 || pinCode !== confirmPin}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Shield className="w-4 h-4 mr-2" />
                Enable Private Mode
              </Button>
              
              <Button 
                onClick={() => setShowPinSetup(false)}
                variant="outline"
                className="border-blue-200 dark:border-blue-500/50"
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-500/30 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-green-800 dark:text-green-200">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Private Mode
          </div>
          <Switch
            checked={isPrivateMode}
            onCheckedChange={togglePrivateMode}
          />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-white/70 dark:bg-black/30 rounded-lg">
          {isPrivateMode ? (
            <>
              <EyeOff className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <div className="font-medium text-green-700 dark:text-green-300">Protected</div>
                <div className="text-xs text-green-600 dark:text-green-400">
                  Your data is secured with PIN protection
                </div>
              </div>
            </>
          ) : (
            <>
              <Eye className="w-5 h-5 text-gray-500" />
              <div>
                <div className="font-medium text-gray-700 dark:text-gray-300">Standard Mode</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Data visible without protection
                </div>
              </div>
            </>
          )}
        </div>

        <div className="text-xs text-gray-600 dark:text-gray-400">
          🔒 Private mode adds PIN protection and blurs sensitive data when the app is idle.
          Your journal entries are always encrypted and stored securely.
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivateModeToggle;