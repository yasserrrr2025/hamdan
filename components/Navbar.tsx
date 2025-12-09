import React from 'react';
import { User, UserRole } from '../types';
import { LogOut, User as UserIcon, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onSwitchRole: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onSwitchRole }) => {
  const location = useLocation();
  const isDashboard = location.pathname.includes('dashboard');

  return (
    <nav className="bg-secondary-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="font-bold text-xl">إ</span>
            </div>
            <Link to="/" className="text-xl font-bold tracking-wide">إنجاز للخدمات</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            <Link to="/" className="hover:text-primary-400 transition-colors px-3 py-2">الرئيسية</Link>
            <a href="#services" className="hover:text-primary-400 transition-colors px-3 py-2">الخدمات</a>
            {user && (
              <Link to={user.role === UserRole.ADMIN ? "/admin" : "/dashboard"} className="hover:text-primary-400 transition-colors px-3 py-2">
                 {user.role === UserRole.ADMIN ? 'لوحة التحكم' : 'طلباتي'}
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!user ? (
               <button onClick={onSwitchRole} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition text-sm font-medium">
                 تسجيل الدخول
               </button>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={onSwitchRole}
                  className="hidden md:flex items-center gap-1 text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-full text-slate-300"
                  title="Demo only"
                >
                  <ShieldCheck size={14} />
                  {user.role === UserRole.CLIENT ? 'عرض كمسؤول' : 'عرض كعميل'}
                </button>
                
                <div className="flex items-center gap-2 border-r border-slate-700 pr-3 mr-1">
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-slate-400">{user.role === UserRole.ADMIN ? 'مدير النظام' : 'عميل مميز'}</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border-2 border-primary-500">
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