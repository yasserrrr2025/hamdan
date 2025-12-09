
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { User as UserIcon, Mail, Phone, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { User, UserRole } from '../types';

interface RegisterProps {
  onLogin: (user: User) => void;
}

const Register: React.FC<RegisterProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    setLoading(true);
    try {
      const { user, session } = await dataService.signUp(formData.email, formData.password, formData.name, formData.phone);
      
      if (user && session) {
        // تسجيل دخول تلقائي
        const newUser: User = {
          id: user.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: UserRole.CLIENT,
          avatar: `https://ui-avatars.com/api/?name=${formData.name}&background=1e3a8a&color=fff`
        };
        
        onLogin(newUser);
        navigate('/dashboard');
      } else {
        // في حال كانت إعدادات Supabase تتطلب تأكيد البريد رغم ذلك
        alert('تم إنشاء الحساب بنجاح! يرجى تأكيد البريد الإلكتروني ثم تسجيل الدخول.');
        navigate('/login');
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء التسجيل');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Right Side - Visuals */}
      <div className="md:w-1/2 bg-primary-900 text-white p-12 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#d4af37 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="absolute top-1/2 -right-24 w-64 h-64 bg-gold-600 rounded-full blur-3xl opacity-20"></div>
        
        <div className="relative z-10">
           <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-gold-500/30 mb-8">
              <ShieldCheck size={32} className="text-gold-400" />
           </div>
           <h1 className="text-4xl font-bold mb-4">انضم إلى حمدان للخدمات</h1>
           <p className="text-primary-200 text-lg leading-relaxed max-w-md">
             سجل الآن واستفد من خدمات التعقيب الحكومية بكل سهولة وموثوقية. لوحة تحكم متكاملة لمتابعة طلباتك أولاً بأول.
           </p>
        </div>

        <div className="relative z-10 mt-12">
          <div className="flex items-center gap-4 text-sm text-primary-200">
            <div className="flex -space-x-2 space-x-reverse">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-primary-900"></div>
               ))}
            </div>
            <p>انضم لأكثر من 1000 عميل يثقون بنا</p>
          </div>
        </div>
      </div>

      {/* Left Side - Form */}
      <div className="md:w-1/2 p-8 md:p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">إنشاء حساب جديد</h2>
            <p className="text-slate-500">أدخل بياناتك للدخول المباشر</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 text-center border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <UserIcon className="absolute top-3.5 right-4 text-slate-400" size={20} />
              <input
                type="text"
                name="name"
                placeholder="الاسم الكامل"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                onChange={handleChange}
              />
            </div>

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
              <Phone className="absolute top-3.5 right-4 text-slate-400" size={20} />
              <input
                type="tel"
                name="phone"
                placeholder="رقم الجوال"
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
                minLength={6}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <Lock className="absolute top-3.5 right-4 text-slate-400" size={20} />
              <input
                type="password"
                name="confirmPassword"
                placeholder="تأكيد كلمة المرور"
                required
                minLength={6}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-800 transition shadow-lg shadow-primary-900/20 flex items-center justify-center gap-2"
            >
              {loading ? 'جاري إنشاء الحساب...' : 'تسجيل ودخول'}
              {!loading && <ArrowRight size={20} className="rtl:rotate-180" />}
            </button>
          </form>

          <p className="text-center mt-8 text-slate-500">
            لديك حساب بالفعل؟{' '}
            <Link to="/login" className="text-gold-600 font-bold hover:underline">
              سجل الدخول هنا
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
