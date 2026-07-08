import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getServerToken(): Promise<string> {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('access_token');
  if (!tokenCookie || !tokenCookie.value) {
    redirect('/');
  }
  return tokenCookie.value;
}

export async function fetchServer(endpoint: string, options: RequestInit = {}) {
  const token = await getServerToken();
  const res = await fetch(`http://localhost:3000${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Cookie': `access_token=${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    cache: 'no-store', // ensures we do not cache regional multi-tenancy results
  });

  if (!res.ok) {
    if (res.status === 403) {
      throw new Error('Access denied: You do not have permission to access this restaurant node.');
    }
    throw new Error(`Server request failed with status: ${res.status}`);
  }
  return res.json();
}
