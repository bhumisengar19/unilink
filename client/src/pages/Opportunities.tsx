import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Briefcase, MapPin, Calendar, Clock, ChevronRight, Filter, Search, PlusCircle, CheckCircle2, Bookmark } from 'lucide-react';

const Opportunities: React.FC = () => {
    const [opps, setOpps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const fetchOpps = async () => {
        try {
            const { data } = await api.get('/api/opportunities');
            setOpps(data.opportunities);
        } catch (error) {
            console.warn('Using Mock Opportunities');
            setOpps([
                {
                    _id: 'o1', title: 'Frontend Developer Intern', 
                    type: 'internship', location: 'Remote / Bangalore',
                    description: 'Work with our core team to build the next generation of campus networking tools.',
                    postedBy: { name: 'Sarah Chen', profile: { profilePic: 'https://i.pravatar.cc/150?u=1' } },
                    deadline: new Date(Date.now() + 864000000).toISOString(),
                    requirements: ['React', 'TypeScript', 'Tailwind']
                },
                {
                    _id: 'o2', title: 'Machine Learning Research Assistant', 
                    type: 'research', location: 'Campus Lab 4',
                    description: 'Analyze student engagement patterns using deep learning models.',
                    postedBy: { name: 'Dr. Aris', profile: { profilePic: 'https://i.pravatar.cc/150?u=a' } },
                    deadline: new Date(Date.now() + 432000000).toISOString(),
                    requirements: ['Python', 'TensorFlow', 'Data Analysis']
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOpps();
    }, []);

    const categories = [
        { id: 'all', name: 'All' },
        { id: 'internship', name: 'Internships' },
        { id: 'research', name: 'Research' },
        { id: 'volunteering', name: 'Volunteer' }
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                   <h2 className="text-4xl font-black text-white flex items-center gap-3">
                      <Briefcase className="text-rose-400" size={32} />
                      Opportunity Board
                   </h2>
                   <p className="text-slate-400 font-medium">Find fellowships, internships, and campus research gigs</p>
                </div>
                <button className="btn-primary flex items-center gap-2 h-12 px-6">
                    <PlusCircle size={20} />
                    <span>Post Opportunity</span>
                </button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col lg:flex-row gap-4">
                 <div className="flex-1 glass-card flex items-center px-4 py-3 border-white/5">
                    <Search className="text-slate-500 mr-3" size={18} />
                    <input type="text" placeholder="Search internships, roles, companies..." className="bg-transparent border-none focus:outline-none text-slate-200 w-full" />
                 </div>
                 <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {categories.map(cat => (
                        <button 
                            key={cat.id}
                            onClick={() => setFilter(cat.id)}
                            className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === cat.id ? 'bg-rose-500 text-white shadow-xl shadow-rose-500/20' : 'glass-card text-slate-500 border-white/5 hover:bg-slate-800'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                 </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 gap-6">
                {opps.map(opp => (
                    <div key={opp._id} className="glass-card p-8 group hover:border-rose-500/30 transition-all cursor-pointer relative overflow-hidden bg-slate-900/40">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full -mr-16 -mt-16 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                         
                         <div className="flex flex-col md:flex-row gap-8 items-start relative">
                             <div className="flex-1 space-y-4">
                                 <div className="flex items-center gap-2 mb-2">
                                     <span className="px-3 py-1 bg-rose-500/10 text-rose-400 text-[10px] font-black uppercase tracking-tighter rounded-full border border-rose-500/20">
                                         {opp.type}
                                     </span>
                                     <span className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                                         <Clock size={12} />
                                         Deadline: {new Date(opp.deadline).toLocaleDateString()}
                                     </span>
                                 </div>
                                 <h3 className="text-2xl font-black text-white group-hover:text-rose-400 transition-colors uppercase tracking-tight">{opp.title}</h3>
                                 <p className="text-slate-400 font-medium leading-relaxed max-w-3xl">{opp.description}</p>
                                 
                                 <div className="flex flex-wrap gap-4 pt-4">
                                     <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-xl border border-white/5 whitespace-nowrap">
                                         <MapPin size={14} className="text-rose-400" />
                                         {opp.location}
                                     </div>
                                     <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-xl border border-white/5 whitespace-nowrap">
                                         <Calendar size={14} className="text-rose-400" />
                                         Posted By {opp.postedBy.name}
                                     </div>
                                 </div>
                             </div>

                             <div className="w-full md:w-auto flex md:flex-col gap-3 justify-end items-end shrink-0">
                                 <button className="glass-card p-3 border-white/10 hover:bg-slate-800 transition-colors text-slate-500 hover:text-rose-400">
                                     <Bookmark size={20} />
                                 </button>
                                 <button className="btn-primary w-full md:w-48 h-12 flex items-center justify-center gap-2">
                                     <span>Quick Apply</span>
                                     <ChevronRight size={18} />
                                 </button>
                             </div>
                         </div>

                         {/* Requirements Preview */}
                         <div className="mt-8 pt-8 border-t border-slate-800/50 flex flex-wrap gap-2 relative">
                             <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest my-auto mr-2">Core Skills:</span>
                             {opp.requirements.map((req: string) => (
                                 <span key={req} className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-slate-400 text-[10px] font-bold rounded-lg border border-white/5">
                                     <CheckCircle2 size={12} className="text-rose-400" />
                                     {req}
                                 </span>
                             ))}
                         </div>
                    </div>
                ))}
            </div>
            
            {/* Success Prompt */}
            <div className="glass-card p-12 text-center bg-gradient-to-br from-indigo-500/10 via-transparent to-rose-500/10 border-white/5">
                <h3 className="text-3xl font-black text-white mb-4">Can't find what you're looking for?</h3>
                <p className="text-slate-400 font-medium mb-8 max-w-md mx-auto">Build your reputation by posting high-quality opportunities for your peers and earn exclusive "Recruiter" badges.</p>
                <div className="flex gap-4 justify-center">
                    <button className="btn-primary px-8 h-12">Post Opportunity</button>
                    <button className="glass-card px-8 h-12 border-white/10 text-slate-300 font-bold hover:bg-slate-800 transition-colors">Learn More</button>
                </div>
            </div>
        </div>
    );
};

export default Opportunities;
