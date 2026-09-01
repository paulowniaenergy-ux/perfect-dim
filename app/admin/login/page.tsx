import type { Metadata } from 'next';
import { getSupabaseConfig } from '@/lib/supabase/config';
import { LoginClient } from './login-client';

export const metadata: Metadata = {
  title: 'Вхід до адмінки — Perfect Dim',
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ error?: string; reset?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const initialMessage =
    params.reset === 'success'
      ? 'Пароль оновлено. Тепер увійдіть із новим паролем.'
      : params.error === 'forbidden'
        ? 'Цей обліковий запис не має доступу до адмінки.'
        : '';

  return (
    <LoginClient
      configured={Boolean(getSupabaseConfig())}
      initialMessage={initialMessage}
    />
  );
}
