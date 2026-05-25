type CloudflareContext = {
  cloudflare?: {
    env?: Record<string, string | undefined>;
  };
};

function normalizeBaseUrl(value: string | undefined, fallback: string): string {
  const normalized = value?.trim().replace(/\/+$/, '');
  return normalized || fallback;
}

export function getSupabaseManagementApiBaseUrl(context?: unknown): string {
  const cloudflareEnv = (context as CloudflareContext | undefined)?.cloudflare?.env;
  const processEnv = typeof process !== 'undefined' ? process.env : undefined;

  return normalizeBaseUrl(
    cloudflareEnv?.SUPABASE_MANAGEMENT_API_BASE_URL ??
      cloudflareEnv?.VITE_SUPABASE_MANAGEMENT_API_BASE_URL ??
      processEnv?.SUPABASE_MANAGEMENT_API_BASE_URL ??
      processEnv?.VITE_SUPABASE_MANAGEMENT_API_BASE_URL,
    'https://api.supabase.com',
  );
}
