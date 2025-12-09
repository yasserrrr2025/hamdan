
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Service, User } from '../types';
import { dataService } from '../services/dataService';
import { ArrowRight, Upload, CheckCircle, FileText, X, AlertCircle } from 'lucide-react';

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
  
  // State to track files for each requirement
  const [files, setFiles] = useState<Record<string, File | null>>({});

  useEffect(() => {
    if (serviceId) {
      dataService.getAllServices().then(services => {
        const found = services.find(s => s.id === serviceId);
        if (found) {
          setService(found);
          // Initialize file state for each requirement
          const initialFiles: Record<string, File | null> = {};
          found.requirements.forEach(req => {
            initialFiles[req] = null;
          });
          setFiles(initialFiles);
        }
      });
    }
  }, [serviceId]);

  const handleFileChange = (reqName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({
        ...prev,
        [reqName]: e.target.files![0]
      }));
    }
  };

  const removeFile = (reqName: string) => {
    setFiles(prev => ({
      ...prev,
      [reqName]: null
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;

    setSubmitting(true);
    
    // In a real app with Supabase Storage enabled, you would:
    // 1. Upload each file using supabase.storage.from('attachments').upload(...)
    // 2. Get the public URL for each file
    // 3. Create the 'attachments' object mapping requirement names to URLs
    
    // For this implementation (simulated without active storage bucket), 
    // we will store the file names to represent the data.
    
    const attachmentsData: Record<string, string> = {};
    Object.entries(files).forEach(([key, file]) => {
      if (file) {
        // Here we just use the name, but in production this would be the Storage URL
        attachmentsData[key] = file.name; 
      }
    });
    
    await dataService.createRequest(user.id, user.name, service, notes, attachmentsData);
    setSubmitting(false);
    setSuccess(true);
    
    // Redirect after delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 2500);
  };

  if (!service) return <div className="p-10 text-center flex flex-col items-center"><div className="w-10 h-10 border-4 border-primary-900 border-t-gold-500 rounded-full animate-spin mb-4"></div>جاري تجهيز النموذج...</div>;

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 animate-bounce">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">تم استلام طلبك بنجاح!</h2>
          <p className="text-slate-500 mb-6">رقم الطلب محفوظ في لوحة التحكم. سيقوم فريقنا بمراجعة المرفقات والبدء في الإجراءات.</p>
          <p className="text-sm text-slate-400 bg-slate-100 py-2 rounded-lg">جاري التحويل للوحة التحكم...</p>
        </div>
      </div>
    );
  }

  const hasRequirements = service.requirements && service.requirements.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-secondary-900 mb-6 transition font-medium">
          <ArrowRight size={18} className="ml-2" />
          العودة للخدمات
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
          {/* Header */}
          <div className="bg-primary-900 px-8 py-8 text-white relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(#d4af37 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="relative z-10">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">تقديم طلب جديد</h2>
                        <p className="text-primary-200 text-lg">{service.title}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                        <span className="block text-xs text-primary-200">رسوم الخدمة</span>
                        <span className="text-xl font-bold text-gold-400">{service.price} ر.س</span>
                    </div>
                </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            
            {/* User Info Summary (Read Only) */}
            <div className="mb-8 flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                    <span className="font-bold">{user.name.charAt(0)}</span>
                </div>
                <div>
                    <p className="text-xs text-slate-500">مقدم الطلب</p>
                    <p className="text-sm font-bold text-slate-800">{user.name}</p>
                </div>
                <div className="mr-auto">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">حساب موثق</span>
                </div>
            </div>

            {/* Dynamic Requirements Section */}
            <div className="mb-8">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-gold-500" />
                المستندات المطلوبة
              </h3>
              
              {hasRequirements ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 flex items-start gap-3">
                     <AlertCircle className="text-blue-500 shrink-0 mt-0.5" size={18} />
                     <p className="text-sm text-blue-800">
                       يرجى إرفاق الملفات المطلوبة أدناه بصيغة PDF أو صور واضحة. هذه الحقول اختيارية ويمكنك إرسال الطلب بدونها وسيتم التواصل معك إذا لزم الأمر.
                     </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.requirements.map((req, idx) => (
                        <div key={idx} className="border border-slate-200 rounded-xl p-4 hover:border-primary-200 transition bg-white">
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-sm font-bold text-slate-700">{req}</label>
                                <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">اختياري</span>
                            </div>
                            
                            {!files[req] ? (
                                <div className="relative">
                                    <input 
                                        type="file" 
                                        id={`file-${idx}`}
                                        className="hidden" 
                                        onChange={(e) => handleFileChange(req, e)}
                                    />
                                    <label 
                                        htmlFor={`file-${idx}`}
                                        className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 text-sm cursor-pointer hover:bg-slate-50 hover:border-primary-300 hover:text-primary-600 transition"
                                    >
                                        <Upload size={16} />
                                        <span>رفع الملف</span>
                                    </label>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <div className="bg-green-100 p-1.5 rounded text-green-600">
                                            <FileText size={16} />
                                        </div>
                                        <span className="text-sm text-green-800 truncate max-w-[120px]">{files[req]?.name}</span>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => removeFile(req)}
                                        className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded transition"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-100 rounded-lg p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle size={24} />
                    </div>
                    <p className="text-green-800 font-bold mb-1">لا توجد مستندات مطلوبة!</p>
                    <p className="text-sm text-green-600">يمكنك إرسال الطلب مباشرة وسنقوم بالتواصل معك.</p>
                </div>
              )}
            </div>

            {/* Notes Section */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-700 mb-2">ملاحظات إضافية (اختياري)</label>
              <textarea 
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition text-sm"
                placeholder="هل لديك أي تعليمات خاصة أو تفاصيل تود إضافتها؟"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-slate-100">
              <button 
                type="submit" 
                disabled={submitting}
                className={`w-full md:w-auto bg-primary-900 hover:bg-primary-800 text-white px-10 py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2 shadow-lg shadow-primary-900/20 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {submitting ? 'جاري الإرسال...' : 'تأكيد وإرسال الطلب'}
                {!submitting && <ArrowRight size={20} className="rtl:rotate-180" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestForm;
