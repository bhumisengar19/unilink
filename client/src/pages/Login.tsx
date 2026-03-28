import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, UserPlus, LogIn, Github } from 'lucide-react';
import confetti from 'canvas-confetti';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Login: React.FC = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
             confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#6366f1', '#a855f7', '#ec4899']
             });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden bg-[var(--bg)] transition-colors duration-300">
            {/* Soft Background Blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] -z-10 animate-pulse delay-700" />
            
            <Card variant="neu" className="max-w-md w-full p-10 space-y-8 !rounded-[40px] border-none shadow-2xl">
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-indigo-500/20 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                        <LogIn className="text-white" size={36} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-[var(--text-main)] mb-2 tracking-tight">Welcome Back</h2>
                        <p className="text-[var(--text-muted)] font-bold uppercase text-[10px] tracking-[0.2em] opacity-70">Elevate Your Campus Experience</p>
                    </div>
                </div>

                {error && (
                    <Card variant="neu" className="p-4 !bg-rose-500/5 border-none !rounded-2xl text-rose-500 text-sm text-center font-bold shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05)]">
                        {error}
                    </Card>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-4 mb-2 block">Campus Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors z-10" size={20} />
                            <Input 
                                type="email" 
                                required 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@university.edu"
                                className="pl-14 h-14 !rounded-2xl font-bold"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                         <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-4 mb-2 block">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors z-10" size={20} />
                            <Input 
                                type="password" 
                                required 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="pl-14 h-14 !rounded-2xl font-bold"
                            />
                        </div>
                        <div className="text-right px-2">
                             <button type="button" className="text-xs text-[var(--accent)] hover:underline font-black uppercase tracking-tighter transition-all">Forgot password?</button>
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        disabled={loading}
                        fullWidth
                        className="h-14 !rounded-2xl text-lg font-black uppercase tracking-widest shadow-lg"
                    >
                        {loading ? <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" /> : 'Sign In'}
                    </Button>
                    
                    <div className="relative flex items-center gap-4 text-[var(--text-muted)] py-2">
                        <div className="flex-1 h-[2px] bg-[var(--shadow-dark)] rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">OR</span>
                        <div className="flex-1 h-[2px] bg-[var(--shadow-dark)] rounded-full" />
                    </div>
                    
                    <Button variant="secondary" fullWidth className="h-14 !rounded-2xl gap-3 border-none shadow-md">
                        <Github size={20} />
                        <span className="font-black text-xs uppercase tracking-widest">Connect with Google</span>
                    </Button>
                </form>

                <div className="text-center pt-4">
                    <p className="text-[var(--text-muted)] text-sm font-bold">
                        New on UniLink? {' '}
                        <Link to="/register" className="text-[var(--accent)] hover:text-indigo-400 font-black transition-all inline-flex items-center gap-1 group uppercase tracking-tighter">
                            Create account
                            <UserPlus size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default Login;
