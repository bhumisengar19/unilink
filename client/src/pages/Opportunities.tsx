import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Briefcase, MapPin, Calendar, Clock, Plus, ExternalLink, Filter } from 'lucide-react';

interface Opportunity {
    _id: string;
    title: string;
    type: 'internship' | 'hackathon' | 'job' | 'event';
    company: string;
    description: string;
    deadline: string;
    link: string;
    tags: string[];
    postedBy: {
        _id: string;
        name: string;
        profile: { profilePic: string };
    };
    createdAt: string;
}

const Opportunities: React.FC = () => {
    const { user } = useAuth();
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [filterType, setFilterType] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        type: 'internship',
        company: '',
        description: '',
        deadline: '',
        link: '',
        tags: ''
    });

    const fetchOps = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user?.accessToken}` } };
            const endpoint = filterType ? `/api/opportunities?type=${filterType}` : '/api/opportunities';
            const { data } = await axios.get(endpoint, config);
            setOpportunities(data.opportunities || []);
        } catch (error) {
            console.error('Error fetching opportunities:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOps();
    }, [filterType]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user?.accessToken}` } };
            const payload = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
            };
            await axios.post('/api/opportunities', payload, config);
            setShowModal(false);
            setFormData({ title: '', type: 'internship', company: '', description: '', deadline: '', link: '', tags: '' });
            fetchOps();
        } catch (error) {
            console.error('Error creating opportunity:', error);
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'internship': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
            case 'hackathon': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'job': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'event': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
            default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass-card p-8 border-t-4 border-t-purple-500">
                <div>
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent flex items-center gap-3">
                        <Briefcase size={32} className="text-purple-400" />
                        Opportunity Board
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium">Find internships, hackathons, and career events posted by peers.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="btn-primary py-3 px-6 shrink-0 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 shadow-purple-500/20"
                >
                    <Plus size={20} /> Post Opportunity
                </button>
            </div>

            <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
                <div className="flex items-center gap-2 text-slate-400 font-bold px-4">
                    <Filter size={18} /> Filters:
                </div>
                {['', 'internship', 'hackathon', 'job', 'event'].map(type => (
                    <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-4 py-2 rounded-xl transition-all font-bold whitespace-nowrap capitalize border ${
                            filterType === type 
                            ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-500/20' 
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-purple-500/50 hover:text-slate-200'
                        }`}
                    >
                        {type === '' ? 'All Opportunities' : type}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full"></div></div>
            ) : opportunities.length === 0 ? (
                <div className="glass-card p-16 text-center text-slate-400">
                    <Briefcase size={48} className="mx-auto mb-4 opacity-50 text-purple-400" />
                    <h3 className="text-xl font-bold text-slate-200">No opportunities found</h3>
                    <p>Be the first to share an opportunity with the campus network!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {opportunities.map(op => (
                        <div key={op._id} className="glass-card p-6 flex flex-col group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-slate-700/50 group-hover:bg-purple-500 transition-colors"></div>
                            
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border mb-3 ${getTypeColor(op.type)}`}>
                                        {op.type}
                                    </span>
                                    <h2 className="text-2xl font-bold text-slate-100 group-hover:text-purple-400 transition-colors">{op.title}</h2>
                                    <h3 className="text-lg text-slate-300 flex items-center gap-2 font-medium mt-1">
                                         <MapPin size={16} className="text-slate-500"/> {op.company}
                                    </h3>
                                </div>
                                <div className="text-right shrink-0">
                                   <p className="text-xs text-slate-500 mb-1">Deadline</p>
                                   <div className="flex items-center gap-1.5 text-rose-400 bg-rose-400/10 px-3 py-1.5 rounded-lg border border-rose-400/20 font-bold text-sm">
                                      <Calendar size={14} />
                                      {new Date(op.deadline).toLocaleDateString()}
                                   </div>
                                </div>
                            </div>

                            <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed">{op.description}</p>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {op.tags.map((tag, i) => (
                                    <span key={i} className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-lg border border-slate-700">#{tag}</span>
                                ))}
                            </div>

                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-700/50">
                                <div className="flex items-center gap-3">
                                    <img src={op.postedBy?.profile?.profilePic || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-full border border-slate-600" alt="poster" />
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">Posted by</p>
                                        <p className="text-sm font-bold text-slate-200">{op.postedBy?.name}</p>
                                    </div>
                                </div>
                                <a 
                                    href={op.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="px-5 py-2.5 bg-slate-800 hover:bg-purple-600 text-slate-200 hover:text-white rounded-xl font-bold transition-all flex items-center gap-2 group-hover:shadow-lg shadow-purple-500/20"
                                >
                                    Apply <ExternalLink size={16} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
                    <div className="bg-slate-800 rounded-3xl p-8 w-full max-w-2xl border border-slate-700 shadow-2xl animate-fade-in relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white"><Plus className="rotate-45" size={24} /></button>
                        <h2 className="text-2xl font-bold mb-6 text-slate-100 flex items-center gap-2"><Briefcase className="text-purple-400" /> Post New Opportunity</h2>
                        
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
                                    <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input-field bg-slate-900/50 border-slate-700" placeholder="e.g. Frontend Intern" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Company / Organization</label>
                                    <input required type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="input-field bg-slate-900/50 border-slate-700" placeholder="Google / MLH" />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Type</label>
                                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="input-field bg-slate-900/50 border-slate-700 appearance-none text-slate-300">
                                        <option value="internship">Internship</option>
                                        <option value="job">Job</option>
                                        <option value="hackathon">Hackathon</option>
                                        <option value="event">Event</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Deadline</label>
                                    <input required type="date" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} className="input-field bg-slate-900/50 border-slate-700 text-slate-300 [color-scheme:dark]" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Application Link</label>
                                <input required type="url" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="input-field bg-slate-900/50 border-slate-700" placeholder="https://..." />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Tags (comma separated)</label>
                                <input type="text" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="input-field bg-slate-900/50 border-slate-700" placeholder="React, Remote, Summer" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input-field bg-slate-900/50 border-slate-700 min-h-[120px] resize-none" placeholder="Details about the opportunity..."></textarea>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 text-slate-300 hover:text-white font-bold rounded-xl hover:bg-slate-700 transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 transition-all">Post Opportunity</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Opportunities;
