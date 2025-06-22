
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SparklesCore } from "@/components/ui/sparkles";
import { emotionEmojis, emotionColors } from "@/utils/emotionData";

interface MoodPost {
  id: string;
  content: string;
  mood: string;
  timestamp: Date;
  author: string;
  likes: number;
  comments: number;
  isAnonymous: boolean;
}

const MoodWall = () => {
  const [posts, setPosts] = useState<MoodPost[]>([
    {
      id: '1',
      content: "Today I realized that small moments of joy can shift everything. Watching the sunrise reminded me that every day is a fresh start. 🌅",
      mood: 'happy',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      author: 'Anonymous',
      likes: 12,
      comments: 3,
      isAnonymous: true
    },
    {
      id: '2',
      content: "Feeling overwhelmed with work lately, but grateful for this community where I can share without judgment. Taking it one breath at a time.",
      mood: 'anxious',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      author: 'Sarah M.',
      likes: 8,
      comments: 5,
      isAnonymous: false
    },
    {
      id: '3',
      content: "Had a good cry today and somehow feel lighter. Sometimes we need to let the emotions flow instead of holding them back.",
      mood: 'sad',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      author: 'Anonymous',
      likes: 15,
      comments: 7,
      isAnonymous: true
    }
  ]);

  const [newPost, setNewPost] = useState("");
  const [selectedMood, setSelectedMood] = useState<string>("neutral");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmitPost = () => {
    if (!newPost.trim()) return;

    const post: MoodPost = {
      id: Date.now().toString(),
      content: newPost,
      mood: selectedMood,
      timestamp: new Date(),
      author: isAnonymous ? 'Anonymous' : 'You',
      likes: 0,
      comments: 0,
      isAnonymous
    };

    setPosts([post, ...posts]);
    setNewPost("");
    setSelectedMood("neutral");
    setIsDialogOpen(false);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  const moods = ['happy', 'sad', 'anxious', 'excited', 'calm', 'frustrated', 'grateful', 'neutral'];

  return (
    <div className="min-h-screen bg-black relative">
      {/* Background sparkles effect */}
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          id="mood-wall-sparkles"
          background="transparent"
          minSize={0.3}
          maxSize={0.6}
          particleDensity={60}
          className="w-full h-full"
          particleColor="#8b5cf6"
          speed={0.2}
        />
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10">
        <Navbar />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                Community Mood Wall 💙
              </h1>
              <p className="text-gray-300 text-lg">
                Share your feelings, connect with others, find support in our caring community
              </p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Share Mood
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-black/95 border-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-purple-400">Share Your Mood</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Express yourself in a safe, supportive space
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      How are you feeling?
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {moods.map((mood) => (
                        <Button
                          key={mood}
                          variant={selectedMood === mood ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedMood(mood)}
                          className="flex items-center justify-center"
                        >
                          <span className="mr-1">{emotionEmojis[mood as keyof typeof emotionEmojis]}</span>
                          <span className="capitalize text-xs">{mood}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Your message
                    </label>
                    <Textarea
                      placeholder="Share what's on your mind, your struggles, victories, or insights..."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="min-h-[100px] bg-gray-900/50 border-gray-700"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="anonymous" className="text-sm text-gray-300">
                      Post anonymously
                    </label>
                  </div>
                  
                  <Button 
                    onClick={handleSubmitPost} 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={!newPost.trim()}
                  >
                    Share with Community
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id} className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <span className="text-lg">
                          {emotionEmojis[post.mood as keyof typeof emotionEmojis]}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-white text-base">{post.author}</CardTitle>
                        <CardDescription className="text-gray-400 text-sm">
                          {formatTimeAgo(post.timestamp)}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge 
                      className="capitalize"
                      style={{ 
                        backgroundColor: emotionColors[post.mood as keyof typeof emotionColors] + '20',
                        color: emotionColors[post.mood as keyof typeof emotionColors],
                        border: `1px solid ${emotionColors[post.mood as keyof typeof emotionColors]}50`
                      }}
                    >
                      {post.mood}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-200 mb-4 leading-relaxed">{post.content}</p>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className="text-gray-400 hover:text-pink-400"
                    >
                      <Heart className="w-4 h-4 mr-1" />
                      {post.likes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-blue-400"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {post.comments}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-green-400"
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MoodWall;
