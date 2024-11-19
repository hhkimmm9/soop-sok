import Cookies from 'universal-cookie';

const cookies = new Cookies();
const token = cookies.get('auth-token');

export async function fetchWithAuth(url: string, options: RequestInit) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}