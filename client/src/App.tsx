import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import Events from './pages/Events';
import AdminDashboard from './pages/AdminDashboard';
import Network from './pages/Network';
import CampusMap from './pages/CampusMap';
import Opportunities from './pages/Opportunities';
import StudyRooms from './pages/StudyRooms';
import Polls from './pages/Polls';
import Marketplace from './pages/Marketplace';
import ResumeBuilder from './pages/ResumeBuilder';
import Reels from './pages/Reels';
import Sidebar from './components/Sidebar';
import AIChatbot from './components/AIChatbot';

const App: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
     return <div className="h-screen w-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent)]"></div>
     </div>
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg)] text-[var(--text-main)] transition-colors duration-300">
      {user && <Sidebar />}
      {user && <AIChatbot />}
      <main className={`flex-1 ${user ? 'ml-72 p-8' : ''} min-h-screen relative`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full h-full"
          >
            <Routes location={location}>
              <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
              <Route path="/network" element={user ? <Network /> : <Navigate to="/login" />} />
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
              <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
              <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
              <Route path="/chat" element={user ? <Chat /> : <Navigate to="/login" />} />
              <Route path="/events" element={user ? <Events /> : <Navigate to="/login" />} />
              <Route path="/map" element={user ? <CampusMap /> : <Navigate to="/login" />} />
              <Route path="/opportunities" element={user ? <Opportunities /> : <Navigate to="/login" />} />
              <Route path="/study-rooms" element={user ? <StudyRooms /> : <Navigate to="/login" />} />
              <Route path="/polls" element={user ? <Polls /> : <Navigate to="/login" />} />
              <Route path="/marketplace" element={user ? <Marketplace /> : <Navigate to="/login" />} />
              <Route path="/resume" element={user ? <ResumeBuilder /> : <Navigate to="/login" />} />
              <Route path="/reels" element={user ? <Reels /> : <Navigate to="/login" />} />
              <Route 
                path="/admin" 
                element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} 
              />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
