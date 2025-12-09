
export enum UserRole {
  CLIENT = 'client',
  ADMIN = 'admin',
  EMPLOYEE = 'employee'
}

export enum RequestStatus {
  PENDING = 'بانتظار المراجعة',
  PROCESSING = 'قيد التنفيذ',
  COMPLETED = 'مكتمل',
  REJECTED = 'مرفوض',
  ACTION_REQUIRED = 'بانتظار العميل'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
}

export interface Agency {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  color: string;
}

export interface Service {
  id: string;
  agency_id: string;
  title: string;
  description: string;
  price: number;
  requirements: string[];
}

export interface Request {
  id: string;
  tracking_number: string;
  user_id: string;
  user_name?: string; // For display convenience
  service_id: string;
  service_title?: string; // For display convenience
  status: RequestStatus;
  created_at: string;
  updated_at: string;
  assigned_employee_id?: string;
  notes?: string;
  attachments?: Record<string, string>; // Requirement Name -> File URL/Name
}

export interface Message {
  id: string;
  request_id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  created_at: string;
  is_admin: boolean;
}

export interface Stats {
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  revenue: number;
}
