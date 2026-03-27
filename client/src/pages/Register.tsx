import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, UserPlus, LogIn, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const Register: React.FC = () => {
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register(name, email, password);
             confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
             });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl -z-10 animate-pulse delay-500" />

            <div className="max-w-md w-full glass-card p-10 space-y-8 animate-fade-in">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-2xl mx-auto flex items-center justify-center shadow-2xl shadow-indigo-500/20">
                        <UserPlus className="text-white" size={32} />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-slate-100 mb-2">Join UniLink</h2>
                        <p className="text-slate-400 font-medium italic">Empower your campus networking</p>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm text-center font-medium animate-shake">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                         <label className="text-sm font-semibold text-slate-400 ml-1">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
                            <input 
                                type="text" 
                                required 
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                className="input-field pl-12 h-12"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-400 ml-1">Campus Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
                            <input 
                                type="email" 
                                required 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@university.edu"
                                className="input-field pl-12 h-12"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-400 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
                            <input 
                                type="password" 
                                required 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="input-field pl-12 h-12"
                            />
                        </div>
                        <p className="text-xs text-slate-500 italic mt-1 ml-1 px-1 line-clamp-1 truncate">Min. 6 characters required</p>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn-primary w-full h-12 text-lg font-bold flex items-center justify-center gap-2 group"
                    >
                        {loading ? <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Get Started'}
                        <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    <div className="relative flex items-center gap-4 text-slate-500 py-4">
                        <div className="flex-1 h-px bg-slate-700/50" />
                        <span className="text-sm font-bold uppercase tracking-wider">or sign up with</span>
                        <div className="flex-1 h-px bg-slate-700/50" />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                         <button type="button" className="w-full glass-card hover:bg-slate-700/50 h-10 flex items-center justify-center gap-3 transition-colors font-semibold">
                            Google Login
                        </button>
                    </div>
                </form>

                <div className="text-center">
                    <p className="text-slate-400 font-medium">
                        Already have an account? {' '}
                        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors inline-flex items-center gap-1 group">
                            Sign in here
                            <LogIn size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
