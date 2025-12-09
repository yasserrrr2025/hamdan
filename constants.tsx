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
  'بانتظار المراجعة': 'bg-amber-50 text-amber-700 border-amber-200', // Gold/Amber for pending
  'قيد التنفيذ': 'bg-blue-50 text-blue-700 border-blue-200', // Blue for processing
  'مكتمل': 'bg-emerald-50 text-emerald-700 border-emerald-200', // Emerald for success
  'مرفوض': 'bg-red-50 text-red-700 border-red-200', // Red for rejection
  'بانتظار العميل': 'bg-orange-50 text-orange-700 border-orange-200', // Orange for action required
};