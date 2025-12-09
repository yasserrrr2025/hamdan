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

        <footer className="bg-primary-900 text-slate-300 py-12 mt-auto border-t-4 border-gold-500">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-right">
              <div>
                <h3 className="text-white font-bold text-lg mb-4">حمدان للخدمات العامة</h3>
                <p className="text-sm opacity-80 leading-relaxed">
                  شريكك الموثوق لتخليص كافة المعاملات الحكومية والتعقيب. دقة، سرعة، وأمانة في العمل.
                </p>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-4">روابط سريعة</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-gold-400 transition">الرئيسية</a></li>
                  <li><a href="#services" className="hover:text-gold-400 transition">الخدمات</a></li>
                  <li><a href="#" className="hover:text-gold-400 transition">تتبع الطلب</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-4">تواصل معنا</h3>
                <ul className="space-y-2 text-sm">
                  <li>الرياض، المملكة العربية السعودية</li>
                  <li>هاتف: 920000000</li>
                  <li>بريد: info@hamdan-services.com</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-primary-800 pt-8 text-center text-xs text-slate-500">
              <p>© 2023 حمدان للخدمات العامة. جميع الحقوق محفوظة.</p>
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;