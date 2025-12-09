
import React, { useState, useEffect } from 'react';
import { Request, Stats, RequestStatus, User, Agency, Service } from '../types';
import { dataService } from '../services/dataService';
import { STATUS_COLORS, ICONS } from '../constants';
import { 
  BarChart3, 
  Users, 
  FileCheck, 
  AlertCircle, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  Briefcase,
  FileText,
  Plus,
  Trash2,
  Building2,
  Settings,
  X,
  Palette,
  Layers,
  Pencil
} from 'lucide-react';

interface AdminDashboardProps {
  user: User;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'agencies' | 'services'>('requests');
  const [loading, setLoading] = useState(true);

  // Data States
  const [stats, setStats] = useState<Stats | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  // Filter State
  const [filter, setFilter] = useState('all');

  // Modals State
  const [isAgencyModalOpen, setIsAgencyModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  
  // Edit Mode State
  const [editingAgencyId, setEditingAgencyId] = useState<string | null>(null);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  // Forms State
  const [agencyForm, setAgencyForm] = useState({ name: '', description: '', color: 'bg-primary-500', icon: 'Building2' });
  const [serviceForm, setServiceForm] = useState({ title: '', description: '', price: '', agency_id: '', requirements: [] as string[] });
  const [tempRequirement, setTempRequirement] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const statsData = await dataService.getStats();
    const requestsData = await dataService.getAllRequests();
    const agenciesData = await dataService.getAgencies();
    const servicesData = await dataService.getAllServices();
    
    setStats(statsData);
    setRequests(requestsData);
    setAgencies(agenciesData);
    setServices(servicesData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (requestId: string, newStatus: RequestStatus) => {
    await dataService.updateRequestStatus(requestId, newStatus);
    setRequests(requests.map(r => r.id === requestId ? {...r, status: newStatus} : r));
    const newStats = await dataService.getStats();
    setStats(newStats);
  };

  const handleDeleteAgency = async (id: string) => {
    if(window.confirm('هل أنت متأكد من حذف هذه الجهة؟ سيتم حذف جميع الخدمات المرتبطة بها.')) {
      await dataService.deleteAgency(id);
      setAgencies(agencies.filter(a => a.id !== id));
      setServices(services.filter(s => s.agency_id !== id));
    }
  };

  const handleDeleteService = async (id: string) => {
    if(window.confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
      await dataService.deleteService(id);
      setServices(services.filter(s => s.id !== id));
    }
  };

  // --- Agency Handlers ---
  const openAddAgencyModal = () => {
    setEditingAgencyId(null);
    setAgencyForm({ name: '', description: '', color: 'bg-primary-500', icon: 'Building2' });
    setIsAgencyModalOpen(true);
  };

  const openEditAgencyModal = (agency: Agency) => {
    setEditingAgencyId(agency.id);
    setAgencyForm({
      name: agency.name,
      description: agency.description,
      color: agency.color,
      icon: agency.icon
    });
    setIsAgencyModalOpen(true);
  };

  const handleSubmitAgency = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!agencyForm.name) return;
    
    if (editingAgencyId) {
      // Update
      const updated = await dataService.updateAgency(editingAgencyId, agencyForm);
      setAgencies(agencies.map(a => a.id === editingAgencyId ? updated : a));
    } else {
      // Create
      const added = await dataService.addAgency(agencyForm);
      setAgencies([...agencies, added]);
    }
    
    setIsAgencyModalOpen(false);
  };

  // --- Service Handlers ---
  const openAddServiceModal = () => {
    setEditingServiceId(null);
    setServiceForm({ title: '', description: '', price: '', agency_id: '', requirements: [] });
    setTempRequirement('');
    setIsServiceModalOpen(true);
  };

  const openEditServiceModal = (service: Service) => {
    setEditingServiceId(service.id);
    setServiceForm({
      title: service.title,
      description: service.description,
      price: service.price.toString(),
      agency_id: service.agency_id,
      requirements: [...service.requirements]
    });
    setTempRequirement('');
    setIsServiceModalOpen(true);
  };

  const handleAddRequirement = () => {
    if (tempRequirement.trim()) {
      setServiceForm({ ...serviceForm, requirements: [...serviceForm.requirements, tempRequirement.trim()] });
      setTempRequirement('');
    }
  };

  const handleRemoveRequirement = (index: number) => {
    const updated = [...serviceForm.requirements];
    updated.splice(index, 1);
    setServiceForm({ ...serviceForm, requirements: updated });
  };

  const handleSubmitService = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!serviceForm.title || !serviceForm.agency_id || !serviceForm.price) return;

    const serviceData = {
      title: serviceForm.title,
      description: serviceForm.description,
      agency_id: serviceForm.agency_id,
      price: Number(serviceForm.price),
      requirements: serviceForm.requirements
    };

    if (editingServiceId) {
      // Update
      const updated = await dataService.updateService(editingServiceId, serviceData);
      setServices(services.map(s => s.id === editingServiceId ? updated : s));
    } else {
      // Create
      const added = await dataService.addService(serviceData);
      setServices([...services, added]);
    }
    
    setIsServiceModalOpen(false);
  };

  if (loading) return <div className="p-10 text-center flex flex-col items-center"><div className="w-10 h-10 border-4 border-primary-900 border-t-gold-500 rounded-full animate-spin mb-4"></div>جاري تحميل البيانات...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      
      {/* Header & Stats */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary-900">لوحة تحكم الإدارة</h1>
            <p className="text-slate-500 mt-1">مرحباً {user.name}، إليك نظرة عامة على النظام</p>
          </div>
          <div className="text-sm text-slate-400 bg-white px-4 py-2 rounded-lg border border-slate-200">
             {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="إجمالي الطلبات" value={stats?.totalRequests || 0} icon={BarChart3} color="bg-blue-500" />
          <StatCard title="طلبات الانتظار" value={stats?.pendingRequests || 0} icon={AlertCircle} color="bg-orange-500" />
          <StatCard title="الطلبات المكتملة" value={stats?.completedRequests || 0} icon={FileCheck} color="bg-green-500" />
          <StatCard title="إجمالي الإيرادات" value={`${stats?.revenue.toLocaleString()} ر.س`} icon={Users} color="bg-indigo-500" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 space-x-reverse border-b border-slate-200 mb-6 overflow-x-auto">
        <TabButton 
          active={activeTab === 'requests'} 
          onClick={() => setActiveTab('requests')} 
          icon={FileText} 
          label="إدارة الطلبات" 
        />
        <TabButton 
          active={activeTab === 'services'} 
          onClick={() => setActiveTab('services')} 
          icon={Briefcase} 
          label="الخدمات والأسعار" 
        />
        <TabButton 
          active={activeTab === 'agencies'} 
          onClick={() => setActiveTab('agencies')} 
          icon={Building2} 
          label="الجهات الحكومية" 
        />
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[500px]">
        
        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="p-6">
             <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <h2 className="font-bold text-lg text-slate-800">سجل الطلبات</h2>
              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <input type="text" placeholder="بحث..." className="w-full pl-4 pr-10 py-2 border border-slate-300 rounded-lg text-sm" />
                  <Search size={16} className="absolute right-3 top-2.5 text-slate-400" />
                </div>
                <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white">
                  <option value="all">كل الحالات</option>
                  {Object.values(RequestStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-slate-50 text-slate-500 text-sm">
                  <tr>
                    <th className="px-6 py-4 font-medium">رقم الطلب</th>
                    <th className="px-6 py-4 font-medium">العميل</th>
                    <th className="px-6 py-4 font-medium">الخدمة</th>
                    <th className="px-6 py-4 font-medium">الحالة</th>
                    <th className="px-6 py-4 font-medium">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.filter(r => filter === 'all' || r.status === filter).map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-mono text-sm text-slate-600">{req.tracking_number}</td>
                      <td className="px-6 py-4 font-medium text-slate-800">{req.user_name}</td>
                      <td className="px-6 py-4 text-slate-600 text-sm">{req.service_title}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[req.status]}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button onClick={() => handleStatusChange(req.id, RequestStatus.COMPLETED)} title="إكمال" className="p-1 hover:bg-green-100 text-green-600 rounded"><CheckCircle size={18} /></button>
                        <button onClick={() => handleStatusChange(req.id, RequestStatus.REJECTED)} title="رفض" className="p-1 hover:bg-red-100 text-red-600 rounded"><XCircle size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Agencies Tab */}
        {activeTab === 'agencies' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg text-slate-800">قائمة الجهات الحكومية</h2>
              <button onClick={openAddAgencyModal} className="bg-primary-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary-800 transition shadow-lg shadow-primary-900/10">
                <Plus size={18} /> إضافة جهة جديدة
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agencies.map(agency => (
                <div key={agency.id} className="border border-slate-200 rounded-xl p-4 flex items-start justify-between group hover:border-gold-300 hover:shadow-md transition bg-white">
                   <div className="flex gap-3">
                     <div className={`w-12 h-12 rounded-lg ${agency.color} text-white flex items-center justify-center shadow-sm`}>
                       {ICONS[agency.icon] ? React.createElement(ICONS[agency.icon], { size: 20 }) : <Building2 size={20} />}
                     </div>
                     <div>
                       <h3 className="font-bold text-slate-800">{agency.name}</h3>
                       <p className="text-xs text-slate-500 line-clamp-2">{agency.description}</p>
                       <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full mt-2 inline-block">
                         {services.filter(s => s.agency_id === agency.id).length} خدمات
                       </span>
                     </div>
                   </div>
                   <div className="flex flex-col gap-1">
                      <button onClick={() => openEditAgencyModal(agency)} className="text-slate-300 hover:text-blue-500 transition p-1"><Pencil size={16} /></button>
                      <button onClick={() => handleDeleteAgency(agency.id)} className="text-slate-300 hover:text-red-500 transition p-1"><Trash2 size={16} /></button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg text-slate-800">الخدمات المتاحة</h2>
              <button onClick={openAddServiceModal} className="bg-primary-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary-800 transition shadow-lg shadow-primary-900/10">
                <Plus size={18} /> إضافة خدمة جديدة
              </button>
            </div>
             <div className="overflow-x-auto">
              <table className="w-full text-right border-separate border-spacing-y-2">
                <thead className="text-slate-500 text-sm">
                  <tr>
                    <th className="px-4 py-2 font-medium">اسم الخدمة</th>
                    <th className="px-4 py-2 font-medium">الجهة التابعة</th>
                    <th className="px-4 py-2 font-medium">عدد المتطلبات</th>
                    <th className="px-4 py-2 font-medium">السعر</th>
                    <th className="px-4 py-2 font-medium">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="">
                  {services.map((service) => (
                    <tr key={service.id} className="bg-white hover:bg-slate-50 transition shadow-sm rounded-lg group">
                      <td className="px-4 py-4 font-bold text-slate-800 rounded-r-lg border-y border-r border-slate-100">{service.title}</td>
                      <td className="px-4 py-4 text-slate-600 text-sm border-y border-slate-100">
                        <span className="flex items-center gap-2">
                           <span className={`w-2 h-2 rounded-full ${agencies.find(a => a.id === service.agency_id)?.color || 'bg-gray-400'}`}></span>
                           {agencies.find(a => a.id === service.agency_id)?.name || 'غير محدد'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-600 text-sm border-y border-slate-100">
                        <span className="bg-slate-100 px-2 py-1 rounded text-xs">{service.requirements.length} مستندات</span>
                      </td>
                      <td className="px-4 py-4 font-bold text-gold-600 border-y border-slate-100">{service.price} ر.س</td>
                      <td className="px-4 py-4 rounded-l-lg border-y border-l border-slate-100 flex gap-2">
                         <button onClick={() => openEditServiceModal(service)} className="text-slate-400 hover:text-blue-600 transition"><Pencil size={18} /></button>
                         <button onClick={() => handleDeleteService(service.id)} className="text-slate-400 hover:text-red-600 transition"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* --- MODALS --- */}

      {/* Agency Modal (Add / Edit) */}
      {isAgencyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-primary-900 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Building2 size={20}/> 
                {editingAgencyId ? 'تعديل بيانات الجهة' : 'إضافة جهة حكومية'}
              </h3>
              <button onClick={() => setIsAgencyModalOpen(false)} className="text-white/70 hover:text-white transition"><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmitAgency} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">اسم الجهة</label>
                <input 
                  type="text" 
                  required
                  value={agencyForm.name}
                  onChange={e => setAgencyForm({...agencyForm, name: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="مثال: وزارة التجارة"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">وصف مختصر</label>
                <textarea 
                  value={agencyForm.description}
                  onChange={e => setAgencyForm({...agencyForm, description: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 outline-none"
                  rows={2}
                  placeholder="وصف خدمات الجهة..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">الأيقونة</label>
                   <select 
                      value={agencyForm.icon}
                      onChange={e => setAgencyForm({...agencyForm, icon: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white"
                   >
                     {Object.keys(ICONS).map(iconKey => (
                       <option key={iconKey} value={iconKey}>{iconKey}</option>
                     ))}
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">لون التمييز</label>
                   <div className="flex gap-2 mt-2">
                     {['bg-blue-500', 'bg-green-600', 'bg-indigo-500', 'bg-orange-500', 'bg-red-500', 'bg-teal-600'].map(c => (
                       <button
                         key={c}
                         type="button"
                         onClick={() => setAgencyForm({...agencyForm, color: c})}
                         className={`w-6 h-6 rounded-full ${c} ${agencyForm.color === c ? 'ring-2 ring-offset-2 ring-primary-900' : ''}`}
                       />
                     ))}
                   </div>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAgencyModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">إلغاء</button>
                <button type="submit" className="px-6 py-2 bg-primary-900 text-white rounded-lg font-bold hover:bg-primary-800 shadow-lg shadow-primary-900/20">
                  {editingAgencyId ? 'حفظ التعديلات' : 'حفظ الجهة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Service Modal (Add / Edit) */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="bg-primary-900 p-4 flex justify-between items-center text-white shrink-0">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Briefcase size={20}/> 
                {editingServiceId ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
              </h3>
              <button onClick={() => setIsServiceModalOpen(false)} className="text-white/70 hover:text-white transition"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmitService} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">اسم الخدمة</label>
                  <input 
                    type="text" 
                    required
                    value={serviceForm.title}
                    onChange={e => setServiceForm({...serviceForm, title: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="مثال: إصدار سجل تجاري"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">الجهة التابعة</label>
                  <select 
                    required
                    value={serviceForm.agency_id}
                    onChange={e => setServiceForm({...serviceForm, agency_id: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    <option value="">اختر الجهة...</option>
                    {agencies.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">سعر الخدمة (ر.س)</label>
                  <input 
                    type="number" 
                    required
                    value={serviceForm.price}
                    onChange={e => setServiceForm({...serviceForm, price: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="0.00"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">وصف الخدمة</label>
                  <textarea 
                    value={serviceForm.description}
                    onChange={e => setServiceForm({...serviceForm, description: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 outline-none"
                    rows={2}
                    placeholder="شرح مختصر للخدمة..."
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-2">
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <Layers size={16} className="text-gold-500"/> المتطلبات والمستندات
                </label>
                
                <div className="flex gap-2 mb-3">
                  <input 
                    type="text" 
                    value={tempRequirement}
                    onChange={e => setTempRequirement(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddRequirement())}
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gold-400 outline-none"
                    placeholder="أضف متطلب (مثال: صورة الهوية)"
                  />
                  <button 
                    type="button" 
                    onClick={handleAddRequirement}
                    className="bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition"
                  >
                    إضافة
                  </button>
                </div>

                {serviceForm.requirements.length > 0 ? (
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <ul className="space-y-2">
                      {serviceForm.requirements.map((req, idx) => (
                        <li key={idx} className="flex justify-between items-center bg-white p-2 rounded border border-slate-100 shadow-sm text-sm">
                          <span className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500"/> {req}</span>
                          <button type="button" onClick={() => handleRemoveRequirement(idx)} className="text-red-400 hover:text-red-600"><X size={16}/></button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-2">لا توجد متطلبات مضافة بعد</p>
                )}
              </div>
            </form>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 shrink-0">
                <button type="button" onClick={() => setIsServiceModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">إلغاء</button>
                <button type="button" onClick={handleSubmitService} className="px-6 py-2 bg-primary-900 text-white rounded-lg font-bold hover:bg-primary-800 shadow-lg shadow-primary-900/20">
                  {editingServiceId ? 'حفظ التعديلات' : 'حفظ الخدمة'}
                </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const StatCard: React.FC<{title: string, value: string | number, icon: React.ElementType, color: string}> = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
    <div>
      <p className="text-slate-500 text-sm mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
    </div>
    <div className={`w-12 h-12 rounded-full ${color} bg-opacity-10 flex items-center justify-center text-${color.replace('bg-', '')}`}>
      <Icon className={`text-${color.replace('bg-', '')}`} />
    </div>
  </div>
);

const TabButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ElementType, label: string }> = ({ active, onClick, icon: Icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all duration-300 whitespace-nowrap ${active ? 'border-gold-500 text-primary-900 font-bold bg-slate-50' : 'border-transparent text-slate-500 hover:text-primary-800 hover:bg-slate-50'}`}
  >
    <Icon size={18} className={active ? 'text-gold-500' : ''} />
    {label}
  </button>
);

export default AdminDashboard;
