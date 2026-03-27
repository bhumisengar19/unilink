import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, Edit3, MapPin, Briefcase, GraduationCap, Award, Settings, Plus, Star, Link as LinkIcon, Camera } from 'lucide-react';

const Profile: React.FC = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user?.accessToken}` }
            };
            const { data } = await axios.get('/api/users/me', config);
            setProfile(data.user);
        } catch (error) {
             console.warn('Using Context User as Profile Mock');
             setProfile(user);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const userStats = [
        { label: 'Connections', value: profile?.connections?.length || 0, color: 'text-indigo-400' },
        { label: 'Points', value: profile?.gamification?.points || 0, color: 'text-emerald-400' },
        { label: 'Posts', value: 12, color: 'text-rose-400' }, // Dummy posts count
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
            {/* Header Hero Area */}
            <div className="glass-card overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-indigo-600 via-indigo-400 to-rose-400 opacity-80" />
                <div className="px-10 pb-10 relative">
                   <div className="absolute -top-16 left-10 flex items-end gap-6">
                      <div className="relative group">
                         <img 
                            src={profile?.profile?.profilePic || 'https://via.placeholder.com/150'} 
                            alt="avatar" 
                            className="w-32 h-32 rounded-3xl border-4 border-slate-900 bg-slate-900 shadow-2xl group-hover:scale-105 transition-transform" 
                         />
                         <button className="absolute bottom-2 right-2 p-2 bg-indigo-600 rounded-xl border border-indigo-400 shadow-lg text-white hover:bg-indigo-700 transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-110">
                             <Camera size={18} />
                         </button>
                      </div>
                      <div className="mb-2">
                         <h2 className="text-3xl font-black text-slate-100 tracking-tight">{profile?.name}</h2>
                         <p className="text-slate-400 font-medium">B.Tech {profile?.profile?.branch} • {profile?.profile?.year} Year</p>
                      </div>
                   </div>
                   
                   <div className="flex justify-end gap-4 mt-8">
                       <button className="glass-card px-6 h-10 flex items-center gap-2 hover:bg-slate-700/50 transition-colors font-bold text-sm">
                           <Settings size={16} />
                           <span>Settings</span>
                       </button>
                       <button className="btn-primary px-6 h-10 flex items-center gap-2">
                           <Edit3 size={16} />
                           <span>Edit Profile</span>
                       </button>
                   </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stats & About */}
                <div className="space-y-8 lg:col-span-1">
                    <div className="glass-card p-8 grid grid-cols-3 gap-4 text-center">
                        {userStats.map(stat => (
                            <div key={stat.label}>
                                <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="glass-card p-8 space-y-6">
                        <div>
                           <h4 className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-4 flex items-center gap-2">
                               <MapPin size={16} />
                               About me
                           </h4>
                           <p className="text-slate-300 leading-relaxed italic">{profile?.profile?.bio || 'Student at University'}</p>
                        </div>
                        
                        <div className="space-y-4 pt-4 border-t border-slate-700/50">
                            <div className="flex items-center gap-3 text-slate-400 group cursor-pointer hover:text-indigo-400 transition-colors">
                                <LinkIcon size={18} />
                                <span className="text-sm">github.com/{profile?.name?.split(' ')[0]}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400 group cursor-pointer hover:text-indigo-400 transition-colors">
                                <Briefcase size={18} />
                                <span className="text-sm">Interested in Web Dev</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skills & Activity */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card p-8 space-y-8 bg-gradient-to-br from-indigo-500/5 to-transparent">
                        <div>
                             <h4 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
                                <GraduationCap size={20} className="text-indigo-400" />
                                Skills & Interests
                             </h4>
                             <div className="flex flex-wrap gap-3">
                                {(profile?.profile?.skills || ['React', 'TypeScript', 'Node.js', 'UI/UX', 'Cloud Computing']).map((skill: string) => (
                                    <span key={skill} className="px-4 py-1.5 bg-slate-800 text-slate-300 text-sm font-bold rounded-xl border border-indigo-500/20 hover:border-indigo-500/50 transition-colors cursor-default">
                                        {skill}
                                    </span>
                                ))}
                                <button className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 text-sm font-bold rounded-xl border border-indigo-500/30 hover:bg-indigo-500/20 transition-all flex items-center gap-2">
                                    <Plus size={16} />
                                    <span>Add Extra</span>
                                </button>
                             </div>
                        </div>

                        <div className="pt-8 border-t border-slate-700/50">
                             <h4 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
                                <Award size={20} className="text-emerald-400" />
                                Badges & Achievements
                             </h4>
                             <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                                {['Top Contributor', 'Workshop Lead', 'Active Member'].map(badge => (
                                    <div key={badge} className="min-w-[120px] flex flex-col items-center gap-3 group">
                                         <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/5">
                                             <Star size={32} />
                                         </div>
                                         <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-400 transition-colors">{badge}</span>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>

                    <div className="glass-card p-8">
                         <h4 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
                            <Plus size={20} className="text-rose-400" />
                            Recent Activity
                         </h4>
                         <div className="space-y-6">
                             {[1, 2].map(i => (
                                 <div key={i} className="flex gap-4 group">
                                     <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 shrink-0">
                                         <Star size={18} />
                                     </div>
                                     <div className="flex-1 pb-6 border-b border-slate-700/50 group-last:border-0 group-last:pb-0">
                                          <p className="text-sm text-slate-200 mb-1">
                                             Liked a post by <span className="font-bold text-indigo-400 cursor-pointer hover:underline">Jane Austen</span> in 
                                             <span className="font-bold text-rose-400 cursor-pointer hover:underline"> #Hackathon2024</span>
                                          </p>
                                          <p className="text-xs text-slate-500 font-medium">2 hours ago</p>
                                     </div>
                                 </div>
                             ))}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
