import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, User, MessageCircle, Calendar, Shield, LogOut, Users, Map, Briefcase, BookOpen, Vote, ShoppingBag, FileText, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ui/ThemeToggle';
import Card from './ui/Card';

const Sidebar: React.FC = () => {
    const { user, logout } = useAuth();

    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Network', path: '/network', icon: Users },
        { name: 'Campus Map', path: '/map', icon: Map },
        { name: 'Campus Reels', path: '/reels', icon: Play },
        { name: 'Marketplace', path: '/marketplace', icon: ShoppingBag },
        { name: 'Resume Builder', path: '/resume', icon: FileText },
        { name: 'Study Rooms', path: '/study-rooms', icon: BookOpen },
        { name: 'Campus Polls', path: '/polls', icon: Vote },
        { name: 'Career Board', path: '/opportunities', icon: Briefcase },
        { name: 'Chat', path: '/chat', icon: MessageCircle },
        { name: 'Events', path: '/events', icon: Calendar },
        { name: 'Profile', path: '/profile', icon: User },
    ];

    if (user?.role === 'admin') {
        navItems.push({ name: 'Admin', path: '/admin', icon: Shield });
    }

    return (
        <aside className="fixed left-0 top-0 h-screen w-72 p-6 flex flex-col z-50 bg-[var(--bg)] transition-colors duration-300">
            <Card variant="neu" className="h-full flex flex-col p-6 rounded-[32px] border-none">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-lg shadow-indigo-500/30">
                        U
                    </div>
                    <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent tracking-tight">
                        UniLink
                    </h1>
                </div>

                <nav className="flex-1 flex flex-col gap-2 overflow-y-auto no-scrollbar pb-4 pr-2 -mr-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) => `nav-link group ${isActive ? 'active' : ''}`}
                        >
                            <item.icon size={20} className="transition-transform duration-300 group-hover:scale-110" />
                            <span className="text-sm font-semibold tracking-tight">{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="pt-6 mt-4 border-t border-[var(--shadow-dark)] flex flex-col gap-4">
                    <div className="flex items-center justify-between px-2">
                        <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Theme</span>
                        <ThemeToggle />
                    </div>

                    <Card variant="neu" className="p-3 !rounded-2xl border-none shadow-[inset_2px_2px_5px_var(--shadow-dark),inset_-2px_-2px_5px_var(--shadow-light)] bg-transparent">
                        <div className="flex items-center gap-3">
                            <img 
                                src={user?.profile?.profilePic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'} 
                                alt="Profile" 
                                className="w-10 h-10 rounded-xl border-2 border-[var(--accent)] object-cover shadow-sm"
                            />
                            <div className="flex-1 overflow-hidden">
                                <p className="text-xs font-bold truncate text-[var(--text-main)]">{user?.name}</p>
                                <p className="text-[10px] text-[var(--accent)] font-bold uppercase tracking-tighter opacity-80">{user?.role}</p>
                            </div>
                        </div>
                    </Card>
                    
                    <button 
                       onClick={logout}
                       className="flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all group font-black text-xs uppercase tracking-widest"
                    >
                        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Logout</span>
                    </button>
                </div>
            </Card>
        </aside>
    );
};

export default Sidebar;
