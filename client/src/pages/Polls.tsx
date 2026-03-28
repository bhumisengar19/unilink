import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { BarChart3, Plus, Clock, Users, Vote, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Option {
    _id: string;
    text: string;
    votes: string[];
}

interface Poll {
    _id: string;
    question: string;
    options: Option[];
    author: {
        _id: string;
        name: string;
        profile: { profilePic: string };
    };
    expiresAt: string;
    createdAt: string;
}

const Polls: React.FC = () => {
    const { user } = useAuth();
    const { socket } = useChat();
    const [polls, setPolls] = useState<Poll[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        question: '',
        options: ['', ''],
        expiresHours: 24
    });

    const fetchPolls = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user?.accessToken}` } };
            const { data } = await axios.get('/api/polls', config);
            setPolls(data.polls || []);
        } catch (error) {
            console.error('Error fetching polls:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPolls();
        
        if (socket) {
            socket.on('newPoll', (newPoll: Poll) => {
                setPolls(prev => [newPoll, ...prev]);
            });
            socket.on('updatePoll', (updatedPoll: Poll) => {
                setPolls(prev => prev.map(p => p._id === updatedPoll._id ? updatedPoll : p));
            });
        }
        
        return () => {
            if (socket) {
                socket.off('newPoll');
                socket.off('updatePoll');
            }
        };
    }, [socket]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user?.accessToken}` } };
            const payload = {
                ...formData,
                options: formData.options.filter(o => o.trim())
            };
            await axios.post('/api/polls', payload, config);
            setShowModal(false);
            setFormData({ question: '', options: ['', ''], expiresHours: 24 });
        } catch (error) {
            console.error('Error creating poll:', error);
        }
    };

    const handleVote = async (pollId: string, optionId: string) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user?.accessToken}` } };
            await axios.put(`/api/polls/${pollId}/vote`, { optionId }, config);
        } catch (error) {
            console.error('Error voting:', error);
        }
    };

    const getOptionStats = (options: Option[]) => {
        const total = options.reduce((acc, opt) => acc + opt.votes.length, 0);
        return options.map(opt => ({
            ...opt,
            percent: total === 0 ? 0 : Math.round((opt.votes.length / total) * 100)
        }));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in relative pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass-card p-8 border-t-4 border-t-indigo-500">
                <div>
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-3">
                        <BarChart3 size={32} className="text-indigo-400" />
                        Campus Polls
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium text-sm">Real-time voting on campus topics.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="btn-primary py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600"
                >
                    <Plus size={20} /> New Poll
                </button>
            </div>

            <div className="space-y-6">
                {polls.map(poll => {
                    const stats = getOptionStats(poll.options);
                    const hasVoted = poll.options.some(opt => opt.votes.includes(user?._id || ''));
                    const totalVotes = poll.options.reduce((acc, opt) => acc + opt.votes.length, 0);

                    return (
                        <div key={poll._id} className="glass-card p-8 space-y-6 border border-slate-700/50 group hover:border-indigo-500/30 transition-all">
                            <div className="flex items-center gap-4 border-b border-slate-700/50 pb-4">
                                <img src={poll.author.profile?.profilePic || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-full" alt="author" />
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-100">{poll.author.name} asked:</h3>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <Clock size={12} /> {formatDistanceToNow(new Date(poll.createdAt))} ago
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1.5 text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-lg border border-indigo-400/20 font-bold text-xs uppercase tracking-wider">
                                       <Users size={12} /> {totalVotes} votes
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-slate-100 leading-tight">{poll.question}</h2>

                            <div className="space-y-4 pt-2">
                                {stats.map(opt => (
                                    <button
                                        key={opt._id}
                                        onClick={() => handleVote(poll._id, opt._id)}
                                        className="w-full relative h-14 rounded-xl border border-slate-700 hover:border-indigo-500 bg-slate-800/20 overflow-hidden group/opt group-hover:shadow-lg transition-all"
                                    >
                                        <div 
                                            className="absolute inset-y-0 left-0 bg-indigo-500/10 transition-all duration-1000"
                                            style={{ width: `${opt.percent}%` }}
                                        />
                                        <div className="relative px-6 flex justify-between items-center h-full">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${opt.votes.includes(user?._id || '') ? 'border-indigo-500 bg-indigo-500' : 'border-slate-500'}`}>
                                                    {opt.votes.includes(user?._id || '') && <Vote size={12} className="text-white" />}
                                                </div>
                                                <span className={`font-bold transition-colors ${opt.votes.includes(user?._id || '') ? 'text-indigo-400' : 'text-slate-300'}`}>{opt.text}</span>
                                            </div>
                                            <span className="text-slate-400 font-bold font-mono">{opt.percent}%</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
                    <div className="bg-slate-800 rounded-3xl p-8 w-full max-w-lg border border-slate-700 shadow-2xl animate-fade-in relative">
                        <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white"><Plus className="rotate-45" size={24} /></button>
                        <h2 className="text-2xl font-bold mb-6 text-slate-100 flex items-center gap-2"><BarChart3 className="text-indigo-400" /> Create Campus Poll</h2>
                        <form onSubmit={handleCreate} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Question</label>
                                <textarea 
                                    required 
                                    value={formData.question} 
                                    onChange={e => setFormData({...formData, question: e.target.value})} 
                                    className="input-field bg-slate-900 border-slate-700 min-h-[100px]"
                                    placeholder="What do you want to ask?"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Options</label>
                                {formData.options.map((opt, i) => (
                                    <input 
                                        key={i}
                                        required 
                                        type="text" 
                                        value={opt} 
                                        onChange={e => {
                                            const newOps = [...formData.options];
                                            newOps[i] = e.target.value;
                                            setFormData({...formData, options: newOps});
                                        }} 
                                        className="input-field bg-slate-900 border-slate-700 h-12"
                                        placeholder={`Option ${i + 1}`}
                                    />
                                ))}
                                {formData.options.length < 5 && (
                                    <button 
                                        type="button" 
                                        onClick={() => setFormData({...formData, options: [...formData.options, '']})}
                                        className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                                    >
                                        <Plus size={14} /> Add another option
                                    </button>
                                )}
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 text-slate-300 hover:text-white font-bold rounded-xl transition-colors">Cancel</button>
                                <button type="submit" className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 hover:scale-105">
                                    <Send size={18} /> Launch Poll
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Polls;
