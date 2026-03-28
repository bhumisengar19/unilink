import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { Send, Image, MoreVertical, Search, Phone, Video, Smile, MessageCircle } from 'lucide-react';

interface Chat {
    _id: string;
    chatName: string;
    isGroupChat: boolean;
    users: any[];
    latestMessage?: any;
}

interface Message {
    _id: string;
    sender: any;
    content: string;
    chat: any;
    createdAt: string;
}

const ChatPage: React.FC = () => {
    const { user } = useAuth();
    const { socket } = useChat();
    const [chats, setChats] = useState<Chat[]>([]);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchChats = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user?.accessToken}` }
            };
            const { data } = await axios.get('/api/chats', config);
            setChats(data);
        } catch (error) {
            console.error('Error fetching chats:', error);
        }
    };

    const fetchMessages = async () => {
        if (!selectedChat) return;
        setLoading(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user?.accessToken}` }
            };
            const { data } = await axios.get(`/api/messages/${selectedChat._id}`, config);
            setMessages(data);
            if (socket) socket.emit('join', selectedChat._id);
        } catch (error) {
             console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (query: string) => {
        setSearch(query);
        if (!query) {
            setSearchResults([]);
            return;
        }
        try {
            const config = { headers: { Authorization: `Bearer ${user?.accessToken}` } };
            const { data } = await axios.get(`/api/users?search=${query}`, config);
            setSearchResults(data.users);
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

    const accessChat = async (userId: string) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user?.accessToken}` } };
            const { data } = await axios.post('/api/chats', { userId }, config);
            
            if (!chats.find((c) => c._id === data._id)) {
                fetchChats();
            }
            setSelectedChat(data);
            setSearch('');
            setSearchResults([]);
        } catch (error) {
            console.error('Error accessing chat:', error);
        }
    };


    useEffect(() => {
        fetchChats();
    }, []);

    useEffect(() => {
        fetchMessages();
    }, [selectedChat]);

    useEffect(() => {
        if (socket) {
            socket.on('messageReceived', (message: Message) => {
                const incomingChatId = typeof message.chat === 'object' ? message.chat._id : message.chat;
                
                if (selectedChat && selectedChat._id === incomingChatId) {
                    setMessages(prev => [...prev, message]);
                } else {
                    // Update latest message in chats list
                    setChats(prev => prev.map(c => c._id === incomingChatId ? { ...c, latestMessage: message } : c));
                }
            });
        }
        return () => {
            if (socket) socket.off('messageReceived');
        };
    }, [socket, selectedChat]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat) return;

        try {
            const config = {
                headers: { Authorization: `Bearer ${user?.accessToken}` }
            };
            const { data } = await axios.post('/api/messages', { content: newMessage, chatId: selectedChat._id }, config);
            setNewMessage('');
            // Message will be added via socket or manual append
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const getSenderName = (chat: Chat) => {
        if (chat.isGroupChat) return chat.chatName;
        const otherUser = chat.users.find(u => u._id !== user?._id);
        return otherUser?.name || 'User';
    };

    const getSenderPic = (chat: Chat) => {
        if (chat.isGroupChat) return 'https://via.placeholder.com/40';
        const otherUser = chat.users.find(u => u._id !== user?._id);
        return otherUser?.profile?.profilePic || 'https://via.placeholder.com/40';
    };

    return (
        <div className="h-[calc(100vh-4rem)] flex gap-6 overflow-hidden">
            {/* Chat List */}
            <div className={`w-80 flex flex-col glass-card border-none overflow-hidden ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-6 border-b border-slate-700/50">
                    <h2 className="text-xl font-bold mb-4">Messages</h2>
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input 
                            type="text" 
                            placeholder="Search users to chat..." 
                            className="input-field pl-10"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {searchResults.length > 0 ? (
                        searchResults.map(searchedUser => (
                            <div 
                                key={searchedUser._id}
                                onClick={() => accessChat(searchedUser._id)}
                                className="p-4 flex gap-3 cursor-pointer transition-colors hover:bg-slate-700/30 border-l-4 border-transparent"
                            >
                                <img src={searchedUser.profile?.profilePic || 'https://via.placeholder.com/40'} className="w-12 h-12 rounded-full border border-slate-700" alt="avatar" />
                                <div className="flex-1 flex flex-col justify-center">
                                    <h4 className="font-semibold text-slate-200">{searchedUser.name}</h4>
                                    <p className="text-xs text-slate-400">{searchedUser.email}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        chats.map(chat => (
                            <div 
                                key={chat._id}
                                onClick={() => setSelectedChat(chat)}
                            className={`p-4 flex gap-3 cursor-pointer transition-colors hover:bg-slate-700/30 border-l-4 ${selectedChat?._id === chat._id ? 'bg-indigo-500/10 border-indigo-500' : 'border-transparent'}`}
                        >
                            <img src={getSenderPic(chat)} className="w-12 h-12 rounded-full border border-slate-700" alt="avatar" />
                            <div className="flex-1 overflow-hidden">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-semibold truncate">{getSenderName(chat)}</h4>
                                    <span className="text-[10px] text-slate-500">12:45</span>
                                </div>
                                <p className="text-xs text-slate-400 truncate">
                                    {chat.latestMessage?.content || 'Say hi!'}
                                </p>
                            </div>
                        </div>
                    )))}
                </div>
            </div>

            {/* Chat Box */}
            <div className={`flex-1 flex flex-col glass-card border-none overflow-hidden ${!selectedChat ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
                {selectedChat ? (
                    <>
                        <div className="p-4 px-6 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/20">
                            <div className="flex items-center gap-4">
                                <img src={getSenderPic(selectedChat)} className="w-10 h-10 rounded-full border border-indigo-500/20" alt="avatar" />
                                <div>
                                    <h3 className="font-bold">{getSenderName(selectedChat)}</h3>
                                    <span className="text-[10px] text-emerald-400 font-medium">Online</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-slate-400">
                                <button className="hover:text-indigo-400 transition-colors"><Phone size={20} /></button>
                                <button className="hover:text-indigo-400 transition-colors"><Video size={20} /></button>
                                <button className="hover:text-indigo-400 transition-colors"><MoreVertical size={20} /></button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-900/40">
                            {messages.map(msg => (
                                <div 
                                    key={msg._id}
                                    className={`flex ${msg.sender._id === user?._id ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${msg.sender._id === user?._id ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-500/10' : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/50'}`}>
                                        <p>{msg.content}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={scrollRef} />
                        </div>

                        <form onSubmit={sendMessage} className="p-4 px-6 border-t border-slate-700/50 flex items-center gap-4 bg-slate-800/10">
                            <button type="button" className="text-slate-400 hover:text-indigo-400 transition-colors"><Smile size={22} /></button>
                            <button type="button" className="text-slate-400 hover:text-indigo-400 transition-colors"><Image size={22} /></button>
                            <input 
                                type="text"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="flex-1 input-field h-10 bg-slate-800/50"
                            />
                            <button type="submit" className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/20">
                                <Send size={20} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-slate-800 rounded-3xl mx-auto flex items-center justify-center text-slate-700 animate-bounce">
                           <MessageCircle size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-100">Your Conversations</h3>
                        <p className="text-slate-400 max-w-xs mx-auto">Select a chat to start connecting with your fellow students</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
