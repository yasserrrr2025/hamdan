
import { Agency, Service, Request, Message, RequestStatus } from '../types';
import { supabase } from './supabaseClient';
import { AGENCIES, SERVICES } from './mockData';

export const dataService = {
  getAgencies: async (): Promise<Agency[]> => {
    try {
      const { data, error } = await supabase.from('agencies').select('*');
      if (error) throw error;
      if (!data || data.length === 0) return AGENCIES;
      return data;
    } catch (e) {
      console.warn("Using mock agencies due to DB error or empty table:", e);
      return AGENCIES;
    }
  },

  getServicesByAgency: async (agencyId: string): Promise<Service[]> => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('agency_id', agencyId);
    
    if (error || !data) return [];
    return data;
  },

  getAllServices: async (): Promise<Service[]> => {
    try {
      const { data, error } = await supabase.from('services').select('*');
      if (error) throw error;
      if (!data || data.length === 0) return SERVICES;
      return data;
    } catch (e) {
      console.warn("Using mock services due to DB error:", e);
      return SERVICES;
    }
  },

  getUserRequests: async (userId: string): Promise<Request[]> => {
    const { data, error } = await supabase
      .from('requests')
      .select('*, service:services(title), profile:profiles(name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user requests:', error);
      return [];
    }
    
    return (data || []).map((item: any) => ({
      ...item,
      service_title: item.service?.title,
      user_name: item.profile?.name
    }));
  },

  getAllRequests: async (): Promise<Request[]> => {
    const { data, error } = await supabase
      .from('requests')
      .select('*, service:services(title), profile:profiles(name)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all requests:', error);
      return [];
    }

    return (data || []).map((item: any) => ({
      ...item,
      service_title: item.service?.title,
      user_name: item.profile?.name
    }));
  },

  createRequest: async (userId: string, userName: string, service: Service, notes: string): Promise<Request> => {
    // Generate a simple tracking number for demo purposes
    const trackingNumber = `REQ-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`;
    
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
  },

  updateRequestStatus: async (requestId: string, status: RequestStatus): Promise<void> => {
    const { error } = await supabase
      .from('requests')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', requestId);
    
    if (error) throw error;
  },

  getMessages: async (requestId: string): Promise<Message[]> => {
    const { data, error } = await supabase
      .from('messages')
      .select('*, profile:profiles(name)')
      .eq('request_id', requestId)
      .order('created_at', { ascending: true });

    if (error) return [];

    return (data || []).map((item: any) => ({
      ...item,
      sender_name: item.profile?.name
    }));
  },

  sendMessage: async (requestId: string, senderId: string, senderName: string, content: string, isAdmin: boolean): Promise<Message> => {
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
  },

  getStats: async () => {
    const { data: requests, error } = await supabase
      .from('requests')
      .select('status, service:services(price)');
      
    if (error || !requests) return { totalRequests: 0, pendingRequests: 0, completedRequests: 0, revenue: 0 };

    return {
      totalRequests: requests.length,
      pendingRequests: requests.filter((r: any) => r.status === RequestStatus.PENDING).length,
      completedRequests: requests.filter((r: any) => r.status === RequestStatus.COMPLETED).length,
      revenue: requests
        .filter((r: any) => r.status === RequestStatus.COMPLETED)
        .reduce((sum: number, r: any) => sum + (Number(r.service?.price) || 0), 0)
    };
  }
};
