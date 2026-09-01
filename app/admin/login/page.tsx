import type { Metadata } from 'next';
import { getSupabaseConfig } from '@/lib/supabase/config';
import { LoginClient } from './login-client';

export const metadata: Metadata = {
  title: 'Вхід до адмінки — Perfect Dim',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return <LoginClient configured={Boolean(getSupabaseConfig())} />;
}
