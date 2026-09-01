'use client';

import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { ArrowLeft, KeyRound, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';

type RecoveryState = 'checking' | 'ready' | 'invalid' | 'saving';

type ImplicitRecovery = {
  accessToken: string;
  refreshToken: string;
};

export function ResetPasswordClient({ configured }: { configured: boolean }) {
  const clientRef = useRef<SupabaseClient | null>(null);
  const recoveryPromiseRef = useRef<Promise<void> | null>(null);
  const [state, setState] = useState<RecoveryState>(
    configured ? 'checking' : 'invalid',
  );
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState(
    configured
      ? 'Перевіряємо захищене посилання…'
      : 'Supabase ще не налаштовано в environment variables.',
  );

  useEffect(() => {
    if (!configured) return;

    let active = true;

    async function prepareRecoverySession() {
      const url = new URL(window.location.href);
      const implicit = readImplicitRecovery(url);
      const pkceCode = url.searchParams.get('code');
      const pkceFlowId = url.searchParams.get('sb_flow_id');
      const redirectError = readRedirectError(url);

      // Remove credentials and callback errors from the visible URL before
      // any async work. Parsed values remain only in this function's memory.
      window.history.replaceState(
        window.history.state,
        '',
        '/admin/reset-password',
      );

      if (redirectError) throw new Error(redirectError);

      if (implicit) {
        const client = createClient({
          detectSessionInUrl: false,
          isSingleton: false,
        });
        clientRef.current = client;
        const { error } = await client.auth.setSession({
          access_token: implicit.accessToken,
          refresh_token: implicit.refreshToken,
        });
        if (error) throw error;
        return;
      }

      if (!pkceCode) {
        throw new Error('Recovery callback is missing.');
      }

      const client = createClient({
        detectSessionInUrl: false,
        isSingleton: false,
      });
      clientRef.current = client;
      const { data, error } = await client.auth.exchangeCodeForSession(
        pkceCode,
        pkceFlowId ? { flowId: pkceFlowId } : undefined,
      );
      const redirectType = (data as typeof data & { redirectType?: string })
        .redirectType;
      if (error || !data.session || redirectType !== 'recovery') {
        throw error ?? new Error('Recovery session is missing.');
      }
    }

    recoveryPromiseRef.current ??= prepareRecoverySession();

    void recoveryPromiseRef.current
      .then(() => {
        if (!active) return;
        setState('ready');
        setMessage('');
      })
      .catch(() => {
        if (!active) return;
        setState('invalid');
        setMessage(
          'Посилання недійсне або вже втратило чинність. Запросіть нове на сторінці входу.',
        );
      });

    return () => {
      active = false;
    };
  }, [configured]);

  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state !== 'ready' || !clientRef.current) return;

    if (password.length < 8) {
      setMessage('Пароль має містити щонайменше 8 символів.');
      return;
    }

    if (password !== confirmation) {
      setMessage('Паролі не збігаються.');
      return;
    }

    setState('saving');
    setMessage('');

    const client = clientRef.current;
    const { error } = await client.auth.updateUser({ password });

    if (error) {
      setState('ready');
      setMessage(
        'Не вдалося змінити пароль. Запросіть нове посилання та спробуйте ще раз.',
      );
      return;
    }

    await client.auth.signOut({ scope: 'local' });
    window.location.replace('/admin/login?reset=success');
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#eef0e8] px-5 text-[#173326]">
      <div className="w-full max-w-md bg-[#f8f4ec] p-7 shadow-[0_20px_70px_rgba(23,51,38,.1)] sm:p-10">
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-2 text-sm text-[#647368]"
        >
          <ArrowLeft className="size-4" /> До входу
        </Link>
        <p className="pd-eyebrow mt-10">Perfect Dim</p>
        <h1 className="mt-3 text-4xl">Новий пароль</h1>
        <p className="mt-3 text-sm leading-6 text-[#647368]">
          Створіть новий пароль для захищеного доступу до адмінки.
        </p>

        {state === 'checking' && (
          <div className="mt-8 flex items-center gap-3 bg-white px-4 py-4 text-sm text-[#52665a]">
            <LoaderCircle className="size-4 animate-spin" /> {message}
          </div>
        )}

        {state === 'invalid' && (
          <div className="mt-8 grid gap-5">
            <p className="bg-[#f4ddd8] px-4 py-3 text-sm leading-6 text-[#7b2e28]">
              {message}
            </p>
            <Link
              href="/admin/login"
              className="inline-flex h-12 items-center justify-center bg-[#173326] px-6 text-sm font-semibold text-white"
            >
              Запросити нове посилання
            </Link>
          </div>
        )}

        {(state === 'ready' || state === 'saving') && (
          <form onSubmit={submit} className="mt-8 grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="new-password">Новий пароль</Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-12 rounded-none bg-white"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Повторіть пароль</Label>
              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                className="h-12 rounded-none bg-white"
              />
            </div>
            {message && (
              <p className="bg-[#f4ddd8] px-4 py-3 text-sm leading-6 text-[#7b2e28]">
                {message}
              </p>
            )}
            <Button
              disabled={state === 'saving'}
              className="h-12 rounded-none bg-[#173326] hover:bg-[#254b39]"
            >
              {state === 'saving' ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <KeyRound className="size-4" />
              )}{' '}
              {state === 'saving' ? 'Збереження…' : 'Зберегти новий пароль'}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}

function readImplicitRecovery(url: URL): ImplicitRecovery | null {
  if (!url.hash) return null;
  const params = new URLSearchParams(url.hash.slice(1));
  if (params.get('type') !== 'recovery') return null;

  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');
  if (!accessToken || !refreshToken) return null;

  return { accessToken, refreshToken };
}

function readRedirectError(url: URL) {
  const search = url.searchParams;
  const hash = new URLSearchParams(url.hash.slice(1));
  return (
    search.get('error_description') ??
    search.get('error') ??
    hash.get('error_description') ??
    hash.get('error')
  );
}
