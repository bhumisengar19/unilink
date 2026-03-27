import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { Bot, Send, User, Sparkles, MessageCircle, MoreVertical, Plus, Trash2, Zap, BrainCircuit, Search, Calendar, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Assistant: React.FC = () => {
    const [messages, setMessages] = useState<any[]>([
        { role: 'assistant', content: "Hello! I'm your UniLink AI Guide. I can help you find teammates, discover campus events, or explain how to earn more points. What's on your mind today?" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setIsTyping(true);

        try {
            const { data } = await api.post('/api/ai/chat', { message: userMsg });
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        } catch (error) {
            console.error('AI Error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Hmm, my campus brain is a bit fuzzy right now. Please try again or check our documentation!" }]);
        } finally {
            setIsTyping(false);
        }
    };

    const suggestions = [
        { label: 'Find a React Dev', icon: Cpu, color: 'text-indigo-400' },
        { label: 'Next Hackathon', icon: Calendar, color: 'text-emerald-400' },
        { label: 'How to earn points?', icon: Zap, color: 'text-rose-400' }
    ];

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col gap-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between glass-card p-6 bg-gradient-to-r from-indigo-500/10 to-transparent">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                        <Bot size={28} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white flex items-center gap-2 italic">
                            UniAssistant
                            <Sparkles className="text-emerald-400" size={16} />
                        </h2>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            Active Response Core v2.4
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setMessages([messages[0]])} className="p-3 text-slate-500 hover:text-rose-400 transition-colors bg-slate-900/50 rounded-xl border border-white/5"><Trash2 size={18} /></button>
                    <button className="p-3 text-slate-500 hover:text-white transition-colors bg-slate-900/50 rounded-xl border border-white/5"><MoreVertical size={18} /></button>
                </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 glass-card p-8 overflow-y-auto scrollbar-hide space-y-8 bg-slate-950/20 backdrop-blur-xl border-white/5">
                <AnimatePresence initial={false}>
                    {messages.map((msg, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/10 shadow-lg ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-indigo-400'}`}>
                                    {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                                </div>
                                <div className={`p-5 rounded-3xl text-sm font-medium leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-indigo-500/10 text-slate-200 border border-indigo-500/20 rounded-tr-none' : 'bg-slate-900/60 text-slate-300 border border-slate-800/50 rounded-tl-none'}`}>
                                    {msg.content}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 border border-white/10"><Bot size={18} /></div>
                        <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-3xl flex gap-1.5 items-center">
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                        </div>
                    </motion.div>
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input & Suggestions */}
            <div className="space-y-4">
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-2">
                    {suggestions.map(s => (
                        <button 
                           key={s.label}
                           onClick={() => { setInput(s.label); handleSendMessage(); }}
                           className="whitespace-nowrap flex items-center gap-2 px-5 py-2.5 glass-card bg-slate-900/60 border-slate-800 text-[11px] font-black uppercase text-slate-300 hover:bg-slate-800 hover:border-indigo-500/30 hover:text-indigo-400 transition-all active:scale-95"
                        >
                           <s.icon size={14} className={s.color} />
                           <span>{s.label}</span>
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSendMessage} className="relative group">
                    <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity" />
                    <div className="glass-card flex items-center p-2 pl-6 pr-2 bg-slate-900/80 border-slate-800/50 transition-all border-white/10">
                        <Plus className="text-slate-500 mr-4 cursor-pointer hover:text-indigo-400 transition-colors" size={20} />
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask UniAssistant anything..." 
                            className="bg-transparent border-none focus:outline-none text-slate-100 flex-1 h-12 text-sm font-medium pr-10"
                        />
                        <button 
                            type="submit"
                            disabled={!input.trim()}
                            className="btn-primary w-12 h-12 flex items-center justify-center rounded-2xl disabled:opacity-50 disabled:grayscale transition-all active:scale-90"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </form>

                <p className="text-[9px] text-center text-slate-600 font-bold uppercase tracking-widest pt-2">Powered by UniBrain Neural Core • Privacy Focused Campus AI</p>
            </div>
        </div>
    );
};

export default Assistant;
