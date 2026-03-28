import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Search, Loader2, Sparkles, MessageCircle, UserPlus, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Network: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [skillsQuery, setSkillsQuery] = useState('');
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [connectingId, setConnectingId] = useState<string | null>(null);
    const [connectedList, setConnectedList] = useState<string[]>((user as any)?.connections || []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user?.accessToken}` } };
            const params = new URLSearchParams();
            
            if (searchQuery) params.append('search', searchQuery);
            // Splitting skills by comma and trimming spaces for clean query
            if (skillsQuery) {
                const cleanSkills = skillsQuery.split(',').map(s => s.trim()).filter(s => s).join(',');
                if (cleanSkills) params.append('skills', cleanSkills);
            }

            const { data } = await axios.get(`/api/users?${params.toString()}`, config);
            setUsers(data.users || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchUsers();
    };

    const handleConnect = async (userId: string) => {
        setConnectingId(userId);
        try {
            const config = { headers: { Authorization: `Bearer ${user?.accessToken}` } };
            await axios.post(`/api/users/connect/${userId}`, {}, config);
            // Optimistically update UI to show request sent
            setConnectedList(prev => [...prev, userId]);
        } catch (error: any) {
            console.error('Connection failed:', error.response?.data?.message || error.message);
        } finally {
            setConnectingId(null);
        }
    };

    const openChat = async (userId: string) => {
        try {
             const config = { headers: { Authorization: `Bearer ${user?.accessToken}` } };
             await axios.post('/api/chats', { userId }, config);
             navigate('/chat');
        } catch (error) {
             console.error('Error opening chat:', error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto animate-fade-in space-y-8">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass-card p-8">
                <div>
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent flex items-center gap-3">
                        <Sparkles size={32} className="text-emerald-400" />
                        Team Builder & Network
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium">Find teammates tailored to your project stack, or discover peers.</p>
                </div>
                <div className="flex gap-2 bg-slate-800/50 p-1.5 rounded-2xl border border-slate-700/50">
                     <span className="px-4 py-2 bg-indigo-500/20 text-indigo-400 font-bold rounded-xl text-sm">Active Students: {users.length}</span>
                </div>
            </div>

            {/* Filter / Search Bar */}
            <form onSubmit={handleSearchSubmit} className="glass-card p-6 grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by name..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field pl-12 h-14 bg-slate-900/50"
                    />
                </div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pr-3 pointer-events-none">
                        <span className="text-slate-500 font-bold text-sm">Skills:</span>
                    </div>
                    <input 
                        type="text" 
                        placeholder="React, Python, UI Design (comma separated)" 
                        value={skillsQuery}
                        onChange={(e) => setSkillsQuery(e.target.value)}
                        className="input-field pl-16 h-14 bg-slate-900/50 border-emerald-500/30 focus:border-emerald-500"
                    />
                </div>
                <button 
                    type="submit" 
                    className="h-14 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:opacity-90 text-white font-bold px-8 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                >
                    Find Match
                </button>
            </form>

            {/* Results Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
                    <Loader2 className="animate-spin text-emerald-500" size={40} />
                    <p className="font-bold">Scanning campus registry...</p>
                </div>
            ) : users.length === 0 ? (
                <div className="glass-card p-12 text-center text-slate-400 border-dashed border-2 border-slate-700">
                     <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700"><Search size={24} /></div>
                     <h3 className="text-xl font-bold text-slate-200 mb-2">No matches found</h3>
                     <p>Try adjusting your skill filters or search parameters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {users.map(u => (
                        <div key={u._id} className="glass-card p-6 flex flex-col gap-4 group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden text-center bg-slate-800/40">
                            {/* Compatibility Score Simulation based on mutual skills could go here */}
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
                            
                            <img src={u.profile?.profilePic || 'https://via.placeholder.com/80'} alt="Profile" className="w-20 h-20 rounded-2xl mx-auto shadow-xl shadow-slate-900 border-2 border-slate-700" />
                            
                            <div>
                                <h3 className="text-xl font-black text-slate-100">{u.name}</h3>
                                <p className="text-sm font-semibold text-slate-400 mb-1">{u.profile?.branch || 'Unknown Branch'} • {u.profile?.year || 'Unknown Year'}</p>
                                <p className="text-xs text-slate-500 italic line-clamp-2 min-h-[32px]">{u.profile?.bio || 'No bio provided.'}</p>
                            </div>

                            {/* Skills tags */}
                            <div className="flex flex-wrap gap-2 justify-center mt-auto">
                                {(u.profile?.skills?.length > 0 ? u.profile.skills.slice(0, 3) : ['No skills added']).map((skill: string, i: number) => (
                                    <span key={i} className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 bg-slate-900 border border-slate-700 text-indigo-300 rounded-md">
                                        {skill}
                                    </span>
                                ))}
                                {u.profile?.skills?.length > 3 && <span className="text-[10px] px-2 py-1 text-slate-500">+{u.profile.skills.length - 3}</span>}
                            </div>

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-700/50">
                                <button 
                                    onClick={() => handleConnect(u._id)}
                                    disabled={connectingId === u._id || connectedList.includes(u._id)}
                                    className={`h-10 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-colors ${
                                        connectedList.includes(u._id)
                                        ? 'bg-emerald-500/10 text-emerald-400 cursor-not-allowed'
                                        : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                    }`}
                                >
                                    {connectingId === u._id ? <Loader2 size={16} className="animate-spin" /> : 
                                     connectedList.includes(u._id) ? <><CheckCircle2 size={16}/> Sent</> : <><UserPlus size={16}/> Connect</>}
                                </button>
                                <button 
                                    onClick={() => openChat(u._id)}
                                    className="h-10 rounded-xl bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center gap-2 text-sm font-bold transition-colors"
                                >
                                    <MessageCircle size={16} /> Chat
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Network;
