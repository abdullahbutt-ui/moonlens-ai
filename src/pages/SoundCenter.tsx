
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Headphones, 
  Play, 
  Pause, 
  Volume2, 
  ArrowLeft,
  Waves,
  CloudRain,
  Wind,
  Music,
  Heart,
  Brain
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import MobileNavigation from '@/components/layout/MobileNavigation';

const SoundCenter = () => {
  const navigate = useNavigate();
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [volume, setVolume] = useState([75]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sample audio URLs - replace with your actual audio files
  const audioUrls = {
    rain: '/sounds/rain.mp3',
    ocean: '/sounds/ocean.mp3',
    wind: '/sounds/wind.mp3',
    tibetan: '/sounds/tibetan.mp3',
    piano: '/sounds/piano.mp3',
    ambient: '/sounds/ambient.mp3'
  };

  const soundCategories = [
    {
      title: "Nature Sounds",
      icon: Waves,
      sounds: [
        { id: 'rain', name: 'Gentle Rain', icon: CloudRain, duration: '60 min', color: 'from-blue-400 to-blue-600' },
        { id: 'ocean', name: 'Ocean Waves', icon: Waves, duration: '45 min', color: 'from-cyan-400 to-blue-500' },
        { id: 'wind', name: 'Forest Wind', icon: Wind, duration: '30 min', color: 'from-green-400 to-green-600' }
      ]
    },
    {
      title: "Meditation Music",
      icon: Music,
      sounds: [
        { id: 'tibetan', name: 'Tibetan Bowls', icon: Heart, duration: '20 min', color: 'from-purple-400 to-purple-600' },
        { id: 'piano', name: 'Peaceful Piano', icon: Music, duration: '35 min', color: 'from-pink-400 to-rose-500' },
        { id: 'ambient', name: 'Ambient Space', icon: Brain, duration: '50 min', color: 'from-indigo-400 to-purple-500' }
      ]
    }
  ];

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  const handlePlayPause = (soundId: string) => {
    if (!audioRef.current) return;

    if (currentlyPlaying === soundId) {
      audioRef.current.pause();
      setCurrentlyPlaying(null);
    } else {
      // For demo purposes, we'll generate a tone or use a placeholder
      // In a real app, you'd load actual audio files
      audioRef.current.src = audioUrls[soundId as keyof typeof audioUrls] || '';
      audioRef.current.play().catch(() => {
        // Fallback: create a simple tone for demo
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Different frequencies for different sounds
        const frequencies: { [key: string]: number } = {
          rain: 200,
          ocean: 100,
          wind: 150,
          tibetan: 256,
          piano: 440,
          ambient: 80
        };
        
        oscillator.frequency.value = frequencies[soundId] || 200;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.1;
        
        oscillator.start();
        
        // Store reference to stop it later
        (audioRef.current as any).fallbackOscillator = oscillator;
      });
      
      setCurrentlyPlaying(soundId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <Navbar />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-purple-600 dark:text-purple-400"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Sound Center
            </h1>
            <div className="w-16" /> {/* Spacer */}
          </div>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-6 pb-24 md:max-w-4xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl mb-4">
            <Headphones className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Calming Sounds
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Find your peaceful sanctuary with soothing sounds
          </p>
        </motion.div>

        {/* Volume Control */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Volume2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <div className="flex-1">
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 min-w-12">
                  {volume[0]}%
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sound Categories */}
        <div className="space-y-8">
          {soundCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + categoryIndex * 0.1 }}
            >
              <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 rounded-3xl overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-gray-800 dark:text-white">
                    <category.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {category.sounds.map((sound, soundIndex) => (
                    <motion.div
                      key={sound.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + soundIndex * 0.1 }}
                      className={`p-4 rounded-2xl bg-gradient-to-r ${sound.color} relative overflow-hidden`}
                    >
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handlePlayPause(sound.id)}
                            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                          >
                            {currentlyPlaying === sound.id ? (
                              <Pause className="w-5 h-5" />
                            ) : (
                              <Play className="w-5 h-5 ml-0.5" />
                            )}
                          </Button>
                          <div>
                            <h4 className="font-semibold text-white">{sound.name}</h4>
                            <p className="text-white/80 text-sm">{sound.duration}</p>
                          </div>
                        </div>
                        {currentlyPlaying === sound.id && (
                          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                            Playing
                          </Badge>
                        )}
                      </div>
                      
                      {/* Background decoration */}
                      <div className="absolute top-0 right-0 opacity-10">
                        <sound.icon className="w-24 h-24 transform rotate-12" />
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Current Playing */}
        {currentlyPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-20 left-4 right-4 md:bottom-4 z-40"
          >
            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-gray-800 dark:text-white">
                      Now Playing
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setCurrentlyPlaying(null)}
                    className="text-gray-600 dark:text-gray-400"
                  >
                    <Pause className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>

      {/* Mobile Navigation */}
      <MobileNavigation />
    </div>
  );
};

export default SoundCenter;
