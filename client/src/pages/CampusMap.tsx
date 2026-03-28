import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { Loader2, MapPin, Navigation, Map as MapIcon, Shield, AlertTriangle, Phone, Save, X, Plus, Users, Heart } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';

// Fix for default Leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const Recenter: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng], 16);
    }, [lat, lng, map]);
    return null;
};

const CampusMap: React.FC = () => {
    const { user, updateUser } = useAuth();
    const { socket } = useChat();
    const [nearbyUsers, setNearbyUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [locationAllowed, setLocationAllowed] = useState(true);
    const [currentPos, setCurrentPos] = useState<[number, number] | null>(null);
    const [isSOSMode, setIsSOSMode] = useState(false);
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [emergencyContacts, setEmergencyContacts] = useState(user?.emergencyContacts || []);
    const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
    
    // Contact Form
    const [contactForm, setContactForm] = useState({ name: '', phone: '' });

    const shareLocation = (highAccuracy = false) => {
        if (!('geolocation' in navigator)) {
            setLocationAllowed(false);
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                setCurrentPos([lat, lng]);

                try {
                    const config = { headers: { Authorization: `Bearer ${user?.accessToken}` } };
                    await axios.put('/api/users/location', { lat, lng }, config);
                    const { data } = await axios.get(`/api/users/nearby?lat=${lat}&lng=${lng}&distance=5000`, config);
                    setNearbyUsers(data.users || []);
                    setLocationAllowed(true);
                } catch (error) {
                    console.error('Failed to update map', error);
                } finally {
                    setLoading(false);
                }
            },
            (error) => {
                console.error("Location Error: ", error);
                setLocationAllowed(false);
                setLoading(false);
            },
            { enableHighAccuracy: highAccuracy, timeout: 10000 }
        );
    };

    useEffect(() => {
        shareLocation(true);
        
        if (socket) {
            socket.on('emergencyAlert', (alert: any) => {
                setActiveAlerts(prev => [...prev, alert]);
                setTimeout(() => {
                    setActiveAlerts(prev => prev.filter(a => a.userId !== alert.userId));
                }, 10000);
            });
        }
        return () => { socket?.off('emergencyAlert'); };
    }, [socket]);

    const triggerSOS = () => {
        if (!currentPos) {
            alert("No GPS signal. Getting location...");
            shareLocation(true);
            return;
        }

        setIsSOSMode(true);
        if (socket) {
            socket.emit('sendSOS', {
                userId: user?._id,
                name: user?.name,
                location: currentPos,
                contacts: user?.emergencyContacts
            });
        }

        setTimeout(() => {
            setIsSOSMode(false);
            alert("SOS Broadcasted to Security and Nearby Peers.");
        }, 5000);
    };

    const handleSaveContacts = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user?.accessToken}` } };
            const { data } = await axios.put('/api/users/emergency-contacts', { contacts: emergencyContacts }, config);
            updateUser(data.user);
            setIsConfigOpen(false);
        } catch (error) {
            console.error('Error saving contacts:', error);
        }
    };

    const addContact = () => {
        if (emergencyContacts.length >= 2) return;
        if (!contactForm.name || !contactForm.phone) return;
        setEmergencyContacts([...emergencyContacts, contactForm]);
        setContactForm({ name: '', phone: '' });
    };

    const removeContact = (index: number) => {
        setEmergencyContacts(emergencyContacts.filter((_: any, i: number) => i !== index));
    };

    return (
        <div className={`max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 relative transition-colors duration-500 ${isSOSMode ? 'bg-red-500/10' : ''}`}>
            {/* Header / Sidebar Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0">
                <Card variant="neu" className="md:col-span-3 p-6 flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-[var(--bg)] to-[var(--shadow-dark)]/20 border-none">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-500 shadow-inner">
                            <Shield size={32} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-[var(--text-main)] tracking-tight">Security Radar</h1>
                            <p className="text-[var(--text-muted)] font-bold uppercase text-[9px] tracking-[0.2em] mt-1 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" /> 
                                Live Tracking Enabled
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-4 md:mt-0">
                        <Button 
                            variant="secondary" 
                            onClick={() => shareLocation(false)} 
                            disabled={loading}
                            className="h-14 px-6 !rounded-2xl gap-3 shadow-xl"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Navigation size={20} />}
                            <span className="font-black text-xs uppercase tracking-widest">Update GPS</span>
                        </Button>
                        <Button 
                            onClick={() => setIsConfigOpen(true)}
                            variant="secondary"
                            className="h-14 px-6 !rounded-2xl gap-3 shadow-xl"
                        >
                            <Plus size={20} />
                            <span className="font-black text-xs uppercase tracking-widest">Contacts</span>
                        </Button>
                    </div>
                </Card>

                <Card variant="neu" className="p-3 !rounded-[32px] overflow-hidden border-none shrink-0 relative group">
                    <button 
                        onClick={triggerSOS}
                        className={`w-full h-full flex flex-col items-center justify-center gap-2 group transition-all duration-300 ${isSOSMode ? 'animate-pulse' : ''}`}
                    >
                        <div className={`p-5 rounded-full transition-all duration-500 ${isSOSMode ? 'bg-white text-red-600 scale-125 shadow-[0_0_50px_rgba(255,255,255,0.5)]' : 'bg-red-500/10 text-red-500 shadow-inner'}`}>
                            <AlertTriangle size={36} fill={isSOSMode ? "currentColor" : "none"} strokeWidth={3} />
                        </div>
                        <span className={`font-black text-sm uppercase tracking-[0.3em] ${isSOSMode ? 'text-white' : 'text-red-500'}`}>
                            {isSOSMode ? "RINGING..." : "SOS HELP"}
                        </span>
                    </button>
                    {isSOSMode && <div className="absolute inset-0 bg-red-600 -z-10" />}
                </Card>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative rounded-[40px] overflow-hidden shadow-[24px_24px_48px_var(--shadow-dark),-24px_-24px_48px_var(--shadow-light)] border-4 border-[var(--bg)]">
                {!locationAllowed && (
                    <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md text-center p-12 animate-fade-in">
                        <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 mb-8 animate-bounce transition-all">
                            <MapPin size={48} strokeWidth={3} />
                        </div>
                        <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">Location Required</h2>
                        <p className="text-slate-400 max-w-sm font-bold text-lg mb-8 leading-relaxed">Exact coordinates are needed to provide emergency services and show nearby peers.</p>
                        <Button onClick={() => shareLocation(true)} className="h-16 px-12 !rounded-[24px] font-black text-lg uppercase tracking-wider">Try Again</Button>
                    </div>
                )}

                <div className="w-full h-full z-0">
                    <MapContainer 
                        center={currentPos || [17.3850, 78.4867]} 
                        zoom={16} 
                        style={{ height: '100%', width: '100%', backgroundColor: '#1e293b' }}
                        zoomControl={false}
                        attributionControl={false}
                    >
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        />

                        {currentPos && (
                            <>
                                <Recenter lat={currentPos[0]} lng={currentPos[1]} />
                                <Marker position={currentPos} icon={userIcon}>
                                    <Popup className="custom-popup">
                                        <div className="p-2">
                                            <p className="text-indigo-600 font-black uppercase text-[10px] tracking-widest">My Identity</p>
                                            <h4 className="font-bold text-slate-800 text-lg">{user?.name}</h4>
                                            <p className="text-xs text-slate-500 font-bold mt-1">Sharing exact location...</p>
                                        </div>
                                    </Popup>
                                </Marker>
                                <Circle 
                                    center={currentPos} 
                                    radius={50} 
                                    pathOptions={{ color: '#6366f1', fillColor: '#6366f1', fillOpacity: 0.1, weight: 2 }} 
                                />
                            </>
                        )}

                        {nearbyUsers.map(u => {
                            if (!u.location?.coordinates) return null;
                            const [lng, lat] = u.location.coordinates;
                            return (
                                <Marker key={u._id} position={[lat, lng]}>
                                    <Popup className="custom-popup">
                                        <Card variant="neu" className="border-none p-3 shadow-none flex items-center gap-4">
                                            <img src={u.profile?.profilePic || 'https://via.placeholder.com/40'} className="w-12 h-12 rounded-2xl object-cover shrink-0" alt="avatar" />
                                            <div>
                                                <h4 className="font-black text-slate-800 tracking-tight leading-none mb-1">{u.name}</h4>
                                                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{u.profile?.branch || 'Student'}</p>
                                            </div>
                                        </Card>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                </div>

                {/* Legend Overlay */}
                <div className="absolute top-6 left-6 p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-white z-10 pointer-events-none space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.6)]" />
                        <span className="text-[10px] font-black uppercase tracking-widest">You</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Students Nearby</span>
                    </div>
                </div>

                {/* SOS Alert Notification Loop */}
                <div className="absolute bottom-6 right-6 z-20 space-y-4 w-80">
                    <AnimatePresence>
                        {activeAlerts.map(alert => (
                            <motion.div 
                                key={alert.userId}
                                initial={{ x: 300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 300, opacity: 0 }}
                                className="p-6 bg-red-600 text-white rounded-[32px] shadow-2xl flex flex-col gap-4 border border-red-400/30"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/20 rounded-2xl">
                                        <AlertTriangle size={24} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-lg">EMERGENCY SOS</h4>
                                        <p className="text-xs font-bold opacity-80 uppercase tracking-widest">{alert.name} needs help!</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button className="flex-1 h-12 !rounded-2xl !bg-white !text-red-600 font-extrabold text-xs uppercase tracking-widest">Support</Button>
                                    <Button className="h-12 w-12 !rounded-2xl !bg-white/20 hover:!bg-white/40 border-none"><Navigation size={18} /></Button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Emergency Contacts Modal */}
            {isConfigOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-lg animate-fade-in">
                    <Card variant="neu" className="w-full max-w-lg !rounded-[40px] p-10 space-y-8 animate-scale-in border-none shadow-[24px_24px_48px_rgba(0,0,0,0.3)] bg-[var(--bg)]">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500">
                                    <Users size={28} strokeWidth={3} />
                                </div>
                                <h3 className="text-3xl font-black text-[var(--text-main)] tracking-tight">SOS Contacts</h3>
                            </div>
                            <button onClick={() => setIsConfigOpen(false)} className="p-3 hover:text-rose-500 transition-all active:scale-95"><X size={28} strokeWidth={3} /></button>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-4">
                                {emergencyContacts.map((c: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between p-6 rounded-3xl bg-[var(--shadow-dark)]/5 border border-[var(--shadow-dark)] shadow-sm group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-500 shadow-inner">
                                                <Phone size={20} />
                                            </div>
                                            <div>
                                                <h5 className="font-black text-[var(--text-main)]">{c.name}</h5>
                                                <p className="text-xs font-bold text-[var(--text-muted)] tracking-widest">{c.phone}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => removeContact(index)} className="p-2 text-rose-500 bg-rose-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                            <X size={20} />
                                        </button>
                                    </div>
                                ))}
                                
                                {emergencyContacts.length < 2 && (
                                    <div className="p-8 border-2 border-dashed border-[var(--shadow-dark)] rounded-[32px] space-y-6 bg-indigo-500/5">
                                        <div className="flex flex-col gap-4">
                                            <Input 
                                                placeholder="Recipient Name" 
                                                value={contactForm.name}
                                                onChange={e => setContactForm({...contactForm, name: e.target.value})}
                                                className="h-14 !rounded-2xl font-bold"
                                            />
                                            <Input 
                                                placeholder="Phone Number" 
                                                value={contactForm.phone}
                                                onChange={e => setContactForm({...contactForm, phone: e.target.value})}
                                                className="h-14 !rounded-2xl font-bold"
                                            />
                                        </div>
                                        <Button fullWidth onClick={addContact} className="h-14 !rounded-2xl gap-2 font-black uppercase tracking-widest">
                                            <Plus size={20} strokeWidth={3} />
                                            <span>Add Contact</span>
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4 pt-6">
                                <Button variant="secondary" className="flex-1 h-16 !rounded-2xl font-black uppercase tracking-widest" onClick={() => setIsConfigOpen(false)}>Cancel</Button>
                                <Button className="flex-[2] h-16 !rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 gap-3" onClick={handleSaveContacts}>
                                    <Save size={20} strokeWidth={2.5} />
                                    <span>Sync Dashboard</span>
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            <style>
                {`
                    .custom-popup .leaflet-popup-content-wrapper {
                        background: rgba(255, 255, 255, 0.95);
                        backdrop-filter: blur(8px);
                        border-radius: 20px;
                        padding: 0;
                        overflow: hidden;
                        box-shadow: 0 20px 40px rgba(0,0,0,0.2) !important;
                    }
                    .custom-popup .leaflet-popup-tip { background: white; }
                    .custom-popup.dark .leaflet-popup-content-wrapper { background: #1e293b; color: #f8fafc; }
                    .leaflet-container { font-family: 'Outfit', sans-serif !important; }
                `}
            </style>
        </div>
    );
};

export default CampusMap;
