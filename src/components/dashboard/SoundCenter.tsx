
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Headphones, Play, Pause, Download, Upload, Volume2, ArrowLeft } from 'lucide-react';
import { EmotionType } from '@/types/emotion';

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
}

const SoundCenter = ({ currentMood }: SoundCenterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [uploadedFiles, setUploadedFiles] = useState<AudioTrack[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultAudioTracks = [
    {
      id: 'forest-rain',
      name: 'Forest Rain',
      category: 'calm',
      url: '/sounds/rain.mp3',
      duration: 300,
      description: 'Gentle rainfall in a peaceful forest'
    },
    {
      id: 'ocean-waves',
      name: 'Ocean Waves',
      category: 'relax',
      url: '/sounds/waves.mp3',
      duration: 240,
      description: 'Soothing ocean waves on the shore'
    },
    {
      id: 'meditation-bells',
      name: 'Tibetan Bells',
      category: 'focus',
      url: '/sounds/bells.mp3',
      duration: 180,
      description: 'Calming meditation bells'
    },
    {
      id: 'nature-birds',
      name: 'Morning Birds',
      category: 'calm',
      url: '/sounds/birds.mp3',
      duration: 360,
      description: 'Peaceful morning bird sounds'
    },
    {
      id: 'white-noise',
      name: 'White Noise',
      category: 'sleep',
      url: '/sounds/whitenoise.mp3',
      duration: 600,
      description: 'Gentle white noise for deep sleep'
    },
    {
      id: 'piano-calm',
      name: 'Peaceful Piano',
      category: 'relax',
      url: '/sounds/piano.mp3',
      duration: 210,
      description: 'Soft piano melodies for relaxation'
    }
  ];

  // Update audio element volume when volume state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Time update handler
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, [currentTrack]);

  const handlePlayPause = (track: AudioTrack) => {
    // Stop any currently playing track first
    if (currentTrack && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      
      // Stop any fallback oscillator
      if ((audioRef.current as any).fallbackOscillator) {
        (audioRef.current as any).fallbackOscillator.stop();
        (audioRef.current as any).fallbackOscillator = null;
      }
    }

    if (currentTrack?.id === track.id && isPlaying) {
      // Stop current track
      setIsPlaying(false);
      setCurrentTrack(null);
    } else {
      // Start new track
      if (audioRef.current) {
        audioRef.current.src = track.url;
        audioRef.current.load();
        audioRef.current.play().catch(() => {
          // Generate fallback tone if audio fails to load
          generateFallbackTone();
          console.log('Audio file failed to load, using fallback tone');
        });
      }
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  // Generate fallback audio tone using Web Audio API
  const generateFallbackTone = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Create a calming tone based on track category
    const frequencies: { [key: string]: number } = {
      calm: 200,
      relax: 174,
      focus: 256,
      sleep: 110,
      upload: 220
    };
    
    const frequency = frequencies[currentTrack?.category || 'calm'] || 200;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume * 0.1, audioContext.currentTime + 0.5);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 10);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 10);
    
    // Store reference to stop it later
    if (audioRef.current) {
      (audioRef.current as any).fallbackOscillator = oscillator;
    }
  };

  const handleDownload = (track: AudioTrack) => {
    const link = document.createElement('a');
    link.href = track.url;
    link.download = `${track.name.replace(' ', '_')}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles: AudioTrack[] = Array.from(files).map(file => ({
        id: `upload-${Date.now()}-${file.name}`,
        name: file.name.replace(/\.[^/.]+$/, ""),
        category: 'upload',
        url: URL.createObjectURL(file),
        duration: 0,
        description: 'Uploaded audio file'
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const allTracks = [...defaultAudioTracks, ...uploadedFiles];
  const filteredTracks = selectedCategory === 'all' 
    ? allTracks 
    : allTracks.filter(track => track.category === selectedCategory);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200 dark:border-emerald-500/30 hover:from-emerald-100 hover:to-green-100 dark:hover:from-emerald-800/30 dark:hover:to-green-800/30 text-emerald-700 dark:text-emerald-300">
          <Headphones className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Sounds</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Headphones className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Sound Center
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {['all', 'calm', 'focus', 'relax', 'sleep', 'upload'].map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={`capitalize ${
                  selectedCategory === cat 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700' 
                    : 'border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                }`}
              >
                {cat} {cat === 'upload' && uploadedFiles.length > 0 && `(${uploadedFiles.length})`}
              </Button>
            ))}
          </div>

          {/* Current Playing Track Info */}
          {currentTrack && (
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-4 rounded-xl border border-emerald-200 dark:border-emerald-500/30">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-emerald-800 dark:text-emerald-200">Now Playing</h4>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-200">
                  {isPlaying ? 'Playing' : 'Paused'}
                </Badge>
              </div>
              <p className="text-emerald-700 dark:text-emerald-300 mb-2">{currentTrack.name}</p>
              <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                <span>{formatTime(currentTime)}</span>
                <div className="flex-1 bg-emerald-200 dark:bg-emerald-800 rounded-full h-1.5">
                  <div 
                    className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300" 
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          )}

          {/* Audio Tracks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTracks.map((track) => (
              <div key={track.id} className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-500/30 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-emerald-800 dark:text-emerald-200">{track.name}</h4>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-1">{track.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-200">
                        {track.category}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Button
                    size="sm"
                    onClick={() => handlePlayPause(track)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700"
                  >
                    {currentTrack?.id === track.id && isPlaying ? 
                      <Pause className="w-4 h-4" /> : 
                      <Play className="w-4 h-4" />
                    }
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(track)}
                    className="border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                  >
                    <Download className="w-4 h-4" />
                  </Button>

                  <div className="flex-1 flex items-center gap-2">
                    <Volume2 className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Enhanced Audio Visualizer */}
                {currentTrack?.id === track.id && isPlaying && (
                  <div className="mt-3 flex items-center justify-center gap-1 h-8 bg-emerald-100/50 dark:bg-emerald-900/30 rounded-lg p-2">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-gradient-to-t from-emerald-500 to-emerald-300 dark:from-emerald-400 dark:to-emerald-200 rounded-full animate-pulse"
                        style={{
                          height: `${Math.random() * 24 + 8}px`,
                          animationDelay: `${i * 0.1}s`,
                          animationDuration: `${0.4 + Math.random() * 0.6}s`
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Upload Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="font-medium mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
              <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Upload Your Own Audio
            </h3>
            <div
              className="border-2 border-dashed border-emerald-300 dark:border-emerald-500/30 rounded-lg p-6 text-center cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-400 transition-colors bg-emerald-50/50 dark:bg-emerald-900/10"
              onClick={() => fileInputRef.current?.click()}
            >
              <p className="text-gray-600 dark:text-gray-400">
                Click to upload audio files (MP3, WAV, OGG)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>

        <audio
          ref={audioRef}
          onLoadedMetadata={() => {
            if (audioRef.current) {
              audioRef.current.volume = volume;
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SoundCenter;
