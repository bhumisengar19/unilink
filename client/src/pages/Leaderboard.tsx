import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Trophy, Award, TrendingUp, Zap, Star, LayoutGrid, List } from 'lucide-react';

const Leaderboard: React.FC = () => {
    const [topUsers, setTopUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const { data } = await api.get('/api/users/leaderboard').catch(() => ({ data: { leaderboard: [] } }));
            // Mock data if empty
            const finalLeaderboard = data.leaderboard.length > 0 ? data.leaderboard : [
                { _id: 'u1', name: 'James Wilson', gamification: { points: 1540, level: 12, badges: ['Top Contributor'] }, profile: { profilePic: 'https://i.pravatar.cc/150?u=j' } },
                { _id: 'u1', name: 'Elena Gilbert', gamification: { points: 1320, level: 10, badges: ['Best Teammate'] }, profile: { profilePic: 'https://i.pravatar.cc/150?u=e' } },
                { _id: 'u3', name: 'Sarah Chen', gamification: { points: 1210, level: 9, badges: [] }, profile: { profilePic: 'https://i.pravatar.cc/150?u=s' } }
            ];
            setTopUsers(finalLeaderboard);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="space-y-10 animate-fade-in pb-12">
            <div>
               <h2 className="text-4xl font-black text-white flex items-center gap-3">
                  <Trophy className="text-emerald-400" size={32} />
                  Hall of Influence
               </h2>
               <p className="text-slate-400 font-medium tracking-tight">Top students shaping the campus community through contribution</p>
            </div>

            {/* Top 3 Podiums */}
            <div className="flex flex-col md:flex-row items-end justify-center gap-8 py-10">
                {/* Second Place */}
                <div className="order-2 md:order-1 flex flex-col items-center gap-4 animate-slide-up-slow">
                    <img src={topUsers[1]?.profile.profilePic} className="w-20 h-20 rounded-2xl border-4 border-slate-700 bg-slate-900 shadow-xl" alt="silver" />
                    <div className="glass-card w-40 h-32 flex flex-col items-center justify-center border-slate-700 relative overflow-hidden bg-slate-900/50">
                        <div className="absolute top-0 right-0 w-12 h-12 bg-slate-300/10 rounded-full blur-2xl" />
                        <h4 className="font-bold text-white text-sm text-center px-4 leading-tight mb-2 truncate max-w-full italic">#2 {topUsers[1]?.name || 'Loading...'}</h4>
                        <p className="text-lg font-black text-slate-300 italic">{topUsers[1]?.gamification.points || '0'} pts</p>
                    </div>
                </div>

                {/* First Place */}
                <div className="order-1 md:order-2 flex flex-col items-center gap-6 group">
                   <div className="relative">
                      <img src={topUsers[0]?.profile.profilePic} className="w-28 h-28 rounded-3xl border-4 border-emerald-500 bg-slate-900 shadow-2xl shadow-emerald-500/10" alt="gold" />
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white border-4 border-slate-900">
                          <Trophy size={20} />
                      </div>
                   </div>
                   <div className="glass-card w-48 h-40 flex flex-col items-center justify-center border-emerald-500/30 scale-110 relative overflow-hidden bg-gradient-to-br from-emerald-500/5 to-transparent">
                        <h4 className="font-bold text-white text-lg text-center px-4 leading-tight mb-2 italic">#1 {topUsers[0]?.name || 'Loading...'}</h4>
                        <div className="flex items-center gap-1 text-emerald-400 mb-1">
                           <TrendingUp size={16} />
                           <p className="text-2xl font-black">{topUsers[0]?.gamification.points || '0'}</p>
                           <p className="text-[10px] uppercase font-bold text-slate-500 ml-1">Pts</p>
                        </div>
                   </div>
                </div>

                {/* Third Place */}
                <div className="order-3 md:order-3 flex flex-col items-center gap-4 animate-slide-up-slow">
                    <img src={topUsers[2]?.profile.profilePic} className="w-16 h-16 rounded-xl border-4 border-slate-700 bg-slate-900 shadow-xl" alt="bronze" />
                    <div className="glass-card w-32 h-24 flex flex-col items-center justify-center border-slate-800 bg-slate-950/50">
                        <h4 className="font-bold text-white text-xs px-2 truncate italic">#3 {topUsers[2]?.name || 'Loading...'}</h4>
                        <p className="text-md font-black text-rose-400 italics">{topUsers[2]?.gamification.points || '0'} pts</p>
                    </div>
                </div>
            </div>

            {/* List View */}
            <div className="glass-card overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/20">
                    <h3 className="font-bold flex items-center gap-2">
                        <Award size={18} className="text-indigo-400" />
                        Full Ranking
                    </h3>
                    <div className="flex gap-2">
                         <div className="p-2 bg-slate-900 rounded-lg text-slate-500 cursor-pointer hover:text-white transition-colors"><List size={18} /></div>
                         <div className="p-2 bg-slate-900 rounded-lg text-white border border-indigo-500/20"><LayoutGrid size={18} /></div>
                    </div>
                </div>
                <div className="p-4 space-y-4">
                    {topUsers.map((user, idx) => (
                        <div key={user._id} className="flex items-center gap-4 p-4 glass-card border-none bg-slate-800/30 group hover:translate-x-2 transition-transform cursor-pointer">
                            <div className="w-10 text-center font-black text-slate-600 group-hover:text-indigo-400 transition-colors">#{idx + 1}</div>
                            <img src={user.profile.profilePic} className="w-12 h-12 rounded-xl object-cover border border-slate-700" alt="avatar" />
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-100">{user.name}</h4>
                                <div className="flex gap-2">
                                     {user.gamification.badges.map((badge: string) => (
                                         <span key={badge} className="text-[9px] font-black uppercase text-indigo-400 tracking-wider flex items-center gap-1">
                                             <Star size={10} />
                                             {badge}
                                         </span>
                                     ))}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Lv. {user.gamification.level}</p>
                                <p className="text-xl font-black text-white italic">{user.gamification.points.toLocaleString()}<span className="text-[10px] text-slate-500 font-bold ml-1">PTS</span></p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* How to Earn Points Tips */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: 'Post Content', desc: 'Share campus news or study material', pts: '+10 XP', icon: Zap, color: 'text-indigo-400' },
                    { title: 'Help Peers', desc: 'Complete teammate requests', pts: '+50 XP', icon: Award, color: 'text-emerald-400' },
                    { title: 'Event Join', desc: 'RSVP and attend campus events', pts: '+25 XP', icon: Star, color: 'text-rose-400' }
                ].map((tip) => (
                    <div key={tip.title} className="glass-card p-6 flex flex-col items-center text-center gap-3 bg-slate-900/40 opacity-80 border-slate-800">
                        <div className={`p-4 bg-slate-800 rounded-2xl ${tip.color} mb-2 shadow-xl border border-white/5`}><tip.icon size={24} /></div>
                        <h5 className="font-bold text-white">{tip.title}</h5>
                        <p className="text-xs text-slate-500/80 mb-2 leading-relaxed">{tip.desc}</p>
                        <span className="text-indigo-400 font-black text-xs">{tip.pts}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;
