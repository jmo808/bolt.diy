type CloudflareContext = {
  cloudflare?: {
    env?: Record<string, string | undefined>;
  };
};

function normalizeBaseUrl(value: string | undefined, fallback: string): string {
  const candidate = value?.trim() || fallback;

  let url: URL;

  try {
    url = new URL(candidate);
  } catch {
    throw new Error(
      `Invalid Supabase Management API base URL: "${candidate}". Expected an absolute http(s) URL with no path.`,
    );
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error(
      `Invalid Supabase Management API base URL scheme: "${url.protocol}". Only http and https are supported.`,
    );
  }

  if (url.pathname !== '/' || url.search || url.hash) {
    throw new Error(
      `Invalid Supabase Management API base URL: "${candidate}". Expected a bare origin with no path, query, or hash.`,
    );
  }

  return url.origin;
}

export function getSupabaseManagementApiBaseUrl(context?: unknown): string {
  const cloudflareEnv = (context as CloudflareContext | undefined)?.cloudflare?.env;
  const processEnv = typeof process !== 'undefined' ? process.env : undefined;

  return normalizeBaseUrl(
    cloudflareEnv?.SUPABASE_MANAGEMENT_API_BASE_URL ?? processEnv?.SUPABASE_MANAGEMENT_API_BASE_URL,
    'https://api.supabase.com',
  );
}
