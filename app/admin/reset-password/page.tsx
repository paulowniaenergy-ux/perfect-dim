import type { Metadata } from 'next';
import { getSupabaseConfig } from '@/lib/supabase/config';
import { ResetPasswordClient } from './reset-password-client';

export const metadata: Metadata = {
  title: 'Новий пароль — Perfect Dim',
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return <ResetPasswordClient configured={Boolean(getSupabaseConfig())} />;
}
