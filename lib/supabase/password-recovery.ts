import type { SupabaseClient } from '@supabase/supabase-js';

const PASSWORD_RESET_PATH = '/admin/reset-password';

type PasswordRecoveryClient = {
  auth: Pick<SupabaseClient['auth'], 'resetPasswordForEmail'>;
};

export function getPasswordRecoveryRedirectUrl(
  currentOrigin?: string,
  configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL,
) {
  const siteUrl = currentOrigin?.trim() || configuredSiteUrl?.trim();

  if (!siteUrl) {
    throw new Error(
      'Не вдалося визначити адресу сайту для відновлення пароля.',
    );
  }

  const siteOrigin = new URL(siteUrl).origin;
  return new URL(PASSWORD_RESET_PATH, `${siteOrigin}/`).toString();
}

export function requestPasswordRecovery(
  client: PasswordRecoveryClient,
  email: string,
  currentOrigin?: string,
) {
  const redirectTo = getPasswordRecoveryRedirectUrl(currentOrigin);
  return client.auth.resetPasswordForEmail(email, { redirectTo });
}
