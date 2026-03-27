import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Users, Plus, Star, Bell, Clock, Info } from 'lucide-react';
import { format } from 'date-fns';

interface Event {
    _id: string;
    title: string;
    description: string;
    location: string;
    date: string;
    organizer: any;
    eventType: string;
    attendees: string[];
}

const Events: React.FC = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        try {
            const { data } = await axios.get('/api/events');
            setEvents(data.events);
        } catch (error) {
            console.warn('Using Mock Events');
            setEvents([
                {
                    _id: 'e1', title: 'Global University Hackathon 2026', 
                    description: '24 hours of coding, networking, and innovation. Food and drinks provided!',
                    location: 'Main Auditorium, North Campus', date: new Date(Date.now() + 86400000).toISOString(),
                    organizer: { name: 'Sarah Chen' }, eventType: 'hackathon', attendees: []
                },
                {
                    _id: 'e2', title: 'React & Post-Modern Web Workshop', 
                    description: 'Learn the latest trends in web development including Server Components and AI-Integration.',
                    location: 'Virtual Session via Zoom', date: new Date(Date.now() + 172800000).toISOString(),
                    organizer: { name: 'Sarah Chen' }, eventType: 'workshop', attendees: []
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleRSVP = async (eventId: string) => {
         try {
             const config = {
                 headers: { Authorization: `Bearer ${user?.accessToken}` }
             };
             const { data } = await axios.post(`/api/events/rsvp/${eventId}`, {}, config);
             setEvents(prev => prev.map(e => e._id === eventId ? { ...e, attendees: data.attendees } : e));
         } catch (error) {
              console.error('Error rsvp event:', error);
         }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                   <h2 className="text-3xl font-black text-slate-100 mb-2">Campus Events</h2>
                   <p className="text-slate-400 font-medium">Discover workshops, hackathons, and clubs</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Plus size={20} />
                    <span>Create Event</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1,2,3].map(i => <div key={i} className="h-64 glass-card animate-pulse" />)
                ) : (
                    events.map(event => (
                        <div key={event._id} className="glass-card flex flex-col group hover:shadow-2xl hover:shadow-indigo-500/10 transition-all cursor-pointer">
                            <div className="h-40 bg-indigo-500/10 flex items-center justify-center p-6 relative overflow-hidden">
                               <div className="absolute top-4 right-4 bg-slate-900/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-indigo-400 border border-indigo-500/20">
                                   {event.eventType}
                               </div>
                               <Calendar className="text-indigo-400 group-hover:scale-110 transition-transform" size={48} />
                            </div>
                            
                            <div className="p-6 space-y-4 flex-1 flex flex-col">
                                <div>
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors line-clamp-1">{event.title}</h3>
                                    <p className="text-xs text-slate-400 line-clamp-2 italic">{event.description}</p>
                                </div>

                                <div className="space-y-2 mt-auto">
                                   <div className="flex items-center gap-2 text-xs text-slate-300">
                                       <Calendar size={14} className="text-indigo-400" />
                                       <span>{format(new Date(event.date), 'PPP p')}</span>
                                   </div>
                                   <div className="flex items-center gap-2 text-xs text-slate-300">
                                       <MapPin size={14} className="text-rose-400" />
                                       <span>{event.location}</span>
                                   </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-300">
                                       <Users size={14} className="text-emerald-400" />
                                       <span>{event.attendees.length} Students RSVPed</span>
                                   </div>
                                </div>
                                
                                <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between gap-4">
                                     <button 
                                        onClick={() => handleRSVP(event._id)}
                                        className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-xl font-bold text-sm transition-all ${event.attendees.includes(user?._id || '') ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-slate-700 hover:bg-slate-600 text-white shadow-lg shadow-indigo-500/10'}`}
                                     >
                                         <Star size={16} fill={event.attendees.includes(user?._id || '') ? 'currentColor' : 'none'} />
                                         <span>{event.attendees.includes(user?._id || '') ? 'Going' : 'Attend'}</span>
                                     </button>
                                     <button className="h-10 w-10 glass-card bg-slate-700/30 flex items-center justify-center text-slate-400 hover:text-indigo-400 transition-colors">
                                         <Bell size={18} />
                                     </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            {/* Calendar Integration Placeholder */}
            <div className="glass-card p-10 mt-12 text-center space-y-6 flex flex-col items-center bg-gradient-to-br from-indigo-500/5 to-rose-500/5">
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-400 shadow-xl border border-indigo-500/10">
                   <Clock size={32} />
                </div>
                <div>
                   <h3 className="text-2xl font-bold text-slate-100">Sync with your Calendar</h3>
                   <p className="text-slate-400">Never miss another hackathon. Connect your Google or Outlook calendar to UniLink.</p>
                </div>
                <div className="flex gap-4">
                     <button className="glass-card h-12 px-6 flex items-center gap-2 hover:bg-slate-700 transition-colors font-semibold">
                         Connect Google
                     </button>
                      <button className="glass-card h-12 px-6 flex items-center gap-2 hover:bg-slate-700 transition-colors font-semibold">
                         Connect Microsoft
                     </button>
                </div>
            </div>
        </div>
    );
};

export default Events;
