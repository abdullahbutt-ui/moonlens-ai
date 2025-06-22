
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, Volume2, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Sound {
  id: string;
  name: string;
  description: string;
  category: 'nature' | 'lofi' | 'ambient';
  recommendedFor: string[];
  duration: string;
}

interface SoundCenterProps {
  currentMood: string;
}

const SoundCenter = ({ currentMood }: SoundCenterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  const sounds: Sound[] = [
    {
      id: '1',
      name: 'Forest Rain',
      description: 'Gentle raindrops on leaves',
      category: 'nature',
      recommendedFor: ['anxious', 'stressed'],
      duration: '60 min'
    },
    {
      id: '2',
      name: 'Ocean Waves',
      description: 'Rhythmic waves on shore',
      category: 'nature',
      recommendedFor: ['sad', 'overwhelmed'],
      duration: '45 min'
    },
    {
      id: '3',
      name: 'Lo-fi Study',
      description: 'Chill beats for focus',
      category: 'lofi',
      recommendedFor: ['neutral', 'focused'],
      duration: '30 min'
    },
    {
      id: '4',
      name: 'Mountain Wind',
      description: 'Peaceful mountain breeze',
      category: 'nature',
      recommendedFor: ['angry', 'frustrated'],
      duration: '40 min'
    },
    {
      id: '5',
      name: 'Ambient Space',
      description: 'Ethereal cosmic sounds',
      category: 'ambient',
      recommendedFor: ['contemplative', 'curious'],
      duration: '35 min'
    }
  ];

  const getRecommendedSounds = () => {
    return sounds.filter(sound => 
      sound.recommendedFor.includes(currentMood.toLowerCase())
    );
  };

  const handlePlayPause = (soundId: string) => {
    if (currentlyPlaying === soundId) {
      setCurrentlyPlaying(null);
      console.log(`Paused: ${sounds.find(s => s.id === soundId)?.name}`);
    } else {
      setCurrentlyPlaying(soundId);
      console.log(`Playing: ${sounds.find(s => s.id === soundId)?.name}`);
    }
  };

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

        {recommendedSounds.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <Heart className="w-4 h-4 mr-2 text-pink-400" />
              Recommended for You
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedSounds.map((sound) => (
                <Card key={sound.id} className="bg-gray-900/50 border-gray-700">
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
                      className="w-full"
                    >
                      {currentlyPlaying === sound.id ? (
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
              <Card key={sound.id} className="bg-gray-900/50 border-gray-700">
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
                    className="w-full"
                  >
                    {currentlyPlaying === sound.id ? (
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
