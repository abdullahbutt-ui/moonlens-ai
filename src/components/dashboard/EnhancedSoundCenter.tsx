
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Headphones, Play, Pause, Upload, Volume2, ArrowLeft, Music, Waves } from 'lucide-react';
import { EmotionType } from '@/types/emotion';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface SoundCenterProps {
  currentMood: EmotionType;
}

interface AudioTrack {
  id: string;
  name: string;
  category: string;
  url: string;
  duration: number;
  description: string;
  color: string;
}

const EnhancedSoundCenter = ({ currentMood }: SoundCenterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<AudioTrack[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Using placeholder URLs for demo - in production, these would be real audio files
  const defaultAudioTracks: AudioTrack[] = [
    {
      id: 'ocean-waves',
      name: 'Ocean Waves',
      category: 'nature',
      url: 'https://www.soundjay.com/misc/sounds/wave-1.wav', // Placeholder
      duration: 240,
      description: 'Calming ocean sounds',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      id: 'forest-rain',
      name: 'Forest Rain',
      category: 'nature',
      url: 'https://www.soundjay.com/misc/sounds/rain-01.wav', // Placeholder
      duration: 300,
      description: 'Gentle rainfall',
      color: 'from-green-400 to-emerald-500'
    },
    {
      id: 'meditation-bells',
      name: 'Tibetan Bells',
      category: 'meditation',
      url: 'https://www.soundjay.com/misc/sounds/bell-1.wav', // Placeholder
      duration: 180,
      description: 'Peaceful meditation bells',
      color: 'from-purple-400 to-indigo-500'
    },
    {
      id: 'white-noise',
      name: 'White Noise',
      category: 'sleep',
      url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUFM2vZ7t2QQAoUX7Pt66hVFApFnt7wvmwfBTaM0PbOciUF', // Simple white noise audio data
      duration: 600,
      description: 'Soothing white noise',
      color: 'from-gray-400 to-slate-500'
    }
  ];

  // Audio visualization components
  const AudioVisualizer = () => {
    if (!isPlaying || !currentTrack) return null;

    return (
      <div className="flex items-center justify-center gap-1 h-16 bg-black/10 dark:bg-white/10 rounded-2xl p-4 mb-4">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className={`w-1 bg-gradient-to-t ${currentTrack.color} rounded-full`}
            animate={{
              height: [Math.random() * 20 + 10, Math.random() * 40 + 20, Math.random() * 20 + 10],
            }}
            transition={{
              duration: 0.5 + Math.random() * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.05
            }}
          />
        ))}
      </div>
    );
  };

  const WaveVisualizer = () => {
    if (!isPlaying || !currentTrack) return null;

    return (
      <div className="relative h-24 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 mb-4">
        <svg width="100%" height="100%" className="absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <motion.path
              key={i}
              d={`M0,50 Q50,${30 + i * 10} 100,50 T200,50 T300,50 T400,50`}
              stroke={`url(#gradient${i})`}
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.5
              }}
            />
          ))}
          <defs>
            {[...Array(3)].map((_, i) => (
              <linearGradient key={i} id={`gradient${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(147, 51, 234, 0.8)" />
                <stop offset="50%" stopColor="rgba(236, 72, 153, 0.8)" />
                <stop offset="100%" stopColor="rgba(59, 130, 246, 0.8)" />
              </linearGradient>
            ))}
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Waves className="w-8 h-8 text-white/60" />
        </div>
      </div>
    );
  };

  const handlePlayPause = async (track: AudioTrack) => {
    try {
      if (currentTrack?.id === track.id) {
        if (isPlaying) {
          audioRef.current?.pause();
          setIsPlaying(false);
        } else {
          await audioRef.current?.play();
          setIsPlaying(true);
        }
      } else {
        // Stop current track
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        
        // Start new track
        if (audioRef.current) {
          audioRef.current.src = track.url;
          audioRef.current.load();
          
          try {
            await audioRef.current.play();
            setCurrentTrack(track);
            setIsPlaying(true);
          } catch (error) {
            console.error('Audio play failed:', error);
            toast.error('Unable to play audio. This might be a demo file or browser restriction.');
            setIsPlaying(false);
          }
        }
      }
    } catch (error) {
      console.error('Audio control error:', error);
      toast.error('Audio playback failed. Please try again.');
      setIsPlaying(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles: AudioTrack[] = Array.from(files).map(file => {
        if (!file.type.startsWith('audio/')) {
          toast.error(`${file.name} is not an audio file`);
          return null;
        }
        
        return {
          id: `upload-${Date.now()}-${file.name}`,
          name: file.name.replace(/\.[^/.]+$/, ""),
          category: 'upload',
          url: URL.createObjectURL(file),
          duration: 0,
          description: 'Uploaded audio file',
          color: 'from-indigo-400 to-purple-500'
        };
      }).filter(Boolean) as AudioTrack[];
      
      if (newFiles.length > 0) {
        setUploadedFiles(prev => [...prev, ...newFiles]);
        toast.success(`${newFiles.length} audio file(s) uploaded successfully!`);
      }
    }
  };

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const handleError = () => {
      console.error('Audio loading error');
      setIsPlaying(false);
      toast.error('Failed to load audio. This might be a demo file.');
    };
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.volume = volume;

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [currentTrack, volume]);

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const categories = ['all', 'nature', 'meditation', 'sleep', 'focus', 'upload'];
  const allTracks = [...defaultAudioTracks, ...uploadedFiles];
  const filteredTracks = selectedCategory === 'all' 
    ? allTracks 
    : allTracks.filter(track => track.category === selectedCategory);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200 dark:border-emerald-500/30 hover:from-emerald-100 hover:to-green-100 dark:hover:from-emerald-800/30 dark:hover:to-green-800/30 text-emerald-700 dark:text-emerald-300 rounded-2xl px-6 py-3">
          <Headphones className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Sounds</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Music className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Sound Center
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-gray-500 dark:text-gray-400"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 p-2">
          {/* Now Playing */}
          {currentTrack && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-3xl bg-gradient-to-br ${currentTrack.color} text-white`}
            >
              <div className="text-center mb-4">
                <h3 className="font-semibold text-lg">{currentTrack.name}</h3>
                <p className="text-white/80 text-sm">{currentTrack.description}</p>
              </div>
              
              <AudioVisualizer />
              <WaveVisualizer />
              
              <div className="flex items-center justify-between mb-4 text-sm">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              
              <div className="bg-white/20 rounded-full h-2 mb-4">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
              
              <div className="flex items-center justify-center gap-4 mb-4">
                <Button
                  size="lg"
                  onClick={() => handlePlayPause(currentTrack)}
                  className="rounded-full w-16 h-16 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                >
                  {isPlaying ? 
                    <Pause className="w-8 h-8 text-white" /> : 
                    <Play className="w-8 h-8 text-white ml-1" />
                  }
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-white/80" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="flex-1 h-2 bg-white/20 rounded-lg appearance-none slider-thumb"
                />
              </div>
            </motion.div>
          )}

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={`capitalize rounded-full ${
                  selectedCategory === cat 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {cat} {cat === 'upload' && uploadedFiles.length > 0 && `(${uploadedFiles.length})`}
              </Button>
            ))}
          </div>

          {/* Track List */}
          <div className="space-y-3">
            {filteredTracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  currentTrack?.id === track.id 
                    ? `bg-gradient-to-r ${track.color} text-white border-transparent` 
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                }`}
                onClick={() => handlePlayPause(track)}
              >
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    className={`rounded-full w-12 h-12 ${
                      currentTrack?.id === track.id 
                        ? 'bg-white/20 hover:bg-white/30 text-white' 
                        : 'bg-purple-100 hover:bg-purple-200 text-purple-600 dark:bg-purple-800 dark:hover:bg-purple-700 dark:text-purple-200'
                    }`}
                  >
                    {currentTrack?.id === track.id && isPlaying ? 
                      <Pause className="w-5 h-5" /> : 
                      <Play className="w-5 h-5 ml-0.5" />
                    }
                  </Button>
                  <div className="flex-1">
                    <h4 className="font-medium">{track.name}</h4>
                    <p className={`text-sm ${
                      currentTrack?.id === track.id ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {track.description}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {Math.floor(track.duration / 60)}m
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Upload Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-12 rounded-2xl border-dashed border-purple-300 dark:border-purple-600 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Your Audio
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              Note: Demo tracks may not play due to browser restrictions. Upload your own files for full functionality.
            </p>
          </div>
        </div>

        <audio ref={audioRef} preload="metadata" />
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedSoundCenter;
