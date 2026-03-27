import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { Heart, MessageCircle, Share2, Plus, Search, TrendingUp, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Post {
    _id: string;
    content: { text: string, images: string[] };
    author: { name: string, profile: { profilePic: string, branch: string } };
    likes: string[];
    comments: any[];
    createdAt: string;
}

const Home: React.FC = () => {
    const { user } = useAuth();
    const { socket } = useChat();
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPostText, setNewPostText] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            const { data } = await axios.get('/api/posts');
            setPosts(data.posts);
        } catch (error) {
            console.warn('Using Mock Posts for Demo');
            const mockPosts = [
                {
                    _id: 'p1',
                    content: { text: 'Excited for the upcoming Inter-University Hackathon! 🚀 #CodeRunners #UniversityLife', images: ['https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1000'] },
                    author: { name: 'Sarah Chen', profile: { profilePic: 'https://i.pravatar.cc/150?u=1', branch: 'Software Engineering' } },
                    likes: ['u1', 'u2'],
                    comments: [1, 2],
                    createdAt: new Date().toISOString()
                },
                {
                    _id: 'p2',
                    content: { text: "Just uploaded the notes for 'Design Patterns and System Architecture'. Check them out in the Resource Share hub! 📄💡", images: [] },
                    author: { name: 'Alex Johnson', profile: { profilePic: 'https://i.pravatar.cc/150?u=2', branch: 'Computer Science' } },
                    likes: ['u3'],
                    comments: [1],
                    createdAt: new Date(Date.now() - 3600000).toISOString()
                }
            ];
            setPosts(mockPosts);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();

        if (socket) {
            socket.on('newPost', (post: Post) => {
                setPosts(prev => [post, ...prev]);
            });
        }

        return () => {
            if (socket) socket.off('newPost');
        };
    }, [socket]);

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPostText.trim()) return;

        try {
            const config = {
                headers: { Authorization: `Bearer ${user?.accessToken}` }
            };
            const { data } = await axios.post('/api/posts', { text: newPostText }, config);
            // Post will be added via socket event or manual append
            setNewPostText('');
        } catch (error) {
             console.error('Error creating post:', error);
        }
    };

    const handleLike = async (postId: string) => {
         try {
             const config = {
                 headers: { Authorization: `Bearer ${user?.accessToken}` }
             };
             const { data } = await axios.put(`/api/posts/like/${postId}`, {}, config);
             
             setPosts(prev => prev.map(p => p._id === postId ? { ...p, likes: data.likes } : p));
         } catch (error) {
              console.error('Error liking post:', error);
         }
    };

    return (
        <div className="max-w-4xl mx-auto flex gap-8">
            <div className="flex-1 space-y-8">
                {/* Create Post */}
                <form 
                  onSubmit={handleCreatePost} 
                  className="glass-card p-6 border-indigo-500/20 shadow-indigo-500/5 relative overflow-hidden"
                >
                    <div className="flex gap-4">
                        <img 
                            src={user?.profile?.profilePic || 'https://via.placeholder.com/40'} 
                            alt="Profile" 
                            className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                            <textarea 
                                placeholder="Share what's happening on campus..." 
                                value={newPostText}
                                onChange={(e) => setNewPostText(e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-0 text-slate-100 placeholder:text-slate-500 text-lg resize-none min-h-[100px]"
                            />
                            <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                                <div className="flex gap-2">
                                     <button type="button" className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-400">
                                        <Plus size={20} />
                                     </button>
                                </div>
                                <button type="submit" className="btn-primary py-1.5">
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Feed */}
                <div className="space-y-6">
                    {loading ? (
                        [1,2,3].map(i => <div key={i} className="h-48 glass-card animate-pulse" />)
                    ) : (
                        posts.map((post) => (
                            <div key={post._id} className="glass-card p-6 animate-fade-in">
                                <div className="flex gap-4 mb-4">
                                    <img 
                                        src={post.author.profile?.profilePic || 'https://via.placeholder.com/40'} 
                                        alt={post.author.name} 
                                        className="w-12 h-12 rounded-full ring-2 ring-indigo-500/20"
                                    />
                                    <div>
                                        <h3 className="font-bold text-lg hover:text-indigo-400 transition-colors cursor-pointer">
                                            {post.author.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <span>{post.author.profile?.branch}</span>
                                            <span>•</span>
                                            <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-slate-200 mb-6 leading-relaxed whitespace-pre-wrap">
                                    {post.content.text}
                                </p>

                                {post.content.images && post.content.images.length > 0 && (
                                     <div className="rounded-xl overflow-hidden border border-slate-700/50 mb-6">
                                        <img src={post.content.images[0]} alt="Post" className="w-full h-auto object-cover max-h-96" />
                                     </div>
                                )}

                                <div className="flex items-center gap-6 pt-6 border-t border-slate-700/50">
                                    <button 
                                        onClick={() => handleLike(post._id)}
                                        className={`flex items-center gap-2 text-sm transition-colors ${post.likes.includes(user?._id || '') ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}
                                    >
                                        <Heart size={18} fill={post.likes.includes(user?._id || '') ? 'currentColor' : 'none'} />
                                        <span>{post.likes.length}</span>
                                    </button>
                                    <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                                        <MessageCircle size={18} />
                                        <span>{post.comments.length}</span>
                                    </button>
                                    <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                                        <Share2 size={18} />
                                        <span>Share</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Sidebar Suggestions */}
            <div className="w-80 space-y-6 hidden lg:block">
                <div className="glass-card p-6">
                    <div className="flex items-center gap-2 mb-4 text-indigo-400">
                        <TrendingUp size={18} />
                        <h4 className="font-bold">Trending Topics</h4>
                    </div>
                    <div className="space-y-4">
                        {['#Hackathon2024', '#InternshipAlert', '#FinalYearProjects', '#CampusLife'].map(tag => (
                            <div key={tag} className="group cursor-pointer">
                                <p className="text-slate-200 font-medium group-hover:text-indigo-400 transition-colors">{tag}</p>
                                <p className="text-xs text-slate-500">1.2k posts</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card p-6">
                    <div className="flex items-center gap-2 mb-4 text-emerald-400">
                        <Users size={18} />
                        <h4 className="font-bold">Student Spotlight</h4>
                    </div>
                    <div className="space-y-4 text-center">
                        <p className="text-sm text-slate-400">Top contributors this week</p>
                        <div className="flex justify-center -space-x-4">
                            {[1, 2, 3, 4].map(i => (
                               <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-10 h-10 rounded-full border-2 border-slate-800 ring-2 ring-indigo-500/20" alt="avatar" />
                            ))}
                        </div>
                        <button className="text-sm text-indigo-400 hover:underline">View leaderboard</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
