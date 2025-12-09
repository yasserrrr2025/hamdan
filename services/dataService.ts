import { Agency, Service, Request, Message, User, RequestStatus } from '../types';
import { AGENCIES, SERVICES, INITIAL_REQUESTS, INITIAL_MESSAGES } from './mockData';

// Simulated latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory store for the session
let requests = [...INITIAL_REQUESTS];
let messages = [...INITIAL_MESSAGES];

export const dataService = {
  getAgencies: async (): Promise<Agency[]> => {
    await delay(500);
    return AGENCIES;
  },

  getServicesByAgency: async (agencyId: string): Promise<Service[]> => {
    await delay(300);
    return SERVICES.filter(s => s.agency_id === agencyId);
  },

  getAllServices: async (): Promise<Service[]> => {
    await delay(300);
    return SERVICES;
  },

  getUserRequests: async (userId: string): Promise<Request[]> => {
    await delay(500);
    return requests.filter(r => r.user_id === userId);
  },

  getAllRequests: async (): Promise<Request[]> => {
    await delay(500);
    return requests;
  },

  createRequest: async (userId: string, userName: string, service: Service, notes: string): Promise<Request> => {
    await delay(1000);
    const newRequest: Request = {
      id: `req${Date.now()}`,
      tracking_number: `REQ-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
      user_id: userId,
      user_name: userName,
      service_id: service.id,
      service_title: service.title,
      status: RequestStatus.PENDING,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      notes
    };
    requests = [newRequest, ...requests];
    return newRequest;
  },

  updateRequestStatus: async (requestId: string, status: RequestStatus): Promise<void> => {
    await delay(500);
    requests = requests.map(r => r.id === requestId ? { ...r, status, updated_at: new Date().toISOString() } : r);
  },

  getMessages: async (requestId: string): Promise<Message[]> => {
    await delay(300);
    return messages.filter(m => m.request_id === requestId).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  },

  sendMessage: async (requestId: string, senderId: string, senderName: string, content: string, isAdmin: boolean): Promise<Message> => {
    await delay(300);
    const newMessage: Message = {
      id: `m${Date.now()}`,
      request_id: requestId,
      sender_id: senderId,
      sender_name: senderName,
      content,
      created_at: new Date().toISOString(),
      is_admin: isAdmin
    };
    messages = [...messages, newMessage];
    return newMessage;
  },

  getStats: async () => {
    await delay(500);
    return {
      totalRequests: requests.length,
      pendingRequests: requests.filter(r => r.status === RequestStatus.PENDING).length,
      completedRequests: requests.filter(r => r.status === RequestStatus.COMPLETED).length,
      revenue: requests.filter(r => r.status === RequestStatus.COMPLETED)
        .reduce((sum, req) => {
          const service = SERVICES.find(s => s.id === req.service_id);
          return sum + (service?.price || 0);
        }, 0)
    };
  }
};