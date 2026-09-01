'use client';

import { useState, type SyntheticEvent } from 'react';
import { ArrowLeft, KeyRound, LogIn, Mail } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';

export function LoginClient({
  configured,
  initialMessage,
}: {
  configured: boolean;
  initialMessage: string;
}) {
  const [mode, setMode] = useState<'login' | 'recovery'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(initialMessage);
  const [pending, setPending] = useState(false);

  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured) return;
    setPending(true);
    setMessage('');
    try {
      const { error } = await createClient().auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      window.location.assign('/admin');
    } catch {
      setMessage('Не вдалося увійти. Перевірте email і пароль адміністратора.');
    } finally {
      setPending(false);
    }
  }

  async function requestRecovery(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured) return;
    setPending(true);
    setMessage('');

    try {
      const redirectTo = new URL(
        '/admin/reset-password',
        window.location.origin,
      ).toString();
      const { error } = await createClient().auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      if (error) throw error;
      setMessage(
        'Якщо цей email належить адміністратору, на нього надіслано посилання для зміни пароля.',
      );
    } catch {
      setMessage('Не вдалося надіслати лист. Спробуйте ще раз трохи пізніше.');
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#eef0e8] px-5 text-[#173326]">
      <div className="w-full max-w-md bg-[#f8f4ec] p-7 shadow-[0_20px_70px_rgba(23,51,38,.1)] sm:p-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#647368]"
        >
          <ArrowLeft className="size-4" /> На сайт
        </Link>
        <p className="pd-eyebrow mt-10">Perfect Dim</p>
        <h1 className="mt-3 text-4xl">
          {mode === 'login' ? 'Вхід до адмінки' : 'Відновлення пароля'}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#647368]">
          {mode === 'login'
            ? 'Реєстрація закрита. Увійти може лише користувач, доданий адміністратором у Supabase.'
            : 'Вкажіть email адміністратора. Ми надішлемо захищене посилання для встановлення нового пароля.'}
        </p>
        {!configured ? (
          <div className="mt-7 border border-[#b99751]/35 bg-white px-4 py-3 text-sm leading-6 text-[#647368]">
            Supabase ще не налаштовано в environment variables.
          </div>
        ) : (
          <form
            onSubmit={mode === 'login' ? submit : requestRecovery}
            className="mt-8 grid gap-5"
          >
            <div className="grid gap-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-12 rounded-none bg-white"
              />
            </div>
            {mode === 'login' && (
              <div className="grid gap-2">
                <Label htmlFor="admin-password">Пароль</Label>
                <Input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-12 rounded-none bg-white"
                />
              </div>
            )}
            {message && (
              <p className="bg-white px-4 py-3 text-sm leading-6 text-[#52665a]">
                {message}
              </p>
            )}
            <Button
              disabled={pending}
              className="h-12 rounded-none bg-[#173326] hover:bg-[#254b39]"
            >
              {mode === 'login' ? (
                <LogIn className="size-4" />
              ) : (
                <Mail className="size-4" />
              )}{' '}
              {pending
                ? mode === 'login'
                  ? 'Вхід…'
                  : 'Надсилання…'
                : mode === 'login'
                  ? 'Увійти'
                  : 'Надіслати посилання'}
            </Button>
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                setMode((current) =>
                  current === 'login' ? 'recovery' : 'login',
                );
                setMessage('');
              }}
              className="inline-flex items-center justify-center gap-2 text-sm text-[#647368] hover:text-[#173326] disabled:opacity-50"
            >
              <KeyRound className="size-4" />{' '}
              {mode === 'login' ? 'Забули пароль?' : 'Повернутися до входу'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
