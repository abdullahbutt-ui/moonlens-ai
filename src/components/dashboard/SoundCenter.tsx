import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Headphones, Play, Pause, Download, Upload, Volume2 } from 'lucide-react';
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
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultAudioTracks = [
    {
      id: 'forest-rain',
      name: 'Forest Rain',
      category: 'calm',
      url: 'https://www.soundjay.com/misc/sounds/rain-01.wav',
      duration: 300,
      description: 'Gentle rainfall in a peaceful forest'
    },
    {
      id: 'ocean-waves',
      name: 'Ocean Waves',
      category: 'relax',
      url: 'https://www.soundjay.com/misc/sounds/ocean-wave-1.wav',
      duration: 240,
      description: 'Soothing ocean waves on the shore'
    },
    {
      id: 'meditation-bells',
      name: 'Tibetan Bells',
      category: 'focus',
      url: 'https://www.soundjay.com/misc/sounds/bell-1.wav',
      duration: 180,
      description: 'Calming meditation bells'
    },
    {
      id: 'nature-birds',
      name: 'Morning Birds',
      category: 'calm',
      url: 'https://www.soundjay.com/misc/sounds/bird-1.wav',
      duration: 360,
      description: 'Peaceful morning bird sounds'
    },
    {
      id: 'white-noise',
      name: 'White Noise',
      category: 'sleep',
      url: 'https://www.soundjay.com/misc/sounds/static-1.wav',
      duration: 600,
      description: 'Gentle white noise for deep sleep'
    },
    {
      id: 'piano-calm',
      name: 'Peaceful Piano',
      category: 'relax',
      url: 'https://www.soundjay.com/misc/sounds/piano-1.wav',
      duration: 210,
      description: 'Soft piano melodies for relaxation'
    }
  ];

  const handlePlayPause = (track: AudioTrack) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audioRef.current?.pause();
      } else {
        audioRef.current?.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current?.setAttribute('src', track.url);
      audioRef.current?.load();
      audioRef.current?.play();
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const handleDownload = (track: AudioTrack) => {
    const link = document.createElement('a');
    link.href = track.url;
    link.download = `${track.name.replace(' ', '_')}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles: AudioTrack[] = Array.from(files).map(file => ({
        id: `upload-${Date.now()}-${file.name}`,
        name: file.name,
        category: 'upload',
        url: URL.createObjectURL(file),
        duration: 0,
        description: 'Uploaded audio file'
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200 dark:border-emerald-500/30 hover:from-emerald-100 hover:to-green-100 dark:hover:from-emerald-800/30 dark:hover:to-green-800/30 text-emerald-700 dark:text-emerald-300">
          <Headphones className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Sounds</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Headphones className="w-5 h-5" />
            Sound Center
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {['all', 'calm', 'focus', 'relax', 'sleep'].map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="capitalize"
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Audio Tracks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {defaultAudioTracks
              .filter(track => selectedCategory === 'all' || track.category === selectedCategory)
              .map((track) => (
                <div key={track.id} className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-500/30">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-emerald-800 dark:text-emerald-200">{track.name}</h4>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400">{track.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">{track.category}</Badge>
                        <span className="text-xs text-gray-500">{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handlePlayPause(track)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {currentTrack?.id === track.id && isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(track)}
                      className="border-emerald-300 dark:border-emerald-500/30"
                    >
                      <Download className="w-4 h-4" />
                    </Button>

                    <div className="flex-1 flex items-center gap-1">
                      <Volume2 className="w-3 h-3 text-gray-500" />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Simple Audio Visualizer */}
                  {currentTrack?.id === track.id && isPlaying && (
                    <div className="mt-3 flex items-center justify-center gap-1 h-8">
                      {[...Array(12)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-emerald-500 rounded-full animate-pulse"
                          style={{
                            height: `${Math.random() * 20 + 4}px`,
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: `${0.5 + Math.random() * 0.5}s`
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>

          {/* Upload Section */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Your Own Audio
            </h3>
            <div
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-emerald-400 transition-colors"
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

            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="font-medium">Uploaded Files:</h4>
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <span className="text-sm">{file.name}</span>
                    <Button
                      size="sm"
                      onClick={() => handlePlayPause(file)}
                    >
                      {currentTrack?.id === file.id && isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <audio
          ref={audioRef}
          onEnded={() => setIsPlaying(false)}
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
