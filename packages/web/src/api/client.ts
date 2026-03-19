const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/dev';

const getToken = () => localStorage.getItem('token');

export const request = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  const text = await res.text();
  const data = text ? (JSON.parse(text) as T) : null;

  if (!res.ok) {
    const msg = typeof data === 'object' && data !== null && 'error' in data
      ? (data as { error: string }).error
      : 'Request failed';
    throw new Error(msg);
  }

  return data as T;
};
