
import { Agency, Service, Request, Message, RequestStatus, User, UserRole } from '../types';
import { supabase } from './supabaseClient';
import { AGENCIES, SERVICES, INITIAL_REQUESTS, INITIAL_MESSAGES } from './mockData';

export const dataService = {
  // --- Authentication ---
  signUp: async (email: string, password: string, name: string, phone: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone, role: UserRole.CLIENT }
      }
    });
    
    if (error) throw error;
    
    // Create profile entry
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: data.user.id,
          name,
          phone,
          role: UserRole.CLIENT,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1e3a8a&color=fff`
        }
      ]);
      if (profileError) console.error('Error creating profile:', profileError);
    }

    return data;
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    
    // Fetch profile data
    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      return { user: data.user, profile };
    }
    return { user: null, profile: null };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // --- Agencies ---
  getAgencies: async (): Promise<Agency[]> => {
    try {
      const { data, error } = await supabase.from('agencies').select('*');
      if (error) throw error;
      if (!data || data.length === 0) return AGENCIES;
      return data;
    } catch (e: any) {
      console.warn("Using mock agencies due to DB error or empty table:", e.message || e);
      return AGENCIES;
    }
  },

  addAgency: async (agency: Omit<Agency, 'id'>) => {
    const { data, error } = await supabase.from('agencies').insert([agency]).select().single();
    if (error) throw error;
    return data;
  },

  deleteAgency: async (id: string) => {
    const { error } = await supabase.from('agencies').delete().eq('id', id);
    if (error) throw error;
  },

  // --- Services ---
  getServicesByAgency: async (agencyId: string): Promise<Service[]> => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('agency_id', agencyId);
      
      if (error) throw error;
      if (!data) return [];
      return data;
    } catch (e: any) {
      console.warn("Using mock services for agency due to DB error:", e.message || e);
      return SERVICES.filter(s => s.agency_id === agencyId);
    }
  },

  getAllServices: async (): Promise<Service[]> => {
    try {
      const { data, error } = await supabase.from('services').select('*');
      if (error) throw error;
      if (!data || data.length === 0) return SERVICES;
      return data;
    } catch (e: any) {
      console.warn("Using mock services due to DB error:", e.message || e);
      return SERVICES;
    }
  },

  addService: async (service: Omit<Service, 'id'>) => {
    const { data, error } = await supabase.from('services').insert([service]).select().single();
    if (error) throw error;
    return data;
  },

  deleteService: async (id: string) => {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) throw error;
  },

  // --- Requests ---
  getUserRequests: async (userId: string): Promise<Request[]> => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*, service:services(title), profile:profiles(name)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // If no data found for this user in DB, and it's the mock user, return mock requests
      if ((!data || data.length === 0) && userId === 'u1') {
         return INITIAL_REQUESTS.filter(r => r.user_id === userId);
      }
      
      return (data || []).map((item: any) => ({
        ...item,
        service_title: item.service?.title,
        user_name: item.profile?.name
      }));
    } catch (e: any) {
      console.warn('Error fetching user requests, using mock data:', e.message || e);
      return INITIAL_REQUESTS.filter(r => r.user_id === userId);
    }
  },

  getAllRequests: async (): Promise<Request[]> => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*, service:services(title), profile:profiles(name)')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) return INITIAL_REQUESTS;

      return (data || []).map((item: any) => ({
        ...item,
        service_title: item.service?.title,
        user_name: item.profile?.name
      }));
    } catch (e: any) {
      console.warn('Error fetching all requests, using mock data:', e.message || e);
      return INITIAL_REQUESTS;
    }
  },

  createRequest: async (userId: string, userName: string, service: Service, notes: string): Promise<Request> => {
    const trackingNumber = `REQ-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`;
    
    try {
      const { data, error } = await supabase
        .from('requests')
        .insert([
          {
            user_id: userId,
            service_id: service.id,
            status: RequestStatus.PENDING,
            notes: notes,
            tracking_number: trackingNumber,
            updated_at: new Date().toISOString()
          }
        ])
        .select('*, service:services(title)')
        .single();

      if (error) throw error;

      return {
        ...data,
        service_title: data.service?.title,
        user_name: userName
      };
    } catch (e: any) {
      console.error("Error creating request in DB, simulating success:", e.message || e);
      // Simulate success for demo
      return {
        id: `req_${Date.now()}`,
        tracking_number: trackingNumber,
        user_id: userId,
        user_name: userName,
        service_id: service.id,
        service_title: service.title,
        status: RequestStatus.PENDING,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        notes: notes
      };
    }
  },

  updateRequestStatus: async (requestId: string, status: RequestStatus): Promise<void> => {
    try {
      const { error } = await supabase
        .from('requests')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', requestId);
      
      if (error) throw error;
    } catch (e: any) {
      console.warn("Error updating request in DB:", e.message || e);
      // Ignore error for demo
    }
  },

  // --- Messages ---
  getMessages: async (requestId: string): Promise<Message[]> => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*, profile:profiles(name)')
        .eq('request_id', requestId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      if (!data || data.length === 0) {
         // Fallback to mock messages for mock requests
         return INITIAL_MESSAGES.filter(m => m.request_id === requestId);
      }

      return (data || []).map((item: any) => ({
        ...item,
        sender_name: item.profile?.name
      }));
    } catch (e: any) {
      console.warn('Error fetching messages, using mock data:', e.message || e);
      return INITIAL_MESSAGES.filter(m => m.request_id === requestId);
    }
  },

  sendMessage: async (requestId: string, senderId: string, senderName: string, content: string, isAdmin: boolean): Promise<Message> => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            request_id: requestId,
            sender_id: senderId,
            content,
            is_admin: isAdmin
          }
        ])
        .select('*, profile:profiles(name)')
        .single();

      if (error) throw error;

      return {
        ...data,
        sender_name: senderName
      };
    } catch (e: any) {
      console.error("Error sending message in DB, simulating success:", e.message || e);
      return {
        id: `msg_${Date.now()}`,
        request_id: requestId,
        sender_id: senderId,
        sender_name: senderName,
        content,
        created_at: new Date().toISOString(),
        is_admin: isAdmin
      };
    }
  },

  // --- Stats ---
  getStats: async () => {
    try {
      const { data: requests, error } = await supabase
        .from('requests')
        .select('status, service:services(price)');
        
      if (error) throw error;
      
      if (!requests) return { totalRequests: 0, pendingRequests: 0, completedRequests: 0, revenue: 0 };

      return {
        totalRequests: requests.length,
        pendingRequests: requests.filter((r: any) => r.status === RequestStatus.PENDING).length,
        completedRequests: requests.filter((r: any) => r.status === RequestStatus.COMPLETED).length,
        revenue: requests
          .filter((r: any) => r.status === RequestStatus.COMPLETED)
          .reduce((sum: number, r: any) => sum + (Number(r.service?.price) || 0), 0)
      };
    } catch (e: any) {
      console.warn('Error fetching stats, using mock data calculation:', e.message || e);
      // Calculate from mock data
      const requests = INITIAL_REQUESTS;
      const requestsWithPrice = requests.map(r => {
         const s = SERVICES.find(srv => srv.id === r.service_id);
         return { ...r, price: s ? s.price : 0 };
      });
      
      return {
        totalRequests: requests.length,
        pendingRequests: requests.filter(r => r.status === RequestStatus.PENDING).length,
        completedRequests: requests.filter(r => r.status === RequestStatus.COMPLETED).length,
        revenue: requestsWithPrice
          .filter(r => r.status === RequestStatus.COMPLETED)
          .reduce((sum, r) => sum + r.price, 0)
      };
    }
  }
};
