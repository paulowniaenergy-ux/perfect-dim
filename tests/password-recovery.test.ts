import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getPasswordRecoveryRedirectUrl,
  requestPasswordRecovery,
} from '../lib/supabase/password-recovery.ts';

const previewOrigin =
  'https://perfect-dim-git-supabase-admin-paulownia.vercel.app';
const expectedRedirect = `${previewOrigin}/admin/reset-password`;

void test('forms the recovery URL from the current Vercel Preview origin', () => {
  assert.equal(getPasswordRecoveryRedirectUrl(previewOrigin), expectedRedirect);
});

void test('current origin takes priority over NEXT_PUBLIC_SITE_URL', () => {
  assert.equal(
    getPasswordRecoveryRedirectUrl(
      previewOrigin,
      'https://production.example.com',
    ),
    expectedRedirect,
  );
});

void test('passes the full reset page URL to resetPasswordForEmail', async () => {
  let receivedRedirect = '';
  const client = {
    auth: {
      async resetPasswordForEmail(
        _email: string,
        options?: { redirectTo?: string },
      ) {
        receivedRedirect = options?.redirectTo ?? '';
        return { data: {}, error: null };
      },
    },
  };

  await requestPasswordRecovery(
    client as Parameters<typeof requestPasswordRecovery>[0],
    'admin@example.com',
    previewOrigin,
  );

  assert.equal(receivedRedirect, expectedRedirect);
});
