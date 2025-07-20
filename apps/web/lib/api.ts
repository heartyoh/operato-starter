type ApiOptions = RequestInit & {
  headers?: Record<string, string>;
};

export async function apiFetch<T = any>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // 🔔 추가: Authorization header 자동 추가 (optional)
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`/api${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`API Error [${res.status}]: ${errorText}`);
    throw new Error(`API Error: ${res.status}`);
  }

  return res.json() as Promise<T>;
}
