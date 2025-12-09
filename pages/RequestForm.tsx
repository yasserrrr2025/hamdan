import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Service, User } from '../types';
import { dataService } from '../services/dataService';
import { ArrowRight, Upload, CheckCircle } from 'lucide-react';

interface RequestFormProps {
  user: User;
}

const RequestForm: React.FC<RequestFormProps> = ({ user }) => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (serviceId) {
      dataService.getAllServices().then(services => {
        const found = services.find(s => s.id === serviceId);
        if (found) setService(found);
      });
    }
  }, [serviceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;

    setSubmitting(true);
    await dataService.createRequest(user.id, user.name, service, notes);
    setSubmitting(false);
    setSuccess(true);
    
    // Redirect after delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  if (!service) return <div className="p-10 text-center">جاري التحميل...</div>;

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">تم استلام طلبك بنجاح!</h2>
          <p className="text-slate-500 mb-6">سيتم مراجعة الطلب والتواصل معك قريباً. يمكنك متابعة الحالة من لوحة التحكم.</p>
          <p className="text-sm text-slate-400">جاري التحويل للوحة التحكم...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-secondary-900 mb-6 transition">
          <ArrowRight size={18} className="ml-2" />
          العودة للخدمات
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-secondary-900 px-8 py-6 text-white">
            <h2 className="text-2xl font-bold">تقديم طلب جديد</h2>
            <p className="opacity-80 mt-1">{service.title}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="mb-8 bg-blue-50 border border-blue-100 rounded-lg p-4">
              <h3 className="font-bold text-blue-900 mb-2">متطلبات الخدمة:</h3>
              <ul className="list-disc list-inside text-blue-800 space-y-1 text-sm">
                {service.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-blue-200 flex justify-between items-center text-blue-900 font-bold">
                <span>رسوم الخدمة</span>
                <span>{service.price} ر.س</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">الاسم الكامل</label>
                <input type="text" value={user.name} disabled className="w-full bg-slate-100 border border-slate-300 rounded-lg px-4 py-2 text-slate-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">رقم الجوال</label>
                <input type="text" value={user.phone} disabled className="w-full bg-slate-100 border border-slate-300 rounded-lg px-4 py-2 text-slate-500" />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">ملاحظات إضافية</label>
              <textarea 
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                placeholder="اكتب أي تفاصيل إضافية تود إخبارنا بها..."
              ></textarea>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-700 mb-2">المرفقات (اختياري)</label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 transition cursor-pointer">
                <Upload className="mx-auto h-10 w-10 text-slate-400 mb-2" />
                <p className="text-sm text-slate-500">اسحب الملفات هنا أو اضغط للرفع</p>
                <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG (Max 5MB)</p>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={submitting}
                className={`bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-bold transition flex items-center shadow-lg shadow-primary-500/30 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {submitting ? 'جاري الإرسال...' : 'تأكيد الطلب'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestForm;