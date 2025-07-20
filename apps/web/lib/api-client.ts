const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error ${res.status}: ${res.statusText} - ${text}`);
  }

  return res.json();
}

export const apiClient = {
  get: <T>(url: string) => request<T>(url, { method: 'GET' }),
  post: <T>(url: string, body: any) =>
    request<T>(url, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  put: <T>(url: string, body: any) =>
    request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  delete: <T>(url: string) => request<T>(url, { method: 'DELETE' }),
};
