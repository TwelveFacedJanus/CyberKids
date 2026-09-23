// frontend/src/api/client.ts
const TOKEN_KEY = 'cyberkids_token';

// ✅ Проверка на Electron без ошибок TypeScript
const isElectron = (window as any).process?.type === 'renderer';
const BASE_URL = isElectron ? 'http://localhost:8000' : '';

console.log('🔵 Electron режим:', isElectron);
console.log('🔵 BASE_URL:', BASE_URL);

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = `${BASE_URL}${path}`;
  console.log('📡 Запрос к:', url);

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    let detail = `Ошибка ${res.status}`;
    try {
      const data = await res.json();
      if (data?.detail) detail = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
    } catch {
      /* ignore */
    }
    throw new ApiError(res.status, detail);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) => request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

export async function login(username: string, password: string) {
  const form = new URLSearchParams();
  form.append('username', username);
  form.append('password', password);

  const url = `${BASE_URL}/api/auth/login`;
  console.log('📡 Логин запрос к:', url);

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  });
  if (!res.ok) {
    let detail = 'Ошибка входа';
    try {
      const data = await res.json();
      if (data?.detail) detail = data.detail;
    } catch {
      /* ignore */
    }
    throw new ApiError(res.status, detail);
  }
  return res.json();
}

export const execution = {
  runCode: async (code: string, language: string) => {
    const response = await api.post<{ output: string; success: boolean; error?: string }>(
      '/api/run/code',
      { code, language }
    );
    return response;
  },

  runAIPrompt: async (prompt: string) => {
    const response = await api.post<{ response: string; success: boolean }>(
      '/api/run/ai-prompt',
      { prompt }
    );
    return response;
  },
};

export const phishing = {
  submit: async (data: {
    site: string;
    fake_url: string;
    username: string;
    password: string;
  }) => {
    return api.post<{
      success: boolean;
      error?: string;
      caught: boolean;
    }>("/api/phishing/submit", data);
  },
};