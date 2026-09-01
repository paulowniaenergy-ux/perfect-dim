'use client';

import { createBrowserClient } from '@supabase/ssr';
import { requireSupabaseConfig } from './config';

type BrowserClientOptions = {
  detectSessionInUrl?: boolean;
  isSingleton?: boolean;
};

export function createClient(options: BrowserClientOptions = {}) {
  const { url, publishableKey } = requireSupabaseConfig();
  return createBrowserClient(url, publishableKey, {
    auth: {
      detectSessionInUrl: options.detectSessionInUrl,
    },
    isSingleton: options.isSingleton ?? true,
  });
}
