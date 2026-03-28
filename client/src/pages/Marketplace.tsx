import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Search, Plus, Tag, MessageCircle, Filter, Loader2, IndianRupee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    condition: string;
    images: string[];
    seller: {
        _id: string;
        name: string;
        profile: { profilePic: string };
    };
    createdAt: string;
}

const Marketplace: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: 'Electronics',
        condition: 'Good',
        images: ''
    });

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user?.accessToken}` } };
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (category) params.append('category', category);
            
            const { data } = await axios.get(`/api/marketplace?${params.toString()}`, config);
            setProducts(data.products || []);
        } catch (error) {
            console.error('Error fetching marketplace:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [category]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user?.accessToken}` } };
            const payload = { ...formData, price: Number(formData.price), images: formData.images ? [formData.images] : [] };
            await axios.post('/api/marketplace', payload, config);
            setShowModal(false);
            setFormData({ title: '', description: '', price: '', category: 'Electronics', condition: 'Good', images: '' });
            fetchProducts();
        } catch (error) {
            console.error('Error listing product:', error);
        }
    };

    const contactSeller = async (sellerId: string) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user?.accessToken}` } };
            await axios.post('/api/chats', { userId: sellerId }, config);
            navigate('/chat');
        } catch (error) {
            console.error('Error starting chat:', error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass-card p-8 border-t-4 border-t-emerald-500">
                <div>
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent flex items-center gap-3">
                        <ShoppingBag size={32} className="text-emerald-400" />
                        Campus Marketplace
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium">Buy, sell, or rent items within your university community.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="btn-primary py-3 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-500/20"
                >
                    <Plus size={20} /> List Item
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search items..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
                        className="input-field pl-12 h-12 bg-slate-900/50"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {['', 'Books', 'Electronics', 'Dorm Essentials', 'Stationery', 'Clothing'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-4 py-2 rounded-xl border font-bold capitalize transition-all whitespace-nowrap ${
                                category === cat 
                                ? 'bg-emerald-600 text-white border-emerald-500' 
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-emerald-500/50'
                            }`}
                        >
                            {cat || 'All Items'}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-20"><Loader2 className="animate-spin w-10 h-10 text-emerald-500" /></div>
            ) : products.length === 0 ? (
                <div className="glass-card p-16 text-center text-slate-400">
                    <Tag size={48} className="mx-auto mb-4 opacity-50 text-emerald-400" />
                    <h3 className="text-xl font-bold text-slate-200">No items listed</h3>
                    <p>Be the first to list an item for your campus peers!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map(p => (
                        <div key={p._id} className="glass-card flex flex-col group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden bg-slate-800/40">
                            <div className="h-48 overflow-hidden bg-slate-900 border-b border-slate-700/50">
                                <img 
                                    src={p.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                    alt="Product" 
                                />
                            </div>
                            <div className="p-4 flex-1 flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/5">{p.category}</span>
                                    <span className="text-[10px] font-bold text-slate-500">{p.condition}</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-100 line-clamp-1">{p.title}</h3>
                                    <p className="text-2xl font-black text-indigo-400 flex items-center gap-1">
                                         <IndianRupee size={18} />{p.price.toLocaleString()}
                                    </p>
                                </div>
                                <div className="mt-auto pt-4 border-t border-slate-700/50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <img src={p.seller?.profile?.profilePic || 'https://via.placeholder.com/32'} className="w-6 h-6 rounded-full" alt="avatar" />
                                        <span className="text-xs font-medium text-slate-400 truncate max-w-[80px]">{p.seller?.name}</span>
                                    </div>
                                    <button 
                                        onClick={() => contactSeller(p.seller?._id)}
                                        className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg hover:bg-indigo-500/20 transition-all"
                                    >
                                        <MessageCircle size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
                    <div className="bg-slate-800 rounded-3xl p-8 w-full max-w-lg border border-slate-700 shadow-2xl animate-fade-in relative">
                        <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white"><Plus className="rotate-45" size={24} /></button>
                        <h2 className="text-2xl font-bold mb-6 text-slate-100 flex items-center gap-2"><ShoppingBag className="text-emerald-400" /> List an Item</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
                                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input-field bg-slate-900 border-slate-700" placeholder="e.g. Engineering Mathematics Book" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Price (₹)</label>
                                    <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="input-field bg-slate-900 border-slate-700" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
                                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="input-field bg-slate-900 border-slate-700 appearance-none">
                                        {['Books', 'Electronics', 'Dorm Essentials', 'Stationery', 'Clothing', 'Other'].map(cat => <option key={cat}>{cat}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input-field bg-slate-900 border-slate-700 min-h-[80px] resize-none"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Image URL (Optional)</label>
                                <input type="url" value={formData.images} onChange={e => setFormData({...formData, images: e.target.value})} className="input-field bg-slate-900 border-slate-700" placeholder="https://..." />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700">Post Item</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Marketplace;
