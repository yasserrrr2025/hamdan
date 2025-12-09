
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { User, UserRole } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // For demo purposes, checking the static admin credentials or using Supabase
      if (formData.email === 'admin@hamdan.com' && formData.password === 'admin123') {
         // Fake admin login for demo without Supabase auth for admin
         const adminUser: User = {
            id: 'admin_id',
            name: 'مدير النظام',
            email: 'admin@hamdan.com',
            phone: '0500000000',
            role: UserRole.ADMIN,
            avatar: 'https://ui-avatars.com/api/?name=Admin&background=1e3a8a&color=fff'
         };
         onLogin(adminUser);
         navigate('/admin');
         return;
      }

      const { user, profile } = await dataService.signIn(formData.email, formData.password);
      
      if (user && profile) {
        const loggedUser: User = {
          id: user.id,
          name: profile.name,
          email: user.email || '',
          phone: profile.phone,
          role: profile.role as UserRole,
          avatar: profile.avatar
        };
        onLogin(loggedUser);
        navigate(loggedUser.role === UserRole.ADMIN ? '/admin' : '/dashboard');
      } else {
        setError('بيانات الدخول غير صحيحة');
      }
    } catch (err: any) {
      setError(err.message || 'فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Right Side - Visuals */}
      <div className="md:w-1/2 bg-primary-900 text-white p-12 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#d4af37 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        <div className="relative z-10">
           <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-gold-500/30 mb-8">
              <ShieldCheck size={32} className="text-gold-400" />
           </div>
           <h1 className="text-4xl font-bold mb-4">أهلاً بك مجدداً</h1>
           <p className="text-primary-200 text-lg leading-relaxed max-w-md">
             تابع حالة طلباتك وتواصل مع فريقنا مباشرة من خلال لوحة التحكم الخاصة بك.
           </p>
        </div>
      </div>

      {/* Left Side - Form */}
      <div className="md:w-1/2 p-8 md:p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">تسجيل الدخول</h2>
            <p className="text-slate-500">أدخل البريد الإلكتروني وكلمة المرور للمتابعة</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 text-center border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute top-3.5 right-4 text-slate-400" size={20} />
              <input
                type="email"
                name="email"
                placeholder="البريد الإلكتروني"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <Lock className="absolute top-3.5 right-4 text-slate-400" size={20} />
              <input
                type="password"
                name="password"
                placeholder="كلمة المرور"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-between items-center text-sm">
               <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                 <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500" />
                 <span>تذكرني</span>
               </label>
               <a href="#" className="text-gold-600 hover:text-gold-700 font-medium">نسيت كلمة المرور؟</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-800 transition shadow-lg shadow-primary-900/20 flex items-center justify-center gap-2"
            >
              {loading ? 'جاري التحقق...' : 'دخول'}
              {!loading && <ArrowRight size={20} className="rtl:rotate-180" />}
            </button>
          </form>

          <p className="text-center mt-8 text-slate-500">
            ليس لديك حساب؟{' '}
            <Link to="/register" className="text-gold-600 font-bold hover:underline">
              أنشئ حساب جديد
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
