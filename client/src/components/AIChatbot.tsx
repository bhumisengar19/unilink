import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from './ui/Card';
import Button from './ui/Button';

interface ChatMessage {
    id: string;
    text: string;
    isBot: boolean;
}

const AIChatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{ id: 'init', text: `Hi ${user?.name}! I'm UniBot, your campus AI assistant. How can I help you today?`, isBot: true }]);
        }
    }, [isOpen, messages.length, user?.name]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userText = input.trim();
        const newMessage: ChatMessage = { id: Date.now().toString(), text: userText, isBot: false };
        setMessages(prev => [...prev, newMessage]);
        setInput('');
        setLoading(true);

        try {
            const config = { headers: { Authorization: `Bearer ${user?.accessToken}` } };
            const { data } = await axios.post('/api/ai/chat', { message: userText }, config);
            
            setMessages(prev => [...prev, { id: Date.now().toString() + 'bot', text: data.reply, isBot: true }]);
        } catch (error) {
            setMessages(prev => [...prev, { id: Date.now().toString() + 'err', text: "Sorry, I'm having trouble connecting right now. Try again later!", isBot: true }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-50">
            {/* Chatbot Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40 hover:scale-110 active:scale-90 transition-all duration-300 relative group border-2 border-white/20"
                >
                    <Bot size={32} strokeWidth={2.5} />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-400 border-4 border-[var(--bg)] rounded-full animate-pulse"></span>
                    <div className="absolute top-1/2 -translate-y-1/2 right-20 w-32 bg-[var(--card)] text-[10px] px-4 py-2.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap text-[var(--text-main)] font-black uppercase tracking-widest neu-card pointer-events-none scale-90 group-hover:scale-100">
                         Ask UniBot AI
                    </div>
                </button>
            )}

            {/* Chatbot Window */}
            {isOpen && (
                <Card variant="neu" className="w-80 md:w-96 flex flex-col h-[550px] max-h-[85vh] !p-0 !rounded-[32px] border-none shadow-[24px_24px_48px_rgba(0,0,0,0.15)] animate-fade-in origin-bottom-right overflow-hidden">
                    {/* Header */}
                    <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-700 flex justify-between items-center text-white shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md shadow-inner">
                                <Bot size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="font-black text-sm uppercase tracking-wider">UniBot AI</h3>
                                <div className="flex items-center gap-1 text-[10px] text-indigo-100 font-bold uppercase tracking-tighter opacity-80">
                                    <Sparkles size={10} strokeWidth={3} /> Smart Assistant
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all active:scale-90 shadow-sm">
                            <X size={20} strokeWidth={3} />
                        </button>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-transparent no-scrollbar relative">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[85%] rounded-[24px] px-5 py-4 text-sm font-medium leading-relaxed shadow-sm ${
                                    msg.isBot 
                                    ? 'bg-[var(--bg)] text-[var(--text-main)] shadow-[inset_2px_2px_5px_var(--shadow-dark),inset_-2px_-2px_5px_var(--shadow-light)] rounded-tl-none' 
                                    : 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/20 rounded-tr-none'
                                }`}>
                                    {msg.text.split('\\n').map((line, i) => (
                                        <p key={i} className="mb-2 last:mb-0">{line}</p>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-[var(--bg)] text-indigo-500 shadow-inner rounded-[24px] rounded-tl-none px-6 py-4 flex gap-2 w-20 items-center justify-center">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Footer */}
                    <form onSubmit={handleSend} className="p-4 bg-[var(--bg)] border-t border-[var(--shadow-dark)] flex gap-3 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            className="flex-1 bg-[var(--card)] shadow-[inset_3px_3px_6px_var(--shadow-dark),inset_-3px_-3px_6px_var(--shadow-light)] border-none rounded-2xl px-5 text-sm font-bold focus:outline-none text-[var(--text-main)] placeholder:text-[var(--text-muted)] transition-all"
                        />
                        <Button 
                            type="submit" 
                            disabled={!input.trim() || loading}
                            className="!w-12 !h-12 !p-0 !rounded-2xl shadow-indigo-500/20"
                        >
                            <Send size={20} strokeWidth={2.5} />
                        </Button>
                    </form>
                </Card>
            )}
        </div>
    );
};

export default AIChatbot;
