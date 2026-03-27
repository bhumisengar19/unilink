import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import Events from './pages/Events';
import Discovery from './pages/Discovery';
import Leaderboard from './pages/Leaderboard';
import Assistant from './pages/Assistant';
import AdminDashboard from './pages/AdminDashboard';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
     return <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
     </div>
  }

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">
      {user && <Sidebar />}
      <main className={`flex-1 ${user ? 'ml-64 p-8' : ''}`}>
        <Routes>
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/chat" element={user ? <Chat /> : <Navigate to="/login" />} />
          <Route path="/events" element={user ? <Events /> : <Navigate to="/login" />} />
          <Route path="/discovery" element={user ? <Discovery /> : <Navigate to="/login" />} />
          <Route path="/leaderboard" element={user ? <Leaderboard /> : <Navigate to="/login" />} />
          <Route path="/assistant" element={user ? <Assistant /> : <Navigate to="/login" />} />
          <Route 
            path="/admin" 
            element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} 
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
