import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Search, UserPlus, Filter, Cpu, Globe, MapPin, Zap } from 'lucide-react';

const Discovery: React.FC = () => {
    const [matches, setMatches] = useState<any[]>([]);
    const [nearby, setNearby] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [matchRes, nearRes] = await Promise.all([
                api.get('/api/users/matches').catch(() => ({ data: { matches: [] } })),
                api.get('/api/users/nearby').catch(() => ({ data: { nearby: [] } }))
            ]);
            
            // Mock data if empty
            const finalMatches = matchRes.data.matches.length > 0 ? matchRes.data.matches : [
                { _id: 'm1', name: 'James Wilson', profile: { branch: 'B.Tech CS', skills: ['React', 'Python'], profilePic: 'https://i.pravatar.cc/150?u=j' } },
                { _id: 'm2', name: 'Elena Gilbert', profile: { branch: 'Design', skills: ['Figma', 'UI/UX'], profilePic: 'https://i.pravatar.cc/150?u=e' } }
            ];
            
            setMatches(finalMatches);
            setNearby(nearRes.data.nearby);
        } catch (error) {
            console.error('Error fetching discovery data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="space-y-10 animate-fade-in pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                   <h2 className="text-4xl font-black text-white flex items-center gap-3">
                      <Search className="text-indigo-400" size={32} />
                      Discovery
                   </h2>
                   <p className="text-slate-400 font-medium">Find your perfect project team or study circle</p>
                </div>
                <div className="glass-card flex items-center px-4 py-2 w-full md:w-96 border-white/10">
                   <Search className="text-slate-500 mr-3" size={18} />
                   <input 
                      type="text" 
                      placeholder="Search skills, name, branch..." 
                      className="bg-transparent border-none focus:outline-none text-slate-200 w-full font-medium" 
                   />
                   <Filter className="text-indigo-400 ml-2" size={18} />
                </div>
            </div>

            {/* Smart Matches Section */}
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                        <Zap size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-100">AI-Powered Skill Matches</h3>
                    <span className="text-[10px] font-black uppercase text-slate-500 border border-slate-700 px-2 py-0.5 rounded-full ml-auto">Updated Live</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {matches.map((user) => (
                        <div key={user._id} className="glass-card group hover:scale-[1.02] transition-all p-6 relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-indigo-500/10 transition-colors" />
                             
                             <div className="flex items-start gap-4 mb-6 relative">
                                <img src={user.profile.profilePic} className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700" alt="avatar" />
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{user.name}</h4>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">{user.profile.branch}</p>
                                    <div className="flex items-center text-[10px] text-emerald-400 font-black uppercase tracking-tighter bg-emerald-500/10 px-2 py-0.5 rounded-full w-fit">
                                        94% Skill Compatibility
                                    </div>
                                </div>
                             </div>

                             <div className="flex flex-wrap gap-2 mb-8 relative">
                                {user.profile.skills.map((skill: string) => (
                                    <span key={skill} className="px-3 py-1 bg-slate-900/50 text-slate-300 text-[10px] font-bold rounded-lg border border-slate-700 group-hover:border-indigo-500/30 transition-colors">
                                        {skill}
                                    </span>
                                ))}
                             </div>

                             <div className="flex gap-3 relative">
                                <button className="btn-primary flex-1 h-10 flex items-center justify-center gap-2 text-sm">
                                    <UserPlus size={16} />
                                    <span>Connect</span>
                                </button>
                                <button className="glass-card h-10 px-4 flex items-center justify-center text-slate-400 hover:text-white transition-colors border-white/5">
                                    Chat
                                </button>
                             </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Find Explorer */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
                <div className="glass-card p-8 bg-gradient-to-br from-indigo-500/10 to-transparent flex flex-col justify-between">
                    <div>
                        <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl shadow-indigo-500/20">
                            <Cpu size={24} />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-3">Project Team Finder</h3>
                        <p className="text-slate-400 font-medium mb-8 max-w-sm">Broadcast the skills you need for your next hackathon or research project.</p>
                    </div>
                    <button className="btn-primary w-fit px-8 h-12">Create Team Call</button>
                </div>

                <div className="glass-card p-8 bg-gradient-to-br from-rose-500/10 to-transparent flex flex-col justify-between">
                    <div>
                        <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl shadow-rose-500/20">
                            <MapPin size={24} />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-3">Campus Live Map</h3>
                        <p className="text-slate-400 font-medium mb-8 max-w-sm">See which students are currently active in physical campus zones like the Lib or Cafe.</p>
                    </div>
                    <button className="glass-card w-fit px-8 h-12 border-rose-500/20 text-rose-400 font-bold hover:bg-rose-500/10 transition-colors">Open Interactive Map</button>
                </div>
            </div>
            
            {/* Nearby Section Preview */}
            <div className="pt-4">
                 <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-3">
                     <Globe size={16} />
                     Nearby Study Groups (Preview)
                 </h4>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {['Digital Marketing Group', 'Algorithm Prep', 'Physics Labs', 'Design Sprints'].map(g => (
                         <div key={g} className="glass-card p-4 text-center cursor-pointer hover:bg-slate-800 transition-colors border-white/5">
                             <div className="w-10 h-10 bg-slate-900 rounded-xl mx-auto mb-3 flex items-center justify-center text-indigo-400 border border-slate-700">
                                 <UserPlus size={18} />
                             </div>
                             <p className="text-xs font-bold text-slate-300">{g}</p>
                         </div>
                     ))}
                 </div>
            </div>
        </div>
    );
};

export default Discovery;
