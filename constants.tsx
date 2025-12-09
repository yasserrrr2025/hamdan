import { 
  Building2, 
  Briefcase, 
  Plane, 
  HardHat, 
  BadgeDollarSign, 
  FileText,
  UserCheck,
  Building
} from 'lucide-react';
import React from 'react';

export const ICONS: Record<string, React.ElementType> = {
  Building2,
  Briefcase,
  Plane,
  HardHat,
  BadgeDollarSign,
  FileText,
  UserCheck,
  Building
};

export const STATUS_COLORS = {
  'بانتظار المراجعة': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'قيد التنفيذ': 'bg-blue-100 text-blue-800 border-blue-200',
  'مكتمل': 'bg-green-100 text-green-800 border-green-200',
  'مرفوض': 'bg-red-100 text-red-800 border-red-200',
  'بانتظار العميل': 'bg-orange-100 text-orange-800 border-orange-200',
};