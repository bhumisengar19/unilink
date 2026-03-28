import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Users, Plus, BookOpen, Clock, Play, Pause, RefreshCw, MessageCircle } from 'lucide-react';

interface StudyRoom {
    _id: string;
    name: string;
    description: string;
    topic: string;
    createdBy: {
        _id: string;
        name: string;
    };
    members: string[];
}

const Pomodoro: React.FC = () => {
    const [seconds, setSeconds] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval: any = null;
        if (isActive && seconds > 0) {
            interval = setInterval(() => {
                setSeconds((prev) => prev - 1);
            }, 1000);
        } else if (seconds === 0) {
            clearInterval(interval);
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="glass-card p-6 flex flex-col items-center">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-400">
                <Clock size={20} /> Pomodoro Timer
            </h3>
            <div className="text-5xl font-mono mb-6 bg-slate-900 rounded-2xl px-8 py-4 border border-indigo-500/20 text-white">
                {formatTime(seconds)}
            </div>
            <div className="flex gap-4">
                <button 
                    onClick={() => setIsActive(!isActive)}
                    className={`btn-primary px-6 py-2 flex items-center gap-2 ${isActive ? 'bg-orange-600' : ''}`}
                >
                    {isActive ? <Pause size={18} /> : <Play size={18} />}
                    {isActive ? 'Pause' : 'Start'}
                </button>
                <button 
                    onClick={() => { setSeconds(25 * 60); setIsActive(false); }}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl transition-all"
                >
                    <RefreshCw size={18} />
                </button>
            </div>
        </div>
    );
};

const StudyRooms: React.FC = () => {
    const { user } = useAuth();
    const [rooms, setRooms] = useState<StudyRoom[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', topic: '' });

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user?.accessToken}` } };
            const { data } = await axios.get('/api/study-rooms', config);
            setRooms(data.rooms || []);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user?.accessToken}` } };
            await axios.post('/api/study-rooms', formData, config);
            setShowModal(false);
            setFormData({ name: '', description: '', topic: '' });
            fetchRooms();
        } catch (error) {
            console.error('Error creating room:', error);
        }
    };

    const joinRoom = async (id: string) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user?.accessToken}` } };
            await axios.post(`/api/study-rooms/${id}/join`, {}, config);
            fetchRooms();
            // In a full implementation, this could redirect to a dedicated room view
            alert('Joined room successfully!');
        } catch (error) {
            console.error('Error joining room:', error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass-card p-8 border-t-4 border-t-cyan-500">
                <div>
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent flex items-center gap-3">
                        <BookOpen size={32} className="text-cyan-400" />
                        Virtual Study Rooms
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium text-sm">Collaborate in real-time with fellow students.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="btn-primary py-3 px-6 bg-gradient-to-r from-cyan-600 to-indigo-600 shadow-cyan-500/20"
                >
                    <Plus size={20} /> Create Room
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Timer Section */}
                <div className="md:col-span-1 space-y-6">
                    <Pomodoro />
                    <div className="glass-card p-6 bg-slate-800/20">
                        <h4 className="font-bold text-slate-200 mb-4">Focus Mode</h4>
                        <p className="text-xs text-slate-400 mb-4">Focus mode helps you stay productive by turning off distractions.</p>
                        <button className="w-full py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl font-bold hover:bg-indigo-500/20 transition-all">
                             Activate Focus
                        </button>
                    </div>
                </div>

                {/* Rooms List Section */}
                <div className="md:col-span-2 space-y-4">
                    <h2 className="text-2xl font-bold text-slate-200 flex items-center gap-2">
                        <Users size={24} className="text-indigo-400" /> Available Rooms
                    </h2>
                    {loading ? (
                       <div className="flex justify-center p-20"><div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div></div>
                    ) : rooms.length === 0 ? (
                        <div className="glass-card p-12 text-center text-slate-400">
                            No rooms available. Create one to get started!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {rooms.map(room => (
                                <div key={room._id} className="glass-card p-6 flex justify-between items-center group hover:border-indigo-500/50 transition-all border border-slate-700/50">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold text-slate-100">{room.name}</h3>
                                        <p className="text-sm text-slate-400">{room.description}</p>
                                        <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-indigo-400">
                                            <span>Topic: {room.topic}</span>
                                            <span>{room.members.length} Active Students</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => joinRoom(room._id)}
                                            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold transition-all border border-slate-600"
                                        >
                                            Join
                                        </button>
                                        <button className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl hover:bg-indigo-500/20 transition-all">
                                            <MessageCircle size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
                    <div className="bg-slate-800 rounded-3xl p-8 w-full max-w-lg border border-slate-700 shadow-2xl animate-fade-in relative">
                        <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white"><Plus className="rotate-45" size={24} /></button>
                        <h2 className="text-2xl font-bold mb-6 text-slate-100 flex items-center gap-2"><BookOpen className="text-cyan-400" /> Create Room</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Room Name</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-field bg-slate-900/50" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Topic</label>
                                <input required type="text" value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})} className="input-field bg-slate-900/50" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input-field bg-slate-900/50 min-h-[100px] resize-none"></textarea>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 text-slate-300 hover:text-white font-bold rounded-xl hover:bg-slate-700 transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg transition-all">Create Room</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudyRooms;
