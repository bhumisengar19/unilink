import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Users, FileText, Activity, ShieldCheck, AlertCircle, Ban, ArrowUpRight, ArrowDownRight, MoreHorizontal, CheckCircle2 } from 'lucide-react';

const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState<any>(null);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAdminData = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user?.accessToken}` }
            };
            const [analyticsRes, usersRes] = await Promise.all([
                axios.get('/api/admin/analytics', config),
                axios.get('/api/admin/users', config)
            ]);
            setAnalytics(analyticsRes.data);
            setAllUsers(usersRes.data.users);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    const stats = [
        { label: 'Total Users', value: analytics?.userCount || 0, icon: Users, color: 'text-indigo-400', trend: '+12%', bg: 'bg-indigo-500/10 border-indigo-500/20' },
        { label: 'Active Posts', value: analytics?.postCount || 0, icon: FileText, color: 'text-rose-400', trend: '+5.4k', bg: 'bg-rose-500/10 border-rose-500/20' },
        { label: 'Engagement', value: analytics?.totalLikes || 0, icon: Activity, color: 'text-emerald-400', trend: '89%', bg: 'bg-emerald-500/10 border-emerald-500/20' },
        { label: 'Admin Actions', value: 42, icon: ShieldCheck, color: 'text-orange-400', trend: '-2', bg: 'bg-orange-500/10 border-orange-500/20' }
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
               <h2 className="text-3xl font-black text-slate-100 flex items-center gap-3">
                  <ShieldCheck className="text-indigo-400" size={32} />
                  System Controller
               </h2>
               <p className="text-slate-400 font-medium">Manage campus infrastructure and monitor user activity</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map(stat => (
                    <div key={stat.label} className={`glass-card p-6 border ${stat.bg} group hover:scale-[1.02] transition-transform cursor-pointer`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color} bg-slate-900 shadow-xl border border-white/5`}>
                                <stat.icon size={24} />
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-1 rounded-full">
                                <ArrowUpRight size={12} />
                                {stat.trend}
                            </div>
                        </div>
                        <h3 className="text-3xl font-black text-slate-100 mb-1">{stat.value}</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* User Management Table */}
                <div className="xl:col-span-2 glass-card overflow-hidden">
                    <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
                        <h3 className="font-bold flex items-center gap-2">
                           <Users size={20} className="text-indigo-400" />
                           Student Directory
                        </h3>
                        <div className="flex gap-2">
                           <button className="h-8 w-8 glass-card flex items-center justify-center hover:bg-slate-700 transition-colors text-slate-400"><MoreHorizontal size={16} /></button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-800/40 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Joined</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/30">
                                {allUsers.map((u) => (
                                    <tr key={u._id} className="hover:bg-slate-700/20 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                 <img src={u.profile?.profilePic || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-xl" alt="avatar" />
                                                 <div>
                                                    <p className="font-bold text-sm text-slate-200">{u.name}</p>
                                                    <p className="text-[10px] text-slate-500 font-medium">{u.email}</p>
                                                 </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border border-indigo-500/20 ${u.role === 'admin' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-700/50 text-slate-400'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-400 font-medium">Mar 27, 2026</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="h-8 w-8 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors inline-flex items-center justify-center">
                                                <Ban size={16} />
                                            </button>
                                            <button className="h-8 w-8 text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors inline-flex items-center justify-center">
                                                <CheckCircle2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Reports/Alerts Sidebar */}
                <div className="space-y-8">
                    <div className="glass-card p-6 bg-rose-500/5 border-rose-500/20">
                        <h3 className="font-bold flex items-center gap-2 mb-6 text-rose-400">
                             <AlertCircle size={20} />
                             Recent Reports
                        </h3>
                        <div className="space-y-4">
                             {[1, 2].map(i => (
                                 <div key={i} className="glass-card p-4 border-none bg-slate-900/60 group cursor-pointer hover:bg-slate-800 transition-colors">
                                     <div className="flex justify-between items-start mb-2">
                                         <p className="text-xs font-bold text-slate-300">Harassment Report</p>
                                         <span className="text-[10px] text-rose-400 font-black uppercase tracking-tighter">High</span>
                                     </div>
                                     <p className="text-[10px] text-slate-500 mb-3 truncate italic">"Found inappropriate comment on event post..."</p>
                                     <div className="flex justify-between items-center pt-3 border-t border-slate-700/50">
                                         <div className="flex -space-x-2">
                                            <img src="https://i.pravatar.cc/100?u=a" className="w-5 h-5 rounded-full border border-slate-900" />
                                            <img src="https://i.pravatar.cc/100?u=b" className="w-5 h-5 rounded-full border border-slate-900" />
                                         </div>
                                         <button className="text-[10px] font-bold text-indigo-400 hover:underline">Review Details</button>
                                     </div>
                                 </div>
                             ))}
                        </div>
                    </div>

                    <div className="glass-card p-6">
                        <h3 className="font-bold text-slate-100 mb-6 flex items-center gap-2">
                            <Activity size={20} className="text-emerald-400" />
                            Live System Logs
                        </h3>
                        <div className="space-y-4 font-mono text-[9px] text-slate-500 uppercase tracking-widest leading-relaxed">
                            <p className="text-emerald-500/80"><span className="text-slate-600">[20:41]</span> CRON: DB INDEX OPTIMIZED</p>
                            <p><span className="text-slate-600">[20:38]</span> USER 1421 SYNCED SOCKET:002X</p>
                            <p className="text-rose-500/80"><span className="text-slate-600">[20:30]</span> WARNING: RATE_LIMIT_HIT ON /AUTH/LOGIN</p>
                            <p><span className="text-slate-600">[20:25]</span> NEW POST_OBJ GENERATED (1421)</p>
                            <p className="text-indigo-500/80"><span className="text-slate-600">[20:15]</span> SYSTEM: CACHE PURGED</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
