import React, { useState, useEffect } from 'react';
import { Request, Stats, RequestStatus, User } from '../types';
import { dataService } from '../services/dataService';
import { STATUS_COLORS } from '../constants';
import { 
  BarChart3, 
  Users, 
  FileCheck, 
  AlertCircle, 
  Search, 
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface AdminDashboardProps {
  user: User;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      const statsData = await dataService.getStats();
      const requestsData = await dataService.getAllRequests();
      setStats(statsData);
      setRequests(requestsData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleStatusChange = async (requestId: string, newStatus: RequestStatus) => {
    await dataService.updateRequestStatus(requestId, newStatus);
    // Optimistic update
    setRequests(requests.map(r => r.id === requestId ? {...r, status: newStatus} : r));
    // Refetch stats
    const newStats = await dataService.getStats();
    setStats(newStats);
  };

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(r => r.status === filter);

  if (loading) return <div className="p-10 text-center">جاري تحميل لوحة التحكم...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">لوحة تحكم الإدارة</h1>
        <p className="text-slate-500">نظرة عامة على أداء المكتب والطلبات الواردة</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="إجمالي الطلبات" 
          value={stats?.totalRequests || 0} 
          icon={BarChart3} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="طلبات الانتظار" 
          value={stats?.pendingRequests || 0} 
          icon={AlertCircle} 
          color="bg-orange-500" 
        />
        <StatCard 
          title="الطلبات المكتملة" 
          value={stats?.completedRequests || 0} 
          icon={FileCheck} 
          color="bg-green-500" 
        />
        <StatCard 
          title="إجمالي الإيرادات" 
          value={`${stats?.revenue.toLocaleString()} ر.س`} 
          icon={Users} 
          color="bg-indigo-500" 
        />
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-slate-800">أحدث الطلبات</h2>
            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">{filteredRequests.length}</span>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input 
                type="text" 
                placeholder="بحث برقم الطلب أو اسم العميل..." 
                className="w-full pl-4 pr-10 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Search size={16} className="absolute right-3 top-2.5 text-slate-400" />
            </div>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">كل الحالات</option>
              {Object.values(RequestStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 text-slate-500 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">رقم الطلب</th>
                <th className="px-6 py-4 font-medium">العميل</th>
                <th className="px-6 py-4 font-medium">الخدمة</th>
                <th className="px-6 py-4 font-medium">تاريخ الطلب</th>
                <th className="px-6 py-4 font-medium">الحالة</th>
                <th className="px-6 py-4 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-mono text-sm text-slate-600">{req.tracking_number}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{req.user_name}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{req.service_title}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{new Date(req.created_at).toLocaleDateString('ar-SA')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[req.status]}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                       <button 
                        onClick={() => handleStatusChange(req.id, RequestStatus.COMPLETED)}
                        title="اكتمال" 
                        className="p-1 hover:bg-green-100 text-green-600 rounded"
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button 
                         onClick={() => handleStatusChange(req.id, RequestStatus.PROCESSING)}
                         title="جاري التنفيذ"
                         className="p-1 hover:bg-blue-100 text-blue-600 rounded"
                      >
                        <Filter size={18} />
                      </button>
                       <button 
                        onClick={() => handleStatusChange(req.id, RequestStatus.REJECTED)}
                        title="رفض" 
                        className="p-1 hover:bg-red-100 text-red-600 rounded"
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

export default AdminDashboard;