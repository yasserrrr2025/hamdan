
import { createClient } from '@supabase/supabase-js';

// تم تحديث الرابط والمفتاح بناءً على البيانات المزودة
const supabaseUrl = 'https://hwunsbzyjabdfxpcqwij.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3dW5zYnp5amFiZGZ4cGNxd2lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMzAxMDksImV4cCI6MjA4MDgwNjEwOX0.-zB-c_OLdpA1xN3dZEZvLnWLk-dq65ShscKBjlKHHFs';

export const supabase = createClient(supabaseUrl, supabaseKey);
