import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Play, Heart, MessageCircle, Share2, Music, User as UserIcon, Plus, X, Upload } from 'lucide-react';

interface Reel {
    _id: string;
    caption: string;
    videoUrl: string;
    author: {
        _id: string;
        name: string;
        profile: { profilePic: string };
    };
    likes: string[];
}

const Reels: React.FC = () => {
    const { user } = useAuth();
    const [reels, setReels] = useState<Reel[]>([]);
    const [loading, setLoading] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const [caption, setCaption] = useState('');

    const fetchReels = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user?.accessToken}` } };
            const { data } = await axios.get('/api/reels', config);
            setReels(data.reels || []);
        } catch (error) {
            console.error('Error fetching reels:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReels();
    }, []);

    const handleLike = async (id: string) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user?.accessToken}` } };
            const { data } = await axios.put(`/api/reels/${id}/like`, {}, config);
            setReels(prev => prev.map(r => r._id === id ? { ...r, likes: data.likes } : r));
        } catch (error) {
            console.error('Error liking reel:', error);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user?.accessToken}` } };
            await axios.post('/api/reels', { caption, videoUrl }, config);
            setShowUpload(false);
            setCaption('');
            setVideoUrl('');
            fetchReels();
        } catch (error) {
            console.error('Error uploading reel:', error);
        }
    };

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col max-w-lg mx-auto bg-black relative shadow-2xl overflow-hidden rounded-3xl group">
             {/* Feed container */}
            <div className="flex-1 overflow-y-auto snap-y snap-mandatory no-scrollbar bg-slate-950">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                         <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                         <p className="font-bold text-sm uppercase tracking-widest">Loading campus reels...</p>
                    </div>
                ) : reels.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 text-center bg-slate-900/50">
                         <Upload size={48} className="mb-4 opacity-50" />
                         <p className="text-xl font-bold text-slate-200">No reels found</p>
                         <p className="text-sm mt-2">Start the trend! Upload the first campus reel.</p>
                         <button onClick={() => setShowUpload(true)} className="mt-6 btn-primary py-2 px-8">Upload Video</button>
                    </div>
                ) : (
                    reels.map(reel => (
                        <div key={reel._id} className="h-full w-full snap-start relative flex flex-col justify-end p-6">
                            {/* Background Video (Simulator using placeholder if not a real link) */}
                            <video 
                                src={reel.videoUrl} 
                                className="absolute inset-0 w-full h-full object-cover z-0"
                                autoPlay
                                muted
                                loop
                                playsInline
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10 pointer-events-none"></div>

                            {/* Sidebar Actions */}
                            <div className="absolute right-4 bottom-24 flex flex-col gap-6 z-20 items-center">
                                <button 
                                    onClick={() => handleLike(reel._id)}
                                    className="flex flex-col items-center gap-1 group"
                                >
                                    <div className={`p-3 rounded-full backdrop-blur-md transition-all ${reel.likes.includes(user?._id || '') ? 'bg-rose-500' : 'bg-white/10 group-hover:bg-white/20'}`}>
                                        <Heart size={24} fill={reel.likes.includes(user?._id || '') ? 'white' : 'none'} className="text-white" />
                                    </div>
                                    <span className="text-[10px] font-black text-white drop-shadow-lg">{reel.likes.length}</span>
                                </button>
                                <button className="flex flex-col items-center gap-1 group">
                                    <div className="p-3 rounded-full bg-white/10 backdrop-blur-md group-hover:bg-white/20 transition-all">
                                        <MessageCircle size={24} className="text-white" />
                                    </div>
                                    <span className="text-[10px] font-black text-white drop-shadow-lg">24</span>
                                </button>
                                <button className="flex flex-col items-center gap-1 group">
                                    <div className="p-3 rounded-full bg-white/10 backdrop-blur-md group-hover:bg-white/20 transition-all">
                                        <Share2 size={24} className="text-white" />
                                    </div>
                                    <span className="text-[10px] font-black text-white drop-shadow-lg">Share</span>
                                </button>
                            </div>

                            {/* Content Info */}
                            <div className="z-20 space-y-4 max-w-[85%]">
                                <div className="flex items-center gap-3">
                                    <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500">
                                        <img src={reel.author.profile?.profilePic || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-full border-2 border-black" alt="avatar" />
                                    </div>
                                    <h3 className="font-bold text-lg text-white drop-shadow-md">{reel.author.name}</h3>
                                    <button className="text-[10px] font-black px-2 py-1 border border-white rounded-md text-white hover:bg-white hover:text-black transition-colors uppercase">Follow</button>
                                </div>
                                <p className="text-sm text-white/90 font-medium leading-relaxed line-clamp-2 drop-shadow-md">
                                    {reel.caption}
                                </p>
                                <div className="flex items-center gap-2 text-white/60 text-xs mt-2 overflow-hidden w-full">
                                     <Music size={14} />
                                     <span className="animate-marquee whitespace-nowrap">Original Audio • University Sounds</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Floating Upload Toggle */}
            <button 
                onClick={() => setShowUpload(true)}
                className="absolute top-6 right-6 z-30 p-2.5 bg-white/20 backdrop-blur-lg rounded-full text-white border border-white/20 hover:scale-110 transition-transform"
            >
                <Plus size={24} />
            </button>

            {showUpload && (
                <div className="absolute inset-0 z-50 bg-slate-900 p-8 flex flex-col justify-center animate-slide-up">
                    <button onClick={() => setShowUpload(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white"><X size={32} /></button>
                     <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3"><Play className="text-indigo-400" /> Share a Reel</h2>
                     <form onSubmit={handleUpload} className="space-y-6">
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Video Source (Link)</label>
                            <input 
                                required
                                type="url" 
                                value={videoUrl} 
                                onChange={e => setVideoUrl(e.target.value)} 
                                className="w-full bg-slate-800 border-none rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-600"
                                placeholder="Paste mp4 link (Cloudinary, etc.)"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Caption</label>
                            <textarea
                                required
                                value={caption}
                                onChange={e => setCaption(e.target.value)}
                                className="w-full bg-slate-800 border-none rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-600 resize-none min-h-[120px]"
                                placeholder="What's happening? #campus #vibe"
                            />
                        </div>
                        <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all">
                             Post University Reel
                        </button>
                     </form>
                </div>
            )}
        </div>
    );
};

export default Reels;
