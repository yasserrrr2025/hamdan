import React, { useState, useEffect } from 'react';
import { User, Request, Message } from '../types';
import { dataService } from '../services/dataService';
import { STATUS_COLORS } from '../constants';
import { MessageSquare, Clock, Hash, FileText, Send, User as UserIcon } from 'lucide-react';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      const data = await dataService.getUserRequests(user.id);
      setRequests(data);
      setLoading(false);
      // Select first request by default on desktop
      if (data.length > 0 && window.innerWidth >= 768) {
        handleSelectRequest(data[0]);
      }
    };
    fetchRequests();
  }, [user.id]);

  const handleSelectRequest = async (req: Request) => {
    setSelectedRequest(req);
    const msgs = await dataService.getMessages(req.id);
    setMessages(msgs);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRequest) return;

    const msg = await dataService.sendMessage(selectedRequest.id, user.id, user.name, newMessage, false);
    setMessages([...messages, msg]);
    setNewMessage('');
  };

  if (loading) return <div className="p-10 text-center">جاري تحميل الطلبات...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-64px)]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {/* Requests List */}
        <div className={`bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full ${selectedRequest ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-slate-100">
            <h2 className="font-bold text-lg text-slate-800">طلباتي</h2>
            <p className="text-xs text-slate-500">تابع حالة طلباتك وتواصل مع الإدارة</p>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {requests.length === 0 ? (
              <div className="text-center py-10 text-slate-400">لا توجد طلبات حالياً</div>
            ) : (
              requests.map(req => (
                <div 
                  key={req.id}
                  onClick={() => handleSelectRequest(req)}
                  className={`p-4 rounded-lg cursor-pointer transition border ${selectedRequest?.id === req.id ? 'bg-primary-50 border-primary-200 ring-1 ring-primary-300' : 'bg-white border-slate-100 hover:bg-slate-50'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded">{req.tracking_number}</span>
                    <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_COLORS[req.status] || 'bg-gray-100'}`}>
                      {req.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm mb-1">{req.service_title}</h3>
                  <div className="flex items-center text-xs text-slate-400 gap-2">
                    <Clock size={12} />
                    <span>{new Date(req.updated_at).toLocaleDateString('ar-SA')}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Request Details & Chat */}
        <div className={`md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full ${!selectedRequest ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
          {!selectedRequest ? (
            <div className="text-center text-slate-400">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p>اختر طلباً لعرض التفاصيل والمحادثة</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <button onClick={() => setSelectedRequest(null)} className="md:hidden text-slate-500"><ArrowRight/></button>
                    <h2 className="text-xl font-bold text-secondary-900">{selectedRequest.service_title}</h2>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><Hash size={14}/> {selectedRequest.tracking_number}</span>
                    <span className="flex items-center gap-1"><Clock size={14}/> {new Date(selectedRequest.created_at).toLocaleDateString('ar-SA')}</span>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-lg font-bold text-sm border ${STATUS_COLORS[selectedRequest.status]}`}>
                  {selectedRequest.status}
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                <div className="space-y-4">
                  {/* System/Welcome Message */}
                  <div className="flex justify-center">
                    <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                      بداية المحادثة - {new Date(selectedRequest.created_at).toLocaleDateString('ar-SA')}
                    </span>
                  </div>

                  {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.is_admin ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                        msg.is_admin 
                          ? 'bg-white text-slate-700 rounded-tr-none border border-slate-200' 
                          : 'bg-primary-600 text-white rounded-tl-none'
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <div className={`text-[10px] mt-1 flex items-center gap-1 ${msg.is_admin ? 'text-slate-400' : 'text-primary-100'}`}>
                          {msg.is_admin && <UserIcon size={10} />}
                          <span>{new Date(msg.created_at).toLocaleTimeString('ar-SA', {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-slate-100 bg-white rounded-b-xl">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="اكتب رسالتك هنا..."
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                  />
                  <button 
                    type="submit" 
                    disabled={!newMessage.trim()}
                    className="bg-secondary-900 hover:bg-secondary-800 text-white p-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={20} className="rtl:rotate-180" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper for icon
function ArrowRight() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
}

export default Dashboard;