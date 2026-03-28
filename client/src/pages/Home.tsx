import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { Heart, MessageCircle, Share2, Image as ImageIcon, TrendingUp, Users, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface Post {
    _id: string;
    content: { text: string, images: string[] };
    author: { name: string, profile: { profilePic: string, branch: string } };
    likes: string[];
    comments: any[];
    isAnonymous?: boolean;
    createdAt: string;
}

const Home: React.FC = () => {
    const { user } = useAuth();
    const { socket } = useChat();
    const [posts, setPosts] = useState<Post[]>([]);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [newPostText, setNewPostText] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user?.accessToken}` } };
            const [postsRes, lbRes] = await Promise.all([
                axios.get('/api/posts'),
                axios.get('/api/users/leaderboard', config)
            ]);
            setPosts(postsRes.data.posts);
            setLeaderboard(lbRes.data.users);
        } catch (error) {
            console.error('Error fetching home data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

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
            await axios.post('/api/posts', { text: newPostText, isAnonymous }, config);
            setNewPostText('');
            setIsAnonymous(false);
            fetchData();
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
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-8">
                {/* Create Post */}
                <Card variant="neu" className="p-6 border-none !rounded-[24px]">
                    <div className="flex gap-4">
                        <img 
                            src={user?.profile?.profilePic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'} 
                            alt="Profile" 
                            className="w-12 h-12 rounded-2xl border-2 border-[var(--accent)] object-cover shadow-sm"
                        />
                        <div className="flex-1">
                            <textarea 
                                placeholder="What's on your mind?" 
                                value={newPostText}
                                onChange={(e) => setNewPostText(e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-0 text-[var(--text-main)] placeholder:text-[var(--text-muted)] text-lg resize-none min-h-[100px] font-medium"
                            />
                            <div className="flex items-center justify-between pt-4 border-t border-[var(--shadow-dark)]">
                                <div className="flex gap-2 items-center">
                                     <button type="button" className="p-3 text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--shadow-dark)] rounded-xl transition-all">
                                        <ImageIcon size={20} />
                                     </button>
                                     <label className="flex items-center gap-2 cursor-pointer group ml-2">
                                         <input 
                                            type="checkbox" 
                                            checked={isAnonymous} 
                                            onChange={(e) => setIsAnonymous(e.target.checked)}
                                            className="w-4 h-4 rounded border-[var(--shadow-dark)] bg-[var(--bg)] text-[var(--accent)] focus:ring-[var(--accent)]"
                                         />
                                         <span className="text-xs font-bold text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors uppercase tracking-wider">Anonymous</span>
                                     </label>
                                </div>
                                <Button onClick={handleCreatePost} className="px-6 py-2.5">
                                    <Send size={18} />
                                    <span>Post</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Feed */}
                <div className="space-y-8">
                    {loading ? (
                        [1,2,3].map(i => <div key={i} className="h-64 neu-card animate-pulse rounded-[24px]" />)
                    ) : (
                        posts.map((post) => (
                            <Card key={post._id} variant="neu" className="p-8 border-none !rounded-[32px] group">
                                <div className="flex gap-4 mb-6">
                                    <img 
                                        src={post.author.profile?.profilePic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'} 
                                        alt={post.author.name} 
                                        className="w-14 h-14 rounded-2xl border-2 border-[var(--accent)] object-cover shadow-md"
                                    />
                                    <div>
                                        <h3 className="font-black text-xl text-[var(--text-main)] transition-colors hover:text-[var(--accent)] cursor-pointer">
                                            {post.author.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">
                                            <span>{post.author.profile?.branch}</span>
                                            <span className="opacity-30">•</span>
                                            <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-[var(--text-main)] text-lg mb-8 leading-relaxed whitespace-pre-wrap font-medium opacity-90">
                                    {post.content.text}
                                </p>

                                {post.content.images && post.content.images.length > 0 && (
                                     <div className="rounded-3xl overflow-hidden mb-8 shadow-inner bg-[var(--shadow-dark)]">
                                        <img 
                                            src={post.content.images[0]} 
                                            alt="Post" 
                                            className="w-full h-auto object-cover max-h-[500px] hover:scale-105 transition-transform duration-700" 
                                        />
                                     </div>
                                )}

                                <div className="flex items-center gap-8 border-t border-[var(--shadow-dark)] pt-6">
                                    <button 
                                        onClick={() => handleLike(post._id)}
                                        className={`flex items-center gap-2.5 font-bold text-sm transition-all scale-100 hover:scale-110 active:scale-90 ${post.likes.includes(user?._id || '') ? 'text-rose-500' : 'text-[var(--text-muted)] hover:text-rose-500'}`}
                                    >
                                        <Heart size={22} fill={post.likes.includes(user?._id || '') ? 'currentColor' : 'none'} strokeWidth={2.5} />
                                        <span>{post.likes.length}</span>
                                    </button>
                                    <button className="flex items-center gap-2.5 font-bold text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-all scale-100 hover:scale-110">
                                        <MessageCircle size={22} strokeWidth={2.5} />
                                        <span>{post.comments.length}</span>
                                    </button>
                                    <button className="flex items-center gap-2.5 font-bold text-sm text-[var(--text-muted)] hover:text-emerald-500 transition-all scale-100 hover:scale-110 ml-auto">
                                        <Share2 size={22} strokeWidth={2.5} />
                                        <span className="hidden sm:inline">Share</span>
                                    </button>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-full lg:w-96 space-y-8">
                <Card variant="neu" className="p-8 border-none !rounded-[32px]">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-500">
                            <TrendingUp size={24} strokeWidth={3} />
                        </div>
                        <h4 className="font-black text-xl tracking-tight uppercase tracking-widest">Trending</h4>
                    </div>
                    <div className="space-y-6">
                        {['#Hackathon2024', '#InternshipAlert', '#FinalYearProjects', '#CampusLife'].map(tag => (
                            <div key={tag} className="group cursor-pointer p-4 rounded-2xl hover:bg-[var(--shadow-dark)] transition-all">
                                <p className="text-[var(--text-main)] font-black text-lg group-hover:text-[var(--accent)] transition-colors">{tag}</p>
                                <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-tighter mt-1">1.2k students sharing</p>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card variant="neu" className="p-8 border-none !rounded-[32px]">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500">
                            <Users size={24} strokeWidth={3} />
                        </div>
                        <h4 className="font-black text-xl tracking-tight uppercase tracking-widest">Top Students</h4>
                    </div>
                    <div className="space-y-4">
                        {leaderboard.slice(0, 5).map((u, i) => (
                            <div key={u._id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-[var(--shadow-dark)] transition-all">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-black text-[var(--text-muted)] w-4">{i + 1}</span>
                                    <img 
                                        src={u.profile?.profilePic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'} 
                                        className="w-10 h-10 rounded-xl object-cover border-2 border-emerald-500/20" 
                                        alt="avatar" 
                                    />
                                    <span className="text-sm font-bold text-[var(--text-main)] truncate max-w-[120px]">{u.name}</span>
                                </div>
                                <span className="text-xs font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">{u.gamification.points} pts</span>
                            </div>
                        ))}
                    </div>
                    <Button variant="ghost" fullWidth className="mt-6 font-black text-xs uppercase tracking-widest">View Leaderboard</Button>
                </Card>
            </div>
        </div>
    );
};

export default Home;
