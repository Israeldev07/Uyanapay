// Cliente HTTP hacia la API NestJS (proxy /api/v1 configurado en next.config.mjs)

const TOKEN_KEY = 'uyanapay_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`/api/v1${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = Array.isArray(body.message) ? body.message.join(', ') : body.message;
    throw new Error(message ?? `Error ${res.status}`);
  }
  return res.json();
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'CLIENTE' | 'YANAPAYER' | 'ADMIN';
  };
  accessToken: string;
}

export const login = (email: string, password: string) =>
  api<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const registerClient = (data: Record<string, unknown>) =>
  api<AuthResponse>('/auth/register/cliente', { method: 'POST', body: JSON.stringify(data) });

export const registerYanapayer = (data: Record<string, unknown>) =>
  api<AuthResponse>('/auth/register/yanapayer', { method: 'POST', body: JSON.stringify(data) });
