import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, User, MessageCircle, Calendar, Shield, LogOut, Search, Trophy, Bot } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
    const { user, logout } = useAuth();

    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Discovery', path: '/discovery', icon: Search },
        { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
        { name: 'Assistant', path: '/assistant', icon: Bot },
        { name: 'Chat', path: '/chat', icon: MessageCircle },
        { name: 'Events', path: '/events', icon: Calendar },
        { name: 'Profile', path: '/profile', icon: User },
    ];

    if (user?.role === 'admin') {
        navItems.push({ name: 'Admin', path: '/admin', icon: Shield });
    }

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-800/80 backdrop-blur-xl border-r border-slate-700/50 p-6 flex flex-col z-50">
            <div className="flex items-center gap-3 mb-12">
                <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/20">
                    U
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-rose-400 bg-clip-text text-transparent">
                    UniLink
                </h1>
            </div>

            <nav className="flex-1 flex flex-col gap-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        <item.icon size={20} />
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="pt-6 border-t border-slate-700/50 flex flex-col gap-4">
                <div className="flex items-center gap-3 p-3 glass-card bg-slate-700/30">
                    <img 
                        src={user?.profile?.profilePic || 'https://via.placeholder.com/40'} 
                        alt="Profile" 
                        className="w-10 h-10 rounded-full border border-indigo-500/30"
                    />
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-semibold truncate">{user?.name}</p>
                        <p className="text-xs text-slate-400 lowercase">{user?.role}</p>
                    </div>
                </div>
                
                <button 
                   onClick={logout}
                   className="flex items-center gap-2 px-4 py-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
