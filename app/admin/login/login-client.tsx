'use client';

import { useState, type SyntheticEvent } from 'react';
import { ArrowLeft, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';

export function LoginClient({ configured }: { configured: boolean }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(false);

  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured) return;
    setPending(true);
    setMessage('');
    try {
      const { error } = await createClient().auth.signInWithPassword({ email, password });
      if (error) throw error;
      window.location.assign('/admin');
    } catch {
      setMessage('Не вдалося увійти. Перевірте email і пароль адміністратора.');
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#eef0e8] px-5 text-[#173326]">
      <div className="w-full max-w-md bg-[#f8f4ec] p-7 shadow-[0_20px_70px_rgba(23,51,38,.1)] sm:p-10">
        <a href="/" className="inline-flex items-center gap-2 text-sm text-[#647368]"><ArrowLeft className="size-4" /> На сайт</a>
        <p className="pd-eyebrow mt-10">Perfect Dim</p>
        <h1 className="mt-3 text-4xl">Вхід до адмінки</h1>
        <p className="mt-3 text-sm leading-6 text-[#647368]">Реєстрація закрита. Увійти може лише користувач, доданий адміністратором у Supabase.</p>
        {!configured ? <div className="mt-7 border border-[#b99751]/35 bg-white px-4 py-3 text-sm leading-6 text-[#647368]">Supabase ще не налаштовано в environment variables.</div> : (
          <form onSubmit={submit} className="mt-8 grid gap-5">
            <label className="grid gap-2"><Label>Email</Label><Input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 rounded-none bg-white" /></label>
            <label className="grid gap-2"><Label>Пароль</Label><Input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 rounded-none bg-white" /></label>
            {message && <p className="bg-[#f4ddd8] px-4 py-3 text-sm text-[#7b2e28]">{message}</p>}
            <Button disabled={pending} className="h-12 rounded-none bg-[#173326] hover:bg-[#254b39]"><LogIn className="size-4" /> {pending ? 'Вхід…' : 'Увійти'}</Button>
          </form>
        )}
      </div>
    </main>
  );
}
