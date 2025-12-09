
import React from 'react';
import { User, UserRole } from '../types';
import { LogOut, User as UserIcon, ShieldCheck } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onSwitchRole: () => void; // Kept for interface compatibility but not used directly
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide Navbar on Login/Register pages
  if (['/login', '/register'].includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="bg-white text-primary-900 shadow-md sticky top-0 z-50 border-b border-gold-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-primary-900 rounded-lg flex items-center justify-center relative overflow-hidden shadow-lg border border-gold-400">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-900 to-primary-700"></div>
              <span className="relative text-gold-400 font-extrabold text-2xl" style={{ fontFamily: 'sans-serif' }}>H</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-primary-900 tracking-tight leading-none">حمدان</span>
              <span className="text-sm font-medium text-gold-600 tracking-wide">للخدمات العامة</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 space-x-reverse bg-slate-50 rounded-full px-2 py-1 border border-slate-100">
            <Link to="/" className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${location.pathname === '/' ? 'bg-primary-900 text-white shadow-md' : 'text-slate-600 hover:text-primary-900 hover:bg-white'}`}>الرئيسية</Link>
            <a href="/#services" className="px-5 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-primary-900 hover:bg-white transition-all">الخدمات</a>
            {user && (
              <Link to={user.role === UserRole.ADMIN ? "/admin" : "/dashboard"} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${location.pathname.includes('dashboard') || location.pathname.includes('admin') ? 'bg-primary-900 text-white shadow-md' : 'text-slate-600 hover:text-primary-900 hover:bg-white'}`}>
                 {user.role === UserRole.ADMIN ? 'لوحة التحكم' : 'طلباتي'}
              </Link>
            )}
          </div>

          {/* User Section */}
          <div className="flex items-center gap-3">
            {!user ? (
               <div className="flex gap-2">
                 <Link to="/login" className="px-4 py-2 text-primary-900 font-bold hover:bg-slate-50 rounded-lg transition text-sm">
                   دخول
                 </Link>
                 <Link to="/register" className="bg-gold-500 hover:bg-gold-600 text-white px-5 py-2 rounded-lg transition text-sm font-bold shadow-md shadow-gold-200">
                   حساب جديد
                 </Link>
               </div>
            ) : (
              <div className="flex items-center gap-3">
                 <button 
                  onClick={onLogout}
                  className="text-slate-400 hover:text-red-500 transition p-2"
                  title="تسجيل الخروج"
                >
                  <LogOut size={20} className="rtl:rotate-180" />
                </button>
                <div className="h-8 w-px bg-slate-200 mx-2"></div>
                <div className="flex items-center gap-3 pl-2">
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-bold text-primary-900">{user.name}</span>
                    <span className="text-xs text-gold-600 font-medium">{user.role === UserRole.ADMIN ? 'مدير النظام' : 'عميل مميز'}</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-gold-400 shadow-sm">
                     <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
