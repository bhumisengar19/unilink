import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Edit3, MapPin, Briefcase, GraduationCap, Award, Settings, Plus, Star, Link as LinkIcon, Camera, Layout, X, Upload, Loader2, Save } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Profile: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    // Edit Form State
    const [editForm, setEditForm] = useState({
        name: '',
        bio: '',
        branch: '',
        year: '',
        skills: ''
    });
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchProfile = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user?.accessToken}` }
            };
            const { data } = await axios.get('/api/users/me', config);
            setProfile(data.user);
            setEditForm({
                name: data.user.name,
                bio: data.user.profile?.bio || '',
                branch: data.user.profile?.branch || '',
                year: data.user.profile?.year || '',
                skills: (data.user.profile?.skills || []).join(', ')
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
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
        { label: 'Posts', value: 12, color: 'text-rose-400' },
    ];

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const config = {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user?.accessToken}` 
                }
            };
            const { data } = await axios.put('/api/users/profile-picture', formData, config);
            setProfile((prev: any) => ({ ...prev, profile: { ...prev.profile, profilePic: data.profilePic } }));
            updateUser({ profile: { ...user?.profile, profilePic: data.profilePic } });
        } catch (error) {
            console.error('Upload Error:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user?.accessToken}` }
            };
            const skillArray = editForm.skills.split(',').map(s => s.trim()).filter(s => s);
            const updateData = {
                name: editForm.name,
                bio: editForm.bio,
                branch: editForm.branch,
                year: editForm.year,
                skills: skillArray
            };
            
            const { data } = await axios.put('/api/users/profile', updateData, config);
            setProfile(data.user);
            updateUser(data.user);
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Update Error:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
                <div className="h-64 neu-card rounded-[40px]" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="h-48 neu-card rounded-[32px]" />
                    <div className="lg:col-span-2 h-96 neu-card rounded-[32px]" />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 relative">
            {/* Header Hero Area */}
            <Card variant="neu" className="p-0 !rounded-[40px] border-none overflow-hidden shadow-2xl">
                <div className="h-56 bg-gradient-to-br from-indigo-500 via-purple-500 to-rose-400 opacity-90 relative">
                    <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
                </div>
                <div className="px-12 pb-12 relative">
                   <div className="absolute -top-20 left-12 flex flex-col md:flex-row items-end gap-8">
                      <div className="relative group">
                         <div className="w-44 h-44 rounded-[40px] border-[8px] border-[var(--bg)] bg-[var(--bg)] shadow-2xl overflow-hidden">
                            {uploading && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                    <Loader2 className="text-white animate-spin" size={40} />
                                </div>
                            )}
                            <img 
                                src={profile?.profile?.profilePic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'} 
                                alt="avatar" 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                            />
                         </div>
                         <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-4 right-4 p-4 bg-indigo-600 rounded-3xl border-2 border-white/20 shadow-2xl text-white hover:bg-indigo-700 transition-all scale-100 hover:scale-110 active:scale-90"
                         >
                             <Camera size={24} strokeWidth={2.5} />
                         </button>
                         <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleImageUpload} 
                            accept="image/*" 
                            className="hidden" 
                         />
                      </div>
                      <div className="mb-6">
                         <h2 className="text-4xl font-black text-[var(--text-main)] tracking-tight">{profile?.name}</h2>
                         <p className="text-[var(--text-muted)] font-black uppercase text-xs tracking-[0.2em] mt-2 flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            B.Tech {profile?.profile?.branch || 'Department'} <span className="opacity-30 mx-2">•</span> Year {profile?.profile?.year || 'N/A'}
                         </p>
                      </div>
                   </div>
                   
                   <div className="flex justify-end gap-4 mt-12">
                       <Button variant="secondary" className="px-6 h-14 !rounded-2xl gap-2 font-black text-xs uppercase tracking-widest">
                           <Settings size={18} strokeWidth={2.5} />
                           <span>Settings</span>
                       </Button>
                       <Button 
                            onClick={() => setIsEditModalOpen(true)}
                            className="px-8 h-14 !rounded-2xl gap-2 font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/20"
                        >
                           <Edit3 size={18} strokeWidth={2.5} />
                           <span>Edit Profile</span>
                       </Button>
                   </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Stats & About */}
                <div className="space-y-10 lg:col-span-1">
                    <Card variant="neu" className="p-8 grid grid-cols-3 gap-4 text-center !rounded-[32px]">
                        {userStats.map(stat => (
                            <div key={stat.label}>
                                <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                                <p className="text-[9px] text-[var(--text-muted)] font-black uppercase tracking-widest mt-2 opacity-70">{stat.label}</p>
                            </div>
                        ))}
                    </Card>

                    <Card variant="neu" className="p-10 space-y-10 !rounded-[32px] overflow-hidden">
                        <div>
                           <div className="flex items-center gap-3 mb-8">
                               <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500 shadow-inner">
                                   <UserIcon size={22} strokeWidth={3} />
                               </div>
                               <h4 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--text-main)]">Bio</h4>
                           </div>
                           <p className="text-[var(--text-main)] leading-relaxed italic font-medium opacity-80 bg-[var(--shadow-dark)]/15 p-6 rounded-3xl border-l-4 border-indigo-500 shadow-sm">
                             {profile?.profile?.bio || 'Introduce yourself to the UniLink community...'}
                           </p>
                        </div>
                        
                        <div className="space-y-4 pt-10 border-t border-[var(--shadow-dark)]">
                            <a 
                                href={profile?.profile?.github ? `https://github.com/${profile.profile.github}` : '#'} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-5 rounded-2xl hover:bg-[var(--shadow-dark)] transition-all group group cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-slate-500/10 rounded-xl text-[var(--text-main)]">
                                        <LinkIcon size={20} strokeWidth={2.5} />
                                    </div>
                                    <span className="text-sm font-bold text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors">{profile?.profile?.github || 'Add GitHub'}</span>
                                </div>
                                <Plus size={18} className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        </div>
                    </Card>
                </div>

                {/* Skills & Activity */}
                <div className="lg:col-span-2 space-y-10">
                    <Card variant="neu" className="p-12 !rounded-[40px] bg-gradient-to-br from-indigo-500/5 to-transparent border-none overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 blur-3xl -z-10" />
                        
                        <div className="mb-14">
                             <div className="flex items-center gap-4 mb-10">
                                <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500">
                                    <GraduationCap size={28} strokeWidth={3} />
                                </div>
                                <h4 className="text-2xl font-black text-[var(--text-main)] tracking-tight">Expertise & Skills</h4>
                             </div>
                             <div className="flex flex-wrap gap-5">
                                {(profile?.profile?.skills || []).length > 0 ? (
                                    profile.profile.skills.map((skill: string) => (
                                        <div key={skill} className="px-6 py-3 bg-[var(--card)] text-[var(--text-main)] text-sm font-black rounded-2xl shadow-[8px_8px_16px_var(--shadow-dark),-8px_-8px_16px_var(--shadow-light)] hover:scale-105 transition-transform cursor-pointer border-none uppercase tracking-widest text-[10px]">
                                            {skill}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-[var(--text-muted)] font-bold italic opacity-60">No skills added yet.</p>
                                )}
                                <button className="px-6 py-3 bg-indigo-500 text-white text-[10px] font-black rounded-2xl shadow-xl shadow-indigo-500/20 hover:scale-110 active:scale-95 transition-all flex items-center gap-2 uppercase tracking-widest ml-auto">
                                    <Plus size={20} strokeWidth={3} />
                                    <span>Add Extra</span>
                                </button>
                             </div>
                        </div>

                        <div className="pt-12 border-t border-[var(--shadow-dark)]">
                             <div className="flex items-center gap-4 mb-10">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                                    <Award size={28} strokeWidth={3} />
                                </div>
                                <h4 className="text-2xl font-black text-[var(--text-main)] tracking-tight">Achievements</h4>
                             </div>
                             <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">
                                {['Top Contributor', 'Workshop Lead', 'Active Member', 'Project Pro'].map(badge => (
                                    <div key={badge} className="flex flex-col items-center gap-5 group">
                                         <div className="w-24 h-24 bg-[var(--bg)] rounded-[32px] flex items-center justify-center text-emerald-500 shadow-[10px_10px_20px_var(--shadow-dark),-10px_-10px_20px_var(--shadow-light)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 group-hover:shadow-[15px_15px_30px_var(--shadow-dark)] relative overflow-hidden">
                                             <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                                             <Star size={44} fill="currentColor" className="opacity-20 group-hover:opacity-100 transition-all duration-500" />
                                         </div>
                                         <span className="text-[10px] font-black text-[var(--text-muted)] group-hover:text-emerald-500 transition-colors uppercase tracking-[0.2em] text-center">{badge}</span>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </Card>

                    <Card variant="neu" className="p-12 !rounded-[40px]">
                         <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500">
                                <Layout size={28} strokeWidth={3} />
                            </div>
                            <h4 className="text-2xl font-black text-[var(--text-main)] tracking-tight">Timeline Activity</h4>
                         </div>
                         <div className="space-y-10 relative before:absolute before:left-[21px] before:top-4 before:bottom-4 before:w-[3px] before:bg-[var(--shadow-dark)]/50 before:rounded-full">
                             {[1, 2, 3].map(i => (
                                 <div key={i} className="flex gap-8 group relative items-start">
                                     <div className="w-12 h-12 bg-[var(--card)] rounded-2xl flex items-center justify-center text-indigo-500 shadow-[6px_6px_12px_var(--shadow-dark),-6px_-6px_12px_var(--shadow-light)] shrink-0 z-10 transition-transform group-hover:scale-110 group-hover:rotate-6">
                                         <Star size={24} strokeWidth={2.5} />
                                     </div>
                                     <div className="flex-1 pb-10 border-b border-[var(--shadow-dark)] group-last:border-0 group-last:pb-0">
                                          <p className="text-[var(--text-main)] text-lg mb-3 font-medium opacity-90 leading-relaxed">
                                             Shared a new resource in <span className="font-extrabold text-[var(--accent)] cursor-pointer hover:underline decoration-2 underline-offset-4">#FullStackDevelopment</span> group.
                                          </p>
                                          <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-[0.2em] opacity-60">Posted 4h ago</p>
                                     </div>
                                 </div>
                             ))}
                         </div>
                    </Card>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-fade-in">
                    <Card variant="neu" className="w-full max-w-2xl !rounded-[40px] p-10 space-y-8 animate-scale-in max-h-[90vh] overflow-y-auto no-scrollbar border-none shadow-[24px_24px_48px_rgba(0,0,0,0.3)] bg-[var(--bg)]">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500">
                                    <Settings size={28} strokeWidth={3} />
                                </div>
                                <h3 className="text-3xl font-black text-[var(--text-main)] tracking-tight">Edit Profile</h3>
                            </div>
                            <button 
                                onClick={() => setIsEditModalOpen(false)}
                                className="p-3 text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all active:scale-90"
                            >
                                <X size={28} strokeWidth={3} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-8 pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-4 mb-2 block font-bold transition-all">Full Name</label>
                                    <Input 
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                        className="h-14 !rounded-2xl font-bold"
                                        placeholder="Full Name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-4 mb-2 block font-bold transition-all">Department / Branch</label>
                                    <Input 
                                        value={editForm.branch}
                                        onChange={(e) => setEditForm({...editForm, branch: e.target.value})}
                                        className="h-14 !rounded-2xl font-bold"
                                        placeholder="e.g. Computer Science"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-4 mb-2 block font-bold transition-all">Year of Study</label>
                                    <Input 
                                        value={editForm.year}
                                        onChange={(e) => setEditForm({...editForm, year: e.target.value})}
                                        className="h-14 !rounded-2xl font-bold"
                                        placeholder="e.g. 3rd Year"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-4 mb-2 block font-bold transition-all">Skills (Comma separated)</label>
                                    <Input 
                                        value={editForm.skills}
                                        onChange={(e) => setEditForm({...editForm, skills: e.target.value})}
                                        className="h-14 !rounded-2xl font-bold"
                                        placeholder="React, Node.js..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-4 mb-2 block font-bold transition-all">Short Bio</label>
                                <textarea 
                                    value={editForm.bio}
                                    onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                                    className="w-full bg-[var(--card)] shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)] border-none rounded-3xl p-6 text-[var(--text-main)] font-medium focus:ring-2 focus:ring-indigo-500/20 transition-all min-h-[120px]"
                                    placeholder="Tell the campus about yourself..."
                                />
                            </div>

                            <div className="flex gap-4 pt-6">
                                <Button 
                                    type="button" 
                                    variant="secondary" 
                                    className="flex-1 h-14 !rounded-2xl font-black uppercase tracking-widest transition-all"
                                    onClick={() => setIsEditModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={saving}
                                    className="flex-[2] h-14 !rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 group"
                                >
                                    {saving ? <Loader2 className="animate-spin" /> : <Save className="group-hover:scale-110 transition-transform" />}
                                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Profile;
