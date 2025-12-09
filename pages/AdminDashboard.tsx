
import React, { useState, useEffect } from 'react';
import { Request, Stats, RequestStatus, User, Agency, Service } from '../types';
import { dataService } from '../services/dataService';
import { STATUS_COLORS } from '../constants';
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
  Settings
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
    }
  };

  const handleDeleteService = async (id: string) => {
    if(window.confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
      await dataService.deleteService(id);
      setServices(services.filter(s => s.id !== id));
    }
  };

  // Mock adding - in real app would open modal
  const handleAddAgency = async () => {
    const name = prompt('اسم الجهة الحكومية:');
    if (name) {
      const newAgency = await dataService.addAgency({
        name,
        description: 'وصف جديد',
        icon: 'Building2',
        color: 'bg-slate-500'
      });
      setAgencies([...agencies, newAgency]);
    }
  };

  const handleAddService = async () => {
     // This is a simplified interaction. A real app needs a proper Modal.
     const title = prompt('اسم الخدمة:');
     if(title && agencies.length > 0) {
       const newService = await dataService.addService({
         agency_id: agencies[0].id, // Defaulting to first for demo
         title,
         description: 'وصف الخدمة',
         price: 100,
         requirements: ['هوية']
       });
       setServices([...services, newService]);
     }
  };

  if (loading) return <div className="p-10 text-center flex flex-col items-center"><div className="w-10 h-10 border-4 border-primary-900 border-t-gold-500 rounded-full animate-spin mb-4"></div>جاري تحميل البيانات...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
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
              <button onClick={handleAddAgency} className="bg-primary-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary-800">
                <Plus size={18} /> إضافة جهة
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agencies.map(agency => (
                <div key={agency.id} className="border border-slate-200 rounded-xl p-4 flex items-start justify-between group hover:border-gold-300 hover:shadow-md transition">
                   <div className="flex gap-3">
                     <div className={`w-10 h-10 rounded-lg ${agency.color} bg-opacity-10 text-primary-900 flex items-center justify-center`}>
                       <Building2 size={20} />
                     </div>
                     <div>
                       <h3 className="font-bold text-slate-800">{agency.name}</h3>
                       <p className="text-xs text-slate-500 line-clamp-2">{agency.description}</p>
                     </div>
                   </div>
                   <button onClick={() => handleDeleteAgency(agency.id)} className="text-slate-300 hover:text-red-500 transition"><Trash2 size={18} /></button>
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
              <button onClick={handleAddService} className="bg-primary-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary-800">
                <Plus size={18} /> إضافة خدمة
              </button>
            </div>
             <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-slate-50 text-slate-500 text-sm">
                  <tr>
                    <th className="px-6 py-4 font-medium">اسم الخدمة</th>
                    <th className="px-6 py-4 font-medium">الجهة</th>
                    <th className="px-6 py-4 font-medium">السعر</th>
                    <th className="px-6 py-4 font-medium">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {services.map((service) => (
                    <tr key={service.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-medium text-slate-800">{service.title}</td>
                      <td className="px-6 py-4 text-slate-600 text-sm">
                        {agencies.find(a => a.id === service.agency_id)?.name || 'غير محدد'}
                      </td>
                      <td className="px-6 py-4 font-bold text-gold-600">{service.price} ر.س</td>
                      <td className="px-6 py-4">
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
