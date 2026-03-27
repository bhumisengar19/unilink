import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { MapPin, Users, Coffee, BookOpen, MessageCircle } from 'lucide-react';

// Fix Leaflet Default Icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CampusMap: React.FC = () => {
    const { user } = useAuth();
    const [nearbyUsers, setNearbyUsers] = useState<any[]>([]);
    
    // Default campus coordinates (San Francisco State University as example)
    const campusCenter: [number, number] = [37.7219, -122.4782];

    const fetchNearby = async () => {
        try {
            const { data } = await api.get('/api/users/nearby');
            setNearbyUsers(data.nearby);
        } catch (error) {
            console.warn('Using Mock Map Data');
            setNearbyUsers([
                { _id: 'u1', name: 'Sarah Chen', lat: 37.7225, lng: -122.4785, status: 'Studying AI', icon: BookOpen },
                { _id: 'u2', name: 'James Wilson', lat: 37.7210, lng: -122.4770, status: 'At Canteen', icon: Coffee },
                { _id: 'u3', name: 'Elena Gilbert', lat: 37.7230, lng: -122.4775, status: 'Open to pair coding', icon: Users }
            ]);
        }
    };

    useEffect(() => {
        fetchNearby();
    }, []);

    return (
        <div className="h-full flex flex-col gap-6 animate-fade-in relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                <div>
                   <h2 className="text-4xl font-black text-white flex items-center gap-3">
                      <MapPin className="text-emerald-400" size={32} />
                      Campus Live
                   </h2>
                   <p className="text-slate-400 font-medium">Real-time student activity map</p>
                </div>
                <div className="flex gap-3">
                     <div className="glass-card flex items-center gap-2 px-4 py-2 border-emerald-500/20 text-emerald-400 text-xs font-black uppercase">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        84 Students Online
                     </div>
                </div>
            </div>

            <div className="flex-1 rounded-3xl overflow-hidden border border-slate-700/50 shadow-2xl relative">
                <MapContainer center={campusCenter} zoom={16} className="h-full w-full grayscale contrast-125 invert brightness-90">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    
                    {/* Own Location */}
                    <Marker position={campusCenter}>
                        <Popup>
                            <div className="p-2 text-center">
                                <p className="font-bold text-indigo-600">You are here</p>
                                <p className="text-xs text-slate-500">North Campus Library</p>
                            </div>
                        </Popup>
                    </Marker>

                    {/* Nearby Users */}
                    {nearbyUsers.map(u => (
                        <Marker key={u._id} position={[u.lat || campusCenter[0], u.lng || campusCenter[1]]}>
                            <Popup className="custom-popup">
                                <div className="p-3 w-48 bg-slate-900 text-white rounded-xl">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white">
                                           <u.icon size={16} />
                                        </div>
                                        <div>
                                            <p className="font-black text-sm italic">{u.name}</p>
                                            <p className="text-[10px] text-emerald-400 uppercase font-black tracking-tighter">Active Now</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 mb-4 font-medium leading-relaxed italic">"{u.status}"</p>
                                    <button className="w-full btn-primary h-8 text-[10px] uppercase font-black tracking-widest flex items-center justify-center gap-2">
                                        <MessageCircle size={12} />
                                        Send Message
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {/* Floating Map Controls overlay */}
                <div className="absolute bottom-6 left-6 z-[1000] flex flex-col gap-2">
                    <div className="glass-card p-4 flex flex-col gap-3 bg-slate-900/90 border-white/10">
                        <p className="text-[10px] font-black uppercase text-slate-500 mb-1 tracking-widest">Map Layers</p>
                        <button className="flex items-center gap-3 text-xs font-bold text-slate-300 hover:text-white transition-colors">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/20"><Coffee size={14} /></div>
                            Hangout Zones
                        </button>
                        <button className="flex items-center gap-3 text-xs font-bold text-slate-300 hover:text-white transition-colors">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/20"><BookOpen size={14} /></div>
                            Quiet Study Spot
                        </button>
                    </div>
                </div>
            </div>
            
            <style>{`
                .leaflet-container { background: #020617 !important; }
                .leaflet-popup-content-wrapper { background: transparent !important; border: none !important; box-shadow: none !important; }
                .leaflet-popup-tip { display: none; }
                .custom-popup .leaflet-popup-content { margin: 0 !important; }
            `}</style>
        </div>
    );
};

export default CampusMap;
