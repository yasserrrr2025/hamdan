import React, { useEffect, useState } from 'react';
import { Agency, Service } from '../types';
import { dataService } from '../services/dataService';
import { ICONS } from '../constants';
import { ChevronLeft, CheckCircle2, Search } from 'lucide-react';
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
    return <div className="min-h-screen flex items-center justify-center text-primary-600">جاري التحميل...</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative bg-secondary-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">خدمات التعقيب والإنجاز الحكومي</h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-10">
            نوفر عليك عناء المراجعات. منصة متكاملة لإنجاز معاملاتك الحكومية بدقة، سرعة، وموثوقية عالية.
          </p>
          <div className="flex justify-center gap-4">
            <a href="#services" className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-lg font-bold text-lg transition shadow-lg shadow-primary-900/50">
              تصفح الخدمات
            </a>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-bold text-lg transition border border-white/20">
              تواصل معنا
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-primary-500">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-4">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-slate-800">سرعة في الإنجاز</h3>
            <p className="text-slate-600">فريق متخصص يتابع معاملاتك لحظة بلحظة لضمان أسرع النتائج.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-primary-500">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-4">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-slate-800">أسعار تنافسية</h3>
            <p className="text-slate-600">رسوم خدمات مدروسة وواضحة بدون أي تكاليف خفية.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-primary-500">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-4">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-slate-800">دعم فني متواصل</h3>
            <p className="text-slate-600">لوحة تحكم وتنبيهات فورية لتبقى على اطلاع دائم بحالة طلبك.</p>
          </div>
        </div>
      </div>

      {/* Agencies Section */}
      <div id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">الجهات الحكومية والخدمات</h2>
        
        <div className="flex flex-wrap gap-4 justify-center mb-10">
          <button 
            onClick={() => setSelectedAgency(null)}
            className={`px-6 py-2 rounded-full font-medium transition ${!selectedAgency ? 'bg-secondary-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border'}`}
          >
            الكل
          </button>
          {agencies.map(agency => (
            <button
              key={agency.id}
              onClick={() => setSelectedAgency(agency.id)}
              className={`px-6 py-2 rounded-full font-medium transition flex items-center gap-2 ${selectedAgency === agency.id ? 'bg-secondary-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border'}`}
            >
              {agency.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => {
            const agency = agencies.find(a => a.id === service.agency_id);
            const Icon = agency && ICONS[agency.icon] ? ICONS[agency.icon] : ICONS['FileText'];
            
            return (
              <div key={service.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden border border-slate-100 group">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-lg ${agency?.color || 'bg-slate-500'} bg-opacity-10 flex items-center justify-center text-${agency?.color?.replace('bg-', '') || 'slate-600'}`}>
                      <Icon size={24} className={agency?.color?.replace('bg-', 'text-') || 'text-slate-600'} />
                    </div>
                    <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
                      {service.price} ر.س
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-primary-600 transition">{service.title}</h3>
                  <p className="text-slate-500 text-sm mb-4 h-10 overflow-hidden">{service.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {service.requirements.slice(0, 2).map((req, idx) => (
                      <span key={idx} className="text-xs bg-slate-50 text-slate-500 px-2 py-1 rounded border border-slate-100">{req}</span>
                    ))}
                    {service.requirements.length > 2 && <span className="text-xs text-slate-400 py-1">+ المزيد</span>}
                  </div>
                  <button 
                    onClick={() => handleRequestService(service.id)}
                    className="w-full bg-secondary-900 hover:bg-primary-600 text-white py-3 rounded-lg font-medium transition flex items-center justify-center gap-2"
                  >
                    طلب الخدمة
                    <ChevronLeft size={16} />
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