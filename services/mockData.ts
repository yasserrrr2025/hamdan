import { Agency, Service, Request, User, UserRole, RequestStatus, Message } from '../types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'عبدالله محمد',
  email: 'client@example.com',
  phone: '0500000000',
  role: UserRole.CLIENT,
  avatar: 'https://picsum.photos/200'
};

export const ADMIN_USER: User = {
  id: 'a1',
  name: 'مدير النظام',
  email: 'admin@enjaz.com',
  phone: '0599999999',
  role: UserRole.ADMIN,
  avatar: 'https://picsum.photos/201'
};

export const AGENCIES: Agency[] = [
  {
    id: 'ag1',
    name: 'وزارة الموارد البشرية',
    description: 'خدمات مكتب العمل، التأشيرات، ونقل الكفالة.',
    icon: 'Briefcase',
    color: 'bg-blue-500'
  },
  {
    id: 'ag2',
    name: 'المديرية العامة للجوازات',
    description: 'إصدار وتجديد الإقامات، تأشيرات الخروج والعودة.',
    icon: 'Plane',
    color: 'bg-green-600'
  },
  {
    id: 'ag3',
    name: 'وزارة التجارة',
    description: 'السجلات التجارية، العلامات التجارية، والشركات.',
    icon: 'BadgeDollarSign',
    color: 'bg-indigo-500'
  },
  {
    id: 'ag4',
    name: 'البلديات والأمانات',
    description: 'رخص المحلات، الرخص الإنشائية، والشهادات الصحية.',
    icon: 'HardHat',
    color: 'bg-orange-500'
  },
  {
    id: 'ag5',
    name: 'التأمينات الاجتماعية',
    description: 'تسجيل المنشآت، إضافة واستبعاد المشتركين.',
    icon: 'UserCheck',
    color: 'bg-teal-600'
  }
];

export const SERVICES: Service[] = [
  { id: 's1', agency_id: 'ag1', title: 'فتح ملف منشأة جديد', description: 'فتح ملف للمنشأة في مكتب العمل وتفعيله.', price: 500, requirements: ['صورة السجل التجاري', 'صورة الهوية', 'عقد الإيجار'] },
  { id: 's2', agency_id: 'ag1', title: 'إصدار تأشيرات عمل', description: 'طلب رصيد تأشيرات وتفعيلها.', price: 1500, requirements: ['سريان رخصة البلدية', 'شهادة الزكاة'] },
  { id: 's3', agency_id: 'ag2', title: 'تجديد إقامة عامل', description: 'تجديد هوية مقيم لمدة سنة أو سنتين.', price: 200, requirements: ['فحص طبي', 'سداد الرسوم الحكومية'] },
  { id: 's4', agency_id: 'ag3', title: 'إصدار سجل تجاري', description: 'إصدار سجل تجاري رئيسي أو فرعي.', price: 300, requirements: ['الهوية الوطنية', 'العنوان الوطني'] },
];

export const INITIAL_REQUESTS: Request[] = [
  {
    id: 'req1',
    tracking_number: 'REQ-2023-001',
    user_id: 'u1',
    user_name: 'عبدالله محمد',
    service_id: 's3',
    service_title: 'تجديد إقامة عامل',
    status: RequestStatus.PROCESSING,
    created_at: '2023-10-25T10:00:00Z',
    updated_at: '2023-10-26T14:30:00Z',
    assigned_employee_id: 'e1'
  },
  {
    id: 'req2',
    tracking_number: 'REQ-2023-002',
    user_id: 'u1',
    user_name: 'عبدالله محمد',
    service_id: 's1',
    service_title: 'فتح ملف منشأة جديد',
    status: RequestStatus.COMPLETED,
    created_at: '2023-10-20T09:00:00Z',
    updated_at: '2023-10-22T11:00:00Z',
    assigned_employee_id: 'e1'
  }
];

export const INITIAL_MESSAGES: Message[] = [
  { id: 'm1', request_id: 'req1', sender_id: 'u1', sender_name: 'عبدالله محمد', content: 'السلام عليكم، هل تم سداد الرسوم؟', created_at: '2023-10-25T12:00:00Z', is_admin: false },
  { id: 'm2', request_id: 'req1', sender_id: 'a1', sender_name: 'خدمة العملاء', content: 'وعليكم السلام، جاري التدقيق حالياً وسيتم السداد قريباً.', created_at: '2023-10-25T12:05:00Z', is_admin: true },
];