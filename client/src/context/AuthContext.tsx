import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  accessToken: string;
  profile?: any;
  gamification?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('unilink_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const mockLogin = () => {
    const demoUser = {
      _id: 'mock_123',
      name: 'Demo Student',
      email: 'demo@university.edu',
      role: 'admin',
      accessToken: 'mock_token',
      profile: {
        bio: 'Explorer of technology and campus life.',
        branch: 'Computer Science',
        year: '3rd',
        skills: ['React', 'Node.js', 'UI/UX'],
        profilePic: 'https://i.pravatar.cc/150?u=demo'
      },
      gamification: { points: 1250 }
    };
    setUser(demoUser);
    localStorage.setItem('unilink_user', JSON.stringify(demoUser));
    navigate('/');
  };

  const login = async (email: string, password: string) => {
    try {
      if (email === 'demo@unilink.com' && password === 'demo123') {
          return mockLogin();
      }
      const { data } = await api.post('/api/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('unilink_user', JSON.stringify(data));
      navigate('/');
    } catch (error: any) {
      console.warn('Real login failed, try entering demo@unilink.com / demo123');
      const msg = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(msg);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const { data } = await api.post('/api/auth/register', { name, email, password });
      setUser(data);
      localStorage.setItem('unilink_user', JSON.stringify(data));
      navigate('/');
    } catch (error: any) {
      console.error('Registration error detail:', error.response?.data);
      const msg = error.response?.data?.message || error.message || 'Registration failed';
      throw new Error(msg);
    }
  };

  const logout = () => {
    localStorage.removeItem('unilink_user');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
