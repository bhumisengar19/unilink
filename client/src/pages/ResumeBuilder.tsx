import React, { useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { FileText, Download, Briefcase, GraduationCap, Code, Trophy, User as UserIcon } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';

const ResumeBuilder: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const resumeRef = useRef<HTMLDivElement>(null);

    const downloadPDF = async () => {
        if (!resumeRef.current) return;
        
        const canvas = await html2canvas(resumeRef.current, {
            scale: 2,
            backgroundColor: '#ffffff',
            useCORS: true
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${user?.name.replace(' ', '_')}_Resume.pdf`);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in relative pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass-card p-8 border-t-4 border-t-rose-500">
                <div>
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-rose-400 to-orange-500 bg-clip-text text-transparent flex items-center gap-3">
                        <FileText size={32} className="text-rose-400" />
                        Smart Resume Builder
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium">Generate an ATS-friendly resume instantly from your profile.</p>
                </div>
                <button 
                    onClick={downloadPDF}
                    className="btn-primary py-3 px-6 bg-gradient-to-r from-rose-600 to-orange-600 shadow-rose-500/20 flex items-center gap-2"
                >
                    <Download size={20} /> Export PDF
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
                {/* Resume Preview */}
                <div className="bg-white rounded-2xl shadow-2xl p-0 overflow-hidden transform transition-transform border border-slate-700/10 origin-top">
                    <div ref={resumeRef} className="p-[1.5in] text-slate-900 bg-white min-h-[11in] w-full mx-auto font-sans leading-relaxed">
                        {/* Header */}
                        <div className="border-b-4 border-slate-900 pb-8 mb-10">
                            <h1 className="text-5xl font-black uppercase tracking-tight text-slate-900 mb-2">{user?.name}</h1>
                            <div className="flex flex-wrap gap-4 text-sm font-semibold text-slate-600">
                                <span>{user?.email}</span>
                                <span>•</span>
                                <span>{user?.profile?.branch}</span>
                                <span>•</span>
                                <span>Year {user?.profile?.year}</span>
                            </div>
                        </div>

                        {/* Sections */}
                        <div className="grid grid-cols-1 gap-12">
                            <section>
                                <h2 className="text-xl font-black uppercase tracking-widest text-slate-900 border-b-2 border-slate-900 pb-2 mb-4 flex items-center gap-2">
                                     Professional Summary
                                </h2>
                                <p className="text-slate-700 leading-relaxed font-medium">
                                    {user?.profile?.bio || 'An ambitious student dedicated to professional growth and technical excellence.'}
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-black uppercase tracking-widest text-slate-900 border-b-2 border-slate-900 pb-2 mb-4">
                                     Technical Skills
                                </h2>
                                <div className="flex flex-wrap gap-x-6 gap-y-2">
                                    {user?.profile?.skills?.map((skill: string, i: number) => (
                                        <div key={i} className="flex items-center gap-2 font-bold text-slate-800">
                                             <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                                             {skill}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h2 className="text-xl font-black uppercase tracking-widest text-slate-900 border-b-2 border-slate-900 pb-2 mb-4">
                                     Education
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-black text-slate-900 text-lg">Bachelor of Technology in {user?.profile?.branch}</h3>
                                        <p className="text-slate-600 font-bold uppercase tracking-wider text-sm mt-1">Expected Graduation: 202{Number(user?.profile?.year || 4) + 2}</p>
                                    </div>
                                </div>
                            </section>
                            
                            <section>
                                <h2 className="text-xl font-black uppercase tracking-widest text-slate-900 border-b-2 border-slate-900 pb-2 mb-4">
                                     Projects & Achievements
                                </h2>
                                <p className="text-slate-500 italic mt-2">Update your UniLink profile to showcase detailed projects here.</p>
                            </section>
                        </div>
                    </div>
                </div>

                {/* Info Panel */}
                <div className="space-y-6 self-start">
                    <div className="glass-card p-6 border-rose-500/20">
                        <h4 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
                            <Trophy size={18} className="text-rose-400" /> Resume Score
                        </h4>
                        <div className="w-full bg-slate-900 rounded-full h-4 mb-3">
                             <div className="bg-rose-500 h-full rounded-full w-[70%] transition-all duration-1000 shadow-lg shadow-rose-500/20" />
                        </div>
                        <p className="text-xs text-slate-400 mb-6">Your profile is 70% complete. Add more skills to improve your ATS score.</p>
                        <button 
                            onClick={() => navigate('/profile')}
                            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
                        >
                            <UserIcon size={18} /> Edit Profile Info
                        </button>
                    </div>

                    <div className="glass-card p-6 bg-slate-800/10 border-slate-700/50">
                        <h4 className="font-bold text-slate-300 mb-4 uppercase tracking-widest text-xs">Best Practices</h4>
                        <ul className="space-y-3">
                            {[
                                'Use strong action verbs',
                                'Quantify your achievements',
                                'Keep skills relevant to job',
                                'One page maximum for students'
                            ].map((tip, i) => (
                                <li key={i} className="text-xs text-slate-500 flex items-start gap-2 leading-relaxed">
                                    <span className="text-rose-400 mt-1">•</span> {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilder;
