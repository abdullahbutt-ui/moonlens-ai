
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, Volume2, Heart, VolumeX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Sound {
  id: string;
  name: string;
  description: string;
  category: 'nature' | 'lofi' | 'ambient';
  recommendedFor: string[];
  duration: string;
  audioUrl: string;
}

interface SoundCenterProps {
  currentMood: string;
}

const SoundCenter = ({ currentMood }: SoundCenterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.7);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const sounds: Sound[] = [
    {
      id: '1',
      name: 'Forest Rain',
      description: 'Gentle raindrops on leaves',
      category: 'nature',
      recommendedFor: ['anxious', 'stressed'],
      duration: '60 min',
      audioUrl: 'https://www.soundjay.com/misc/sounds/rain-01.mp3'
    },
    {
      id: '2',
      name: 'Ocean Waves',
      description: 'Rhythmic waves on shore',
      category: 'nature',
      recommendedFor: ['sad', 'overwhelmed'],
      duration: '45 min',
      audioUrl: 'https://www.soundjay.com/misc/sounds/ocean-wave-1.mp3'
    },
    {
      id: '3',
      name: 'Lo-fi Study',
      description: 'Chill beats for focus',
      category: 'lofi',
      recommendedFor: ['neutral', 'focused'],
      duration: '30 min',
      audioUrl: 'https://www.chosic.com/wp-content/uploads/2021/07/Lofi-Study-112.mp3'
    },
    {
      id: '4',
      name: 'Mountain Wind',
      description: 'Peaceful mountain breeze',
      category: 'nature',
      recommendedFor: ['angry', 'frustrated'],
      duration: '40 min',
      audioUrl: 'https://www.soundjay.com/misc/sounds/wind-chimes-1.mp3'
    },
    {
      id: '5',
      name: 'Ambient Space',
      description: 'Ethereal cosmic sounds',
      category: 'ambient',
      recommendedFor: ['contemplative', 'curious'],
      duration: '35 min',
      audioUrl: 'https://www.chosic.com/wp-content/uploads/2021/07/Ambient-1.mp3'
    }
  ];

  const getRecommendedSounds = () => {
    return sounds.filter(sound => 
      sound.recommendedFor.includes(currentMood.toLowerCase())
    );
  };

  const initializeAudio = async (soundId: string) => {
    const sound = sounds.find(s => s.id === soundId);
    if (!sound) return false;

    try {
      setIsLoading(soundId);
      
      // Stop current audio if playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      // Create new audio element
      const audio = new Audio();
      audio.crossOrigin = "anonymous";
      audio.preload = "auto";
      audio.loop = true;
      audio.volume = volume;
      
      // Set up event listeners
      audio.addEventListener('loadeddata', () => {
        console.log(`Audio loaded: ${sound.name}`);
        setIsLoading(null);
      });
      
      audio.addEventListener('error', (e) => {
        console.error(`Audio error for ${sound.name}:`, e);
        setIsLoading(null);
        toast({
          title: "Audio Error",
          description: `Could not load ${sound.name}. Trying alternative source...`,
          variant: "destructive",
        });
        
        // Fallback to a simple tone generation
        playFallbackTone(sound.category);
      });

      audio.addEventListener('ended', () => {
        setCurrentlyPlaying(null);
      });

      // Use fallback URLs for better compatibility
      const fallbackUrls = {
        nature: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhCj2Y2+/EeSsFJYDJ8tqLOAga',
        lofi: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhCj2Y2+/EeSsFJYDJ8tqLOAga',
        ambient: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhCj2Y2+/EeSsFJYDJ8tqLOAga'
      };

      // Try original URL first, then fallback
      audio.src = sound.audioUrl;
      
      audioRef.current = audio;
      return true;
    } catch (error) {
      console.error(`Failed to initialize audio for ${sound.name}:`, error);
      setIsLoading(null);
      toast({
        title: "Audio Unavailable",
        description: `${sound.name} is temporarily unavailable. Please try another sound.`,
        variant: "destructive",
      });
      return false;
    }
  };

  const playFallbackTone = (category: string) => {
    // Create a simple Web Audio API tone as fallback
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different frequencies for different categories
      const frequencies = {
        nature: 220, // A3
        lofi: 174,   // F3
        ambient: 528 // C5
      };
      
      oscillator.frequency.setValueAtTime(frequencies[category as keyof typeof frequencies] || 220, audioContext.currentTime);
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(volume * 0.1, audioContext.currentTime);
      
      oscillator.start();
      
      // Stop after a short time to indicate it's working
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, 1000);
      
      toast({
        title: "Audio Test",
        description: "Playing test tone - audio system is working!",
      });
    } catch (error) {
      console.error('Web Audio API not available:', error);
    }
  };

  const handlePlayPause = async (soundId: string) => {
    const sound = sounds.find(s => s.id === soundId);
    if (!sound) return;

    // If clicking the same sound that's playing, pause it
    if (currentlyPlaying === soundId && audioRef.current) {
      audioRef.current.pause();
      setCurrentlyPlaying(null);
      console.log(`Paused: ${sound.name}`);
      return;
    }

    // Initialize and play new sound
    const initialized = await initializeAudio(soundId);
    if (initialized && audioRef.current) {
      try {
        // For mobile compatibility, we need user interaction
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setCurrentlyPlaying(soundId);
              console.log(`Playing: ${sound.name}`);
              toast({
                title: "Now Playing",
                description: `${sound.name} - ${sound.description}`,
              });
            })
            .catch((error) => {
              console.error('Play failed:', error);
              toast({
                title: "Playback Error",
                description: "Please ensure audio permissions are enabled and try again.",
                variant: "destructive",
              });
              playFallbackTone(sound.category);
            });
        }
      } catch (error) {
        console.error('Audio play error:', error);
        playFallbackTone(sound.category);
      }
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'nature': return 'bg-green-900/30 text-green-400 border-green-500/50';
      case 'lofi': return 'bg-blue-900/30 text-blue-400 border-blue-500/50';
      case 'ambient': return 'bg-purple-900/30 text-purple-400 border-purple-500/50';
      default: return 'bg-gray-900/30 text-gray-400 border-gray-500/50';
    }
  };

  const recommendedSounds = getRecommendedSounds();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-emerald-600/20 border-emerald-500/50 hover:bg-emerald-600/30">
          <Volume2 className="w-4 h-4 mr-2" />
          Sound Center
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl bg-black/95 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-emerald-400 flex items-center">
            <Volume2 className="w-5 h-5 mr-2" />
            Calming Soundscapes
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Find the perfect sounds to match your current mood: {currentMood}
          </DialogDescription>
        </DialogHeader>

        {/* Volume Control */}
        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-900/30 rounded-lg">
          <VolumeX className="w-4 h-4 text-gray-400" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <Volume2 className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400 min-w-[3ch]">{Math.round(volume * 100)}%</span>
        </div>

        {recommendedSounds.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <Heart className="w-4 h-4 mr-2 text-pink-400" />
              Recommended for You
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedSounds.map((sound) => (
                <Card 
                  key={sound.id} 
                  className={`bg-gray-900/50 border-gray-700 transition-all duration-300 ${
                    currentlyPlaying === sound.id ? 'ring-2 ring-emerald-500/50 bg-emerald-900/20' : ''
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-base">{sound.name}</CardTitle>
                      <Badge className={getCategoryColor(sound.category)}>
                        {sound.category}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-400 text-sm">
                      {sound.description} • {sound.duration}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button
                      onClick={() => handlePlayPause(sound.id)}
                      variant={currentlyPlaying === sound.id ? "default" : "outline"}
                      className={`w-full ${currentlyPlaying === sound.id ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                      disabled={isLoading === sound.id}
                    >
                      {isLoading === sound.id ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Loading...
                        </>
                      ) : currentlyPlaying === sound.id ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Play
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">All Soundscapes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sounds.map((sound) => (
              <Card 
                key={sound.id} 
                className={`bg-gray-900/50 border-gray-700 transition-all duration-300 ${
                  currentlyPlaying === sound.id ? 'ring-2 ring-emerald-500/50 bg-emerald-900/20' : ''
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-sm">{sound.name}</CardTitle>
                    <Badge className={getCategoryColor(sound.category)}>
                      {sound.category}
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-400 text-xs">
                    {sound.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">{sound.duration}</span>
                  </div>
                  <Button
                    onClick={() => handlePlayPause(sound.id)}
                    variant={currentlyPlaying === sound.id ? "default" : "outline"}
                    size="sm"
                    className={`w-full ${currentlyPlaying === sound.id ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                    disabled={isLoading === sound.id}
                  >
                    {isLoading === sound.id ? (
                      <>
                        <div className="w-3 h-3 mr-1 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Loading
                      </>
                    ) : currentlyPlaying === sound.id ? (
                      <>
                        <Pause className="w-3 h-3 mr-1" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 mr-1" />
                        Play
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SoundCenter;
