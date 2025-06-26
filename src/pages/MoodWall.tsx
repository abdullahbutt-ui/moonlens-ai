import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle, Share2, Plus, Filter, TrendingUp, Clock, Users, ArrowLeft, Send } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SparklesCore } from "@/components/ui/sparkles";
import { emotionEmojis, emotionColors } from "@/utils/emotionData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  isAnonymous: boolean;
  avatar?: string;
}

interface MoodPost {
  id: string;
  content: string;
  mood: string;
  timestamp: Date;
  author: string;
  likes: number;
  comments: Comment[];
  isAnonymous: boolean;
  avatar?: string;
  isLiked?: boolean;
}

const MoodWall = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [posts, setPosts] = useState<MoodPost[]>([
    {
      id: '1',
      content: "Today I realized that small moments of joy can shift everything. Watching the sunrise reminded me that every day is a fresh start. Sometimes we forget how powerful simple gratitude can be. 🌅",
      mood: 'happy',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      author: 'Anonymous',
      likes: 12,
      comments: [
        {
          id: 'c1',
          author: 'Maya S.',
          content: 'This is so beautiful! Thank you for sharing this reminder 💕',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          isAnonymous: false,
          avatar: 'MS'
        }
      ],
      isAnonymous: true
    },
    {
      id: '2',
      content: "Feeling overwhelmed with work lately, but grateful for this community where I can share without judgment. Taking it one breath at a time. Your support means everything to me right now. 💙",
      mood: 'anxious',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      author: 'Sarah M.',
      likes: 18,
      comments: [
        {
          id: 'c2',
          author: 'Anonymous',
          content: 'You\'ve got this! One step at a time. Sending you strength 🤗',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          isAnonymous: true
        },
        {
          id: 'c3',
          author: 'Alex R.',
          content: 'Remember to take breaks and be kind to yourself ✨',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isAnonymous: false,
          avatar: 'AR'
        }
      ],
      isAnonymous: false,
      avatar: 'SM'
    },
    {
      id: '3',
      content: "Had a good cry today and somehow feel lighter. Sometimes we need to let the emotions flow instead of holding them back. Remember, it's okay not to be okay sometimes. Healing isn't linear. 💧",
      mood: 'sad',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      author: 'Anonymous',
      likes: 24,
      comments: [],
      isAnonymous: true
    },
    {
      id: '4',
      content: "Just finished my morning meditation and feeling so centered. There's something magical about connecting with yourself before the world wakes up. Sending peaceful vibes to everyone! ✨",
      mood: 'calm',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      author: 'Alex R.',
      likes: 15,
      comments: [],
      isAnonymous: false,
      avatar: 'AR'
    }
  ]);

  const [newPost, setNewPost] = useState("");
  const [selectedMood, setSelectedMood] = useState<string>("neutral");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'trending' | 'most-liked'>('recent');
  const [filterMood, setFilterMood] = useState<string>('all');
  const [commentInputs, setCommentInputs] = useState<{[key: string]: string}>({});
  const [expandedComments, setExpandedComments] = useState<{[key: string]: boolean}>({});

  const handleSubmitPost = () => {
    if (!newPost.trim()) return;

    const post: MoodPost = {
      id: Date.now().toString(),
      content: newPost,
      mood: selectedMood,
      timestamp: new Date(),
      author: isAnonymous ? 'Anonymous' : 'You',
      likes: 0,
      comments: [],
      isAnonymous,
      avatar: isAnonymous ? undefined : 'YU'
    };

    setPosts([post, ...posts]);
    setNewPost("");
    setSelectedMood("neutral");
    setIsDialogOpen(false);
    
    toast({
      title: "Post shared! 🎉",
      description: "Your mood has been shared with the community.",
    });
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const isCurrentlyLiked = post.isLiked;
        return { 
          ...post, 
          likes: isCurrentlyLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !isCurrentlyLiked
        };
      }
      return post;
    }));
  };

  const handleAddComment = (postId: string) => {
    const commentText = commentInputs[postId]?.trim();
    if (!commentText) return;

    const newComment: Comment = {
      id: `${postId}-${Date.now()}`,
      author: 'You',
      content: commentText,
      timestamp: new Date(),
      isAnonymous: false,
      avatar: 'YU'
    };

    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    ));

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    
    toast({
      title: "Comment added! 💬",
      description: "Your supportive message has been shared.",
    });
  };

  const handleShare = async (post: MoodPost) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MoodLens Community Post',
          text: `${post.content.substring(0, 100)}...`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`Check out this mood post: "${post.content.substring(0, 100)}..." - Shared from MoodLens Community`);
        toast({
          title: "Link copied! 📋",
          description: "Post link has been copied to your clipboard.",
        });
      } catch (error) {
        toast({
          title: "Share link ready! 🔗",
          description: "Copy this link to share the post with others.",
        });
      }
    }
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
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

  const getSortedAndFilteredPosts = () => {
    let filteredPosts = posts;
    
    if (filterMood !== 'all') {
      filteredPosts = posts.filter(post => post.mood === filterMood);
    }

    switch (sortBy) {
      case 'trending':
        return filteredPosts.sort((a, b) => (b.likes + b.comments.length) - (a.likes + a.comments.length));
      case 'most-liked':
        return filteredPosts.sort((a, b) => b.likes - a.likes);
      case 'recent':
      default:
        return filteredPosts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }
  };

  const moods = ['happy', 'sad', 'anxious', 'excited', 'calm', 'frustrated', 'grateful', 'neutral'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-black dark:to-gray-900 relative">
      {/* Background sparkles effect - only in dark mode */}
      <div className="absolute inset-0 w-full h-full dark:block hidden">
        <SparklesCore
          id="mood-wall-sparkles"
          background="transparent"
          minSize={0.3}
          maxSize={0.6}
          particleDensity={40}
          className="w-full h-full"
          particleColor="#8b5cf6"
          speed={0.2}
        />
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10">
        <Navbar />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Mobile Back Button */}
          <div className="block sm:hidden mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          {/* Header */}
          <div className="mb-6 sm:mb-8 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Community Mood Wall 💙
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
                  Share your feelings, connect with others, find support in our caring community
                </p>
                
                {/* Community Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 justify-center sm:justify-start">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>1.2k members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>324 today</span>
                  </div>
                </div>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Share Mood
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white dark:bg-black/95 border-gray-200 dark:border-gray-800 w-[95%] max-w-md mx-auto">
                  <DialogHeader>
                    <DialogTitle className="text-purple-600 dark:text-purple-400">Share Your Mood</DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-400">
                      Express yourself in a safe, supportive space
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        How are you feeling?
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {moods.map((mood) => (
                          <Button
                            key={mood}
                            variant={selectedMood === mood ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedMood(mood)}
                            className="flex flex-col items-center justify-center h-14 p-1"
                          >
                            <span className="text-base mb-1">{emotionEmojis[mood as keyof typeof emotionEmojis]}</span>
                            <span className="capitalize text-xs">{mood}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Your message
                      </label>
                      <Textarea
                        placeholder="Share what's on your mind, your struggles, victories, or insights..."
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        className="min-h-[100px] bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
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
                      <label htmlFor="anonymous" className="text-sm text-gray-600 dark:text-gray-300">
                        Post anonymously
                      </label>
                    </div>
                    
                    <Button 
                      onClick={handleSubmitPost} 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      disabled={!newPost.trim()}
                    >
                      Share with Community
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6 p-4 bg-white/80 dark:bg-gray-900/50 rounded-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={filterMood} onValueChange={setFilterMood}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All moods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All moods</SelectItem>
                  {moods.map(mood => (
                    <SelectItem key={mood} value={mood} className="capitalize">
                      {emotionEmojis[mood as keyof typeof emotionEmojis]} {mood}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-500" />
              <Select value={sortBy} onValueChange={setSortBy as any}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most recent</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="most-liked">Most liked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="space-y-4 sm:space-y-6">
            {getSortedAndFilteredPosts().map((post) => (
              <Card key={post.id} className="bg-white/90 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback 
                          className="text-white font-medium"
                          style={{ 
                            background: `linear-gradient(135deg, ${emotionColors[post.mood as keyof typeof emotionColors]}, ${emotionColors[post.mood as keyof typeof emotionColors]}dd)`
                          }}
                        >
                          {post.avatar || '😊'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-gray-900 dark:text-white text-base font-medium">{post.author}</CardTitle>
                        <CardDescription className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(post.timestamp)}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge 
                      className="capitalize flex items-center gap-1"
                      style={{ 
                        backgroundColor: emotionColors[post.mood as keyof typeof emotionColors] + '20',
                        color: emotionColors[post.mood as keyof typeof emotionColors],
                        border: `1px solid ${emotionColors[post.mood as keyof typeof emotionColors]}50`
                      }}
                    >
                      {emotionEmojis[post.mood as keyof typeof emotionEmojis]}
                      {post.mood}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-200 mb-4 leading-relaxed text-sm sm:text-base">{post.content}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post.id)}
                        className={`transition-colors ${
                          post.isLiked 
                            ? 'text-pink-500 hover:text-pink-600' 
                            : 'text-gray-500 hover:text-pink-500 dark:text-gray-400 dark:hover:text-pink-400'
                        }`}
                      >
                        <Heart className={`w-4 h-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                        {post.likes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleComments(post.id)}
                        className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {post.comments.length}
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(post)}
                      className="text-gray-500 hover:text-green-500 dark:text-gray-400 dark:hover:text-green-400 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Comments Section */}
                  {expandedComments[post.id] && (
                    <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="flex space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                              {comment.avatar || '💬'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{comment.author}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{formatTimeAgo(comment.timestamp)}</span>
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-200">{comment.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Add Comment Input */}
                      <div className="flex space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300">
                            YU
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex gap-2">
                          <Input
                            placeholder="Write a supportive comment..."
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                            className="flex-1 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                          />
                          <Button
                            size="sm"
                            onClick={() => handleAddComment(post.id)}
                            disabled={!commentInputs[post.id]?.trim()}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Onboarding message for empty state */}
          {getSortedAndFilteredPosts().length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No posts yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Be the first to share your mood with the community!</p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Share Your First Post
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MoodWall;
