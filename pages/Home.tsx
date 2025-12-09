import React, { useEffect, useState } from 'react';
import { Agency, Service } from '../types';
import { dataService } from '../services/dataService';
import { ICONS } from '../constants';
import { ChevronLeft, CheckCircle2, Shield, Clock, Award, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedAgency, setSelectedAgency] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const agenciesData = await dataService.getAgencies();
      const servicesData = await dataService.getAllServices();
      setAgencies(agenciesData);
      setServices(servicesData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredServices = selectedAgency 
    ? services.filter(s => s.agency_id === selectedAgency)
    : services;

  const handleRequestService = (serviceId: string) => {
    navigate(`/request/${serviceId}`);
  };

  if (loading) {
    return <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-16 h-16 border-4 border-primary-900 border-t-gold-500 rounded-full animate-spin mb-4"></div>
      <p className="text-primary-900 font-bold">جاري التحميل...</p>
    </div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative bg-primary-900 text-white min-h-[600px] flex items-center overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-800 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute top-1/2 -right-24 w-64 h-64 bg-gold-600 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-1/3 w-full h-1/2 bg-gradient-to-t from-primary-900 to-transparent"></div>
           {/* Pattern Overlay */}
           <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#d4af37 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-right z-10 pt-10 lg:pt-0">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-gold-500/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse"></span>
              <span className="text-gold-100 text-sm font-medium">الخيار الأول للخدمات الحكومية</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold mb-6 leading-tight">
              ننجز معاملاتك <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500">بسرعة واحترافية</span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 border-r-4 border-gold-500 pr-4">
              مكتب حمدان للخدمات العامة يقدم لك حلولاً متكاملة لتخليص جميع المعاملات الحكومية. دعنا نهتم بالتفاصيل المعقدة بينما تركز أنت على تنمية أعمالك.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#services" className="bg-gold-500 hover:bg-gold-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-gold-900/20 flex items-center justify-center gap-2 group">
                تصفح الخدمات
                <ArrowDown size={20} className="group-hover:translate-y-1 transition-transform" />
              </a>
              <button className="bg-transparent border-2 border-slate-500 hover:border-white text-white px-8 py-4 rounded-xl font-bold text-lg transition flex items-center justify-center">
                تواصل معنا
              </button>
            </div>
          </div>
          
          <div className="hidden lg:block relative z-10">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-gold-400 to-primary-600 rounded-2xl blur opacity-30"></div>
              <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 p-4 rounded-xl">
                       <Shield className="text-gold-400 mb-3" size={32} />
                       <h3 className="font-bold text-white mb-1">موثوقية عالية</h3>
                       <p className="text-xs text-slate-300">مرخصون رسمياً</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-xl">
                       <Clock className="text-gold-400 mb-3" size={32} />
                       <h3 className="font-bold text-white mb-1">سرعة الإنجاز</h3>
                       <p className="text-xs text-slate-300">متابعة فورية</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-xl col-span-2">
                       <div className="flex items-center gap-3">
                         <div className="bg-green-500/20 p-2 rounded-full text-green-400">
                           <CheckCircle2 size={24} />
                         </div>
                         <div>
                           <h3 className="font-bold text-white">نسبة قبول عالية</h3>
                           <p className="text-xs text-slate-300">خبراء في الإجراءات والأنظمة</p>
                         </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Bar */}
      <div className="bg-white shadow-md relative z-20 -mt-8 max-w-6xl mx-auto rounded-xl grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-100">
        <div className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-900">
            <Award size={24} />
          </div>
          <div>
            <h3 className="font-bold text-primary-900">خبرة سنوات</h3>
            <p className="text-sm text-slate-500">فريق محترف بخبرة تتجاوز 10 سنوات</p>
          </div>
        </div>
        <div className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-900">
            <Shield size={24} />
          </div>
          <div>
            <h3 className="font-bold text-primary-900">بيانات آمنة</h3>
            <p className="text-sm text-slate-500">حماية كاملة لبياناتك ومستنداتك</p>
          </div>
        </div>
        <div className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-900">
            <Clock size={24} />
          </div>
          <div>
            <h3 className="font-bold text-primary-900">دعم متواصل</h3>
            <p className="text-sm text-slate-500">متابعة حالة الطلب 24/7 عبر الموقع</p>
          </div>
        </div>
      </div>

      {/* Agencies & Services Section */}
      <div id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <span className="text-gold-600 font-bold tracking-wider text-sm uppercase">خدماتنا</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary-900 mt-2 mb-4">الجهات الحكومية والخدمات</h2>
          <div className="w-20 h-1 bg-gold-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <button 
            onClick={() => setSelectedAgency(null)}
            className={`px-6 py-2.5 rounded-lg font-bold transition-all duration-300 shadow-sm ${!selectedAgency ? 'bg-primary-900 text-white shadow-lg scale-105' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
          >
            جميع الخدمات
          </button>
          {agencies.map(agency => (
            <button
              key={agency.id}
              onClick={() => setSelectedAgency(agency.id)}
              className={`px-6 py-2.5 rounded-lg font-bold transition-all duration-300 shadow-sm flex items-center gap-2 ${selectedAgency === agency.id ? 'bg-primary-900 text-white shadow-lg scale-105' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
            >
              {agency.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map(service => {
            const agency = agencies.find(a => a.id === service.agency_id);
            const Icon = agency && ICONS[agency.icon] ? ICONS[agency.icon] : ICONS['FileText'];
            
            return (
              <div key={service.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-gold-200 flex flex-col h-full">
                <div className="h-2 w-full bg-gradient-to-r from-primary-900 to-primary-700 group-hover:from-gold-500 group-hover:to-gold-300 transition-colors"></div>
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-14 h-14 rounded-xl bg-slate-50 group-hover:bg-primary-50 transition-colors flex items-center justify-center text-primary-900`}>
                      <Icon size={28} />
                    </div>
                    <span className="bg-primary-50 text-primary-900 text-sm font-bold px-4 py-1.5 rounded-full border border-primary-100 group-hover:bg-gold-50 group-hover:text-gold-700 group-hover:border-gold-200 transition-colors">
                      {service.price} ر.س
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-primary-900 mb-3 group-hover:text-gold-600 transition-colors">{service.title}</h3>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed">{service.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    <p className="text-xs font-bold text-slate-400 uppercase">المتطلبات:</p>
                    <div className="flex flex-wrap gap-2">
                      {service.requirements.slice(0, 3).map((req, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-50 text-slate-500 px-2 py-1 rounded border border-slate-200">{req}</span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="p-6 pt-0 mt-auto">
                  <button 
                    onClick={() => handleRequestService(service.id)}
                    className="w-full bg-white text-primary-900 border-2 border-primary-900 hover:bg-primary-900 hover:text-white py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg"
                  >
                    تقديم الطلب
                    <ChevronLeft size={18} className="rtl:rotate-0" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;