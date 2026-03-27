import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Timer, MessageSquare, Play, Pause, RotateCcw, Users, Zap, BookOpen, UserPlus, Shield, Sparkles, Send } from 'lucide-react';

const StudyRoom: React.FC = () => {
    const { user } = useAuth();
    const [rooms, setRooms] = useState<any[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<any>(null);
    const [timeLeft, setTimeLeft] = useState(1500); // 25 mins
    const [isRunning, setIsRunning] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [inputMsg, setInputMsg] = useState('');

    const fetchRooms = async () => {
        try {
            const { data } = await api.get('/api/rooms');
            setRooms(data.rooms);
            if (data.rooms.length > 0) setSelectedRoom(data.rooms[0]);
        } catch (error) {
            console.warn('Using Mock Rooms');
            setRooms([
                { _id: 'r1', name: 'Algrithms Focus Group', type: 'focus', description: 'Cracking LeetCode Hard together.', members: ['u1', 'u2', 'u3'] },
                { _id: 'r2', name: 'UI/UX Design Sprint', type: 'collaborative', description: 'Working on UniLink v2 mockups.', members: ['u4', 'u5'] }
            ]);
            setSelectedRoom({ _id: 'r1', name: 'Algorithms Focus Group' });
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    useEffect(() => {
        let timer: any;
        if (isRunning && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0) {
            setIsRunning(false);
            // Notify students or play sound?
        }
        return () => clearInterval(timer);
    }, [isRunning, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMsg.trim()) return;
        setMessages([...messages, { id: Date.now(), sender: user?.name, text: inputMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        setInputMsg('');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full animate-fade-in pb-12">
            {/* Rooms Sidebar */}
            <div className="lg:col-span-3 space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-xl font-black text-white italic">Active Rooms</h2>
                    <button className="p-2 bg-indigo-500 rounded-xl text-white shadow-lg shadow-indigo-500/20"><UserPlus size={18} /></button>
                </div>
                <div className="space-y-3 h-[calc(100vh-250px)] overflow-y-auto scrollbar-hide pr-2">
                    {rooms.map(room => (
                        <div 
                          key={room._id} 
                          onClick={() => setSelectedRoom(room)}
                          className={`glass-card p-4 group cursor-pointer border-white/5 transition-all ${selectedRoom?._id === room._id ? 'border-indigo-500 bg-indigo-500/5' : 'hover:bg-slate-800/40'}`}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 ${room.type === 'focus' ? 'bg-rose-500 text-white shadow-xl shadow-rose-500/10' : 'bg-slate-800 text-indigo-400'}`}>
                                    {room.type === 'focus' ? <Zap size={18} /> : <BookOpen size={18} />}
                                </div>
                                <h4 className="font-bold text-white text-sm line-clamp-1 italic">{room.name}</h4>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-tighter">
                                <Users size={12} />
                                {room.members?.length || 0} Students Co-working
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Room View */}
            <div className="lg:col-span-6 space-y-8">
                <div className="glass-card p-12 text-center bg-gradient-to-br from-slate-900 via-transparent to-indigo-500/10 border-white/5 relative overflow-hidden group">
                     {/* Background Glow */}
                     <div className="absolute inset-0 bg-indigo-500/5 blur-3xl rounded-full scale-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                     
                     <div className="relative">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-6 flex items-center justify-center gap-3">
                            <Sparkles size={14} className="animate-spin-slow" />
                            Synchronized Session
                        </p>
                        <h3 className="text-7xl md:text-9xl font-black text-white italic tracking-tighter mb-10 drop-shadow-2xl">
                            {formatTime(timeLeft)}
                        </h3>
                        
                        <div className="flex justify-center gap-6">
                            <button 
                                onClick={() => setIsRunning(!isRunning)}
                                className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all shadow-xl active:scale-95 ${isRunning ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-indigo-500 text-white shadow-indigo-500/20'}`}
                            >
                                {isRunning ? <Pause size={32} /> : <Play size={32} fill="currentColor" className="ml-1" />}
                            </button>
                            <button 
                                onClick={() => { setIsRunning(false); setTimeLeft(1500); }}
                                className="w-20 h-20 glass-card bg-slate-900/50 rounded-3xl flex items-center justify-center text-slate-500 hover:text-white transition-all border-white/5 shadow-xl"
                            >
                                <RotateCcw size={32} />
                            </button>
                        </div>
                     </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="glass-card p-6 border-white/5 bg-slate-900/40">
                         <div className="flex items-center gap-2 mb-3 text-emerald-400">
                             <Shield size={16} />
                             <h4 className="text-[10px] uppercase font-black tracking-widest leading-none">Focus Mode</h4>
                         </div>
                         <p className="text-xs text-slate-400 font-medium leading-relaxed">Notifications muted. Your status is now "Deep Focused" on the Campus Map.</p>
                    </div>
                    <div className="glass-card p-6 border-white/5 bg-slate-900/40">
                         <div className="flex items-center gap-2 mb-3 text-indigo-400">
                             <Timer size={16} />
                             <h4 className="text-[10px] uppercase font-black tracking-widest leading-none">Shared Timer</h4>
                         </div>
                         <p className="text-xs text-slate-400 font-medium leading-relaxed">Everybody in this room is on the same clock. Focus together, break together.</p>
                    </div>
                </div>
            </div>

            {/* Room Chat */}
            <div className="lg:col-span-3 flex flex-col gap-6 h-[calc(100vh-200px)]">
                 <div className="glass-card flex-1 flex flex-col overflow-hidden border-white/5 bg-slate-950/40 backdrop-blur-3xl relative">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
                    <div className="px-6 py-4 border-b border-slate-700/50 flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg"><MessageSquare size={16} /></div>
                        <h4 className="font-bold text-sm italic">Focus Chat</h4>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                        {messages.length === 0 && (
                            <div className="text-center py-10 opacity-30">
                                <MessageSquare size={32} className="mx-auto mb-3" />
                                <p className="text-[10px] font-black uppercase tracking-widest italic">Start collaborating</p>
                            </div>
                        )}
                        {messages.map((m: any) => (
                            <div key={m.id} className="animate-slide-up">
                                <div className="flex justify-between items-center mb-1.5 px-0.5">
                                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-tight italic">{m.sender}</span>
                                    <span className="text-[8px] font-bold text-slate-600 uppercase pt-0.5">{m.time}</span>
                                </div>
                                <div className="glass-card p-3 text-xs font-medium text-slate-300 border-white/5 bg-slate-900/60 leading-relaxed shadow-sm">
                                    {m.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSendMessage} className="p-4 bg-slate-900/20 border-t border-slate-700/30">
                        <div className="relative">
                            <input 
                                type="text" 
                                value={inputMsg}
                                onChange={(e) => setInputMsg(e.target.value)}
                                placeholder="Message focus group..." 
                                className="w-full glass-card h-12 pl-4 pr-12 bg-slate-950/80 border-white/5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-all"
                            />
                            <button type="submit" className="absolute right-2 top-2 w-8 h-8 flex items-center justify-center text-indigo-400 hover:text-white transition-colors">
                                <Send size={16} />
                            </button>
                        </div>
                    </form>
                 </div>
            </div>
        </div>
    );
};

export default StudyRoom;
