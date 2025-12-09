
import { createClient } from '@supabase/supabase-js';

// تم تحديث الرابط والمفتاح بناءً على البيانات المزودة
const supabaseUrl = 'https://hwunsbzyjabdfxpcqwij.supabase.co';
// ملاحظة: يبدو أن المفتاح المزود هو مفتاح خاص أو بصيغة غير معتادة (sb_secret).
// عادةً ما يبدأ المفتاح العام بـ eyJ...، ولكن سنستخدم ما تم تزويده.
// إذا واجهت مشاكل في الاتصال، يرجى التأكد من نسخ مفتاح 'anon' / 'public' من إعدادات API.
const supabaseKey = 'sb_secret_5GrzA_Jg-4oRnS0aY2fKnA_SVawL9hY';

export const supabase = createClient(supabaseUrl, supabaseKey);
