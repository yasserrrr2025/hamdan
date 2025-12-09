
import { createClient } from '@supabase/supabase-js';

// --- إعدادات الاتصال بـ Supabase ---
// يرجى استبدال القيم أدناه بالقيم الخاصة بمشروعك من لوحة التحكم: Settings -> API

// 1. رابط المشروع (Project URL)
const supabaseUrl = 'https://hwunsbzyjabdfxpcqwij.supabase.co'; 

// 2. المفتاح العام (Anon Public Key)
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3dW5zYnp5amFiZGZ4cGNxd2lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMzAxMDksImV4cCI6MjA4MDgwNjEwOX0.-zB-c_OLdpA1xN3dZEZvLnWLk-dq65ShscKBjlKHHFs';

// إنشاء العميل
export const supabase = createClient(supabaseUrl, supabaseKey);
