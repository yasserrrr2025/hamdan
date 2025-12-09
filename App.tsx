
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RequestForm from './pages/RequestForm';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import { User, UserRole } from './types';
import { dataService } from './services/dataService';

const AppContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  const hideFooter = ['/login', '/register'].includes(location.pathname);

  // Check for session on mount
  useEffect(() => {
     // In a full implementation, check supabase session here
     // supabase.auth.getSession()...
  }, []);

  const handleLogout = async () => {
    await dataService.signOut();
    setUser(null);
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  // Dummy switch function for Navbar interface, though specific login flow is now used
  const handleSwitchRole = () => {};

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-right" dir="rtl">
        <Navbar 
          user={user} 
          onLogout={handleLogout}
          onSwitchRole={handleSwitchRole}
        />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            
            <Route path="/register" element={<Register onLogin={handleLogin} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />

            {/* Protected Client Routes */}
            <Route path="/request/:serviceId" element={
              user ? <RequestForm user={user} /> : <Navigate to="/login" />
            } />
            <Route path="/dashboard" element={
              user ? <Dashboard user={user} /> : <Navigate to="/login" />
            } />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              user && user.role === UserRole.ADMIN ? <AdminDashboard user={user} /> : <Navigate to="/" />
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {!hideFooter && (
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
        )}
      </div>
  );
}

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;
