
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, Volume2, Heart, VolumeX, Upload, Waves } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Sound {
  id: string;
  name: string;
  description: string;
  category: 'calm' | 'focus' | 'relax' | 'sleep';
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
  const [uploadedSounds, setUploadedSounds] = useState<Sound[]>([]);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  const sounds: Sound[] = [
    {
      id: '1',
      name: 'Forest Rain',
      description: 'Gentle raindrops on leaves',
      category: 'calm',
      recommendedFor: ['anxious', 'stressed'],
      duration: '60 min',
      audioUrl: 'https://www.soundjay.com/misc/sounds/rain-01.mp3'
    },
    {
      id: '2',
      name: 'Ocean Waves',
      description: 'Rhythmic waves on shore',
      category: 'relax',
      recommendedFor: ['sad', 'overwhelmed'],
      duration: '45 min',
      audioUrl: 'https://www.soundjay.com/misc/sounds/ocean-wave-1.mp3'
    },
    {
      id: '3',
      name: 'Focus Flow',
      description: 'Chill beats for concentration',
      category: 'focus',
      recommendedFor: ['neutral', 'focused'],
      duration: '30 min',
      audioUrl: 'https://www.chosic.com/wp-content/uploads/2021/07/Lofi-Study-112.mp3'
    },
    {
      id: '4',
      name: 'Mountain Wind',
      description: 'Peaceful mountain breeze',
      category: 'calm',
      recommendedFor: ['angry', 'frustrated'],
      duration: '40 min',
      audioUrl: 'https://www.soundjay.com/misc/sounds/wind-chimes-1.mp3'
    },
    {
      id: '5',
      name: 'Deep Sleep',
      description: 'Ethereal tones for rest',
      category: 'sleep',
      recommendedFor: ['tired', 'restless'],
      duration: '8 hours',
      audioUrl: 'https://www.chosic.com/wp-content/uploads/2021/07/Ambient-1.mp3'
    },
    {
      id: '6',
      name: 'Productivity Boost',
      description: 'Energizing background music',
      category: 'focus',
      recommendedFor: ['neutral', 'motivated'],
      duration: '25 min',
      audioUrl: 'https://www.chosic.com/wp-content/uploads/2021/07/Lofi-Study-112.mp3'
    }
  ];

  const allSounds = [...sounds, ...uploadedSounds];

  const getRecommendedSounds = () => {
    return allSounds.filter(sound => 
      sound.recommendedFor.includes(currentMood.toLowerCase())
    );
  };

  const getSoundsByCategory = (category: string) => {
    return allSounds.filter(sound => sound.category === category);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      toast({
        title: "Invalid File",
        description: "Please upload an audio file.",
        variant: "destructive",
      });
      return;
    }

    const url = URL.createObjectURL(file);
    const newSound: Sound = {
      id: `uploaded-${Date.now()}`,
      name: file.name.replace(/\.[^/.]+$/, ""),
      description: 'Your uploaded track',
      category: 'calm',
      recommendedFor: [currentMood.toLowerCase()],
      duration: 'Custom',
      audioUrl: url
    };

    setUploadedSounds(prev => [...prev, newSound]);
    toast({
      title: "Upload Successful",
      description: `${newSound.name} has been added to your library.`,
    });
  };

  const initializeAudio = async (soundId: string) => {
    const sound = allSounds.find(s => s.id === soundId);
    if (!sound) return false;

    try {
      setIsLoading(soundId);
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const audio = new Audio();
      audio.crossOrigin = "anonymous";
      audio.preload = "auto";
      audio.loop = true;
      audio.volume = volume;
      
      audio.addEventListener('loadeddata', () => {
        console.log(`Audio loaded: ${sound.name}`);
        setIsLoading(null);
        setShowVisualizer(true);
      });
      
      audio.addEventListener('error', (e) => {
        console.error(`Audio error for ${sound.name}:`, e);
        setIsLoading(null);
        toast({
          title: "Audio Error",
          description: `Could not load ${sound.name}. The file may be corrupted or unsupported.`,
          variant: "destructive",
        });
      });

      audio.addEventListener('ended', () => {
        setCurrentlyPlaying(null);
        setShowVisualizer(false);
      });

      audio.src = sound.audioUrl;
      audioRef.current = audio;
      return true;
    } catch (error) {
      console.error(`Failed to initialize audio for ${sound.name}:`, error);
      setIsLoading(null);
      return false;
    }
  };

  const handlePlayPause = async (soundId: string) => {
    const sound = allSounds.find(s => s.id === soundId);
    if (!sound) return;

    if (currentlyPlaying === soundId && audioRef.current) {
      audioRef.current.pause();
      setCurrentlyPlaying(null);
      setShowVisualizer(false);
      console.log(`Paused: ${sound.name}`);
      return;
    }

    const initialized = await initializeAudio(soundId);
    if (initialized && audioRef.current) {
      try {
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
            });
        }
      } catch (error) {
        console.error('Audio play error:', error);
      }
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

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
      case 'calm': return 'bg-green-900/30 text-green-400 border-green-500/50';
      case 'focus': return 'bg-blue-900/30 text-blue-400 border-blue-500/50';
      case 'relax': return 'bg-purple-900/30 text-purple-400 border-purple-500/50';
      case 'sleep': return 'bg-indigo-900/30 text-indigo-400 border-indigo-500/50';
      default: return 'bg-gray-900/30 text-gray-400 border-gray-500/50';
    }
  };

  const SoundCard = ({ sound }: { sound: Sound }) => (
    <Card 
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
          {sound.description} • {sound.duration}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">{sound.duration}</span>
          {currentlyPlaying === sound.id && showVisualizer && (
            <div className="flex items-center gap-1">
              <Waves className="w-3 h-3 text-emerald-400 animate-pulse" />
              <div className="flex gap-0.5">
                {[1,2,3].map(i => (
                  <div key={i} className="w-0.5 h-4 bg-emerald-400 animate-pulse" style={{animationDelay: `${i * 0.2}s`}} />
                ))}
              </div>
            </div>
          )}
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
  );

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

        {/* Upload Button */}
        <div className="mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="bg-blue-600/20 border-blue-500/50 hover:bg-blue-600/30 text-blue-300"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Your Audio
          </Button>
        </div>

        {recommendedSounds.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <Heart className="w-4 h-4 mr-2 text-pink-400" />
              Recommended for You
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedSounds.map((sound) => (
                <SoundCard key={sound.id} sound={sound} />
              ))}
            </div>
          </div>
        )}

        <Tabs defaultValue="calm" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900/50">
            <TabsTrigger value="calm" className="data-[state=active]:bg-green-600/20">Calm</TabsTrigger>
            <TabsTrigger value="focus" className="data-[state=active]:bg-blue-600/20">Focus</TabsTrigger>
            <TabsTrigger value="relax" className="data-[state=active]:bg-purple-600/20">Relax</TabsTrigger>
            <TabsTrigger value="sleep" className="data-[state=active]:bg-indigo-600/20">Sleep</TabsTrigger>
          </TabsList>
          
          {['calm', 'focus', 'relax', 'sleep'].map(category => (
            <TabsContent key={category} value={category} className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getSoundsByCategory(category).map((sound) => (
                  <SoundCard key={sound.id} sound={sound} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SoundCenter;
