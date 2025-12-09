import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RequestForm from './pages/RequestForm';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import { User, UserRole } from './types';
import { CURRENT_USER, ADMIN_USER } from './services/mockData';

const App: React.FC = () => {
  // Simulating Auth State
  // Default is Client for demo purposes
  const [user, setUser] = useState<User | null>(CURRENT_USER);

  const handleLogout = () => {
    setUser(null);
  };

  const toggleRole = () => {
    // If currently Client (or logged out but switching via specific logic), ask for password to become Admin
    if (!user || user.role === UserRole.CLIENT) {
      const password = window.prompt("الرجاء إدخال كلمة مرور المسؤول للدخول:");
      if (password === "1091314961@@") {
        setUser(ADMIN_USER);
      } else if (password !== null) {
        alert("كلمة المرور غير صحيحة");
      }
    } else {
      // If currently Admin, switch back to Client without password
      setUser(CURRENT_USER);
    }
  };

  const handleLogin = () => {
    // In a real app, this would open a modal or redirect
    setUser(CURRENT_USER);
  };

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-right" dir="rtl">
        <Navbar 
          user={user} 
          onLogout={handleLogout}
          onSwitchRole={user ? toggleRole : handleLogin}
        />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Protected Client Routes */}
            <Route path="/request/:serviceId" element={
              user ? <RequestForm user={user} /> : <Navigate to="/" />
            } />
            <Route path="/dashboard" element={
              user ? <Dashboard user={user} /> : <Navigate to="/" />
            } />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              user && user.role === UserRole.ADMIN ? <AdminDashboard user={user} /> : <Navigate to="/" />
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
            <p className="mb-2">© 2023 إنجاز للخدمات العامة. جميع الحقوق محفوظة.</p>
            <div className="flex justify-center gap-4 mt-4">
              <a href="#" className="hover:text-primary-600 transition">سياسة الخصوصية</a>
              <a href="#" className="hover:text-primary-600 transition">الشروط والأحكام</a>
              <a href="#" className="hover:text-primary-600 transition">اتصل بنا</a>
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;