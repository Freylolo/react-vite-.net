import type { LoginParams, LoginResult, UserProfile } from '../types/auth';

const BASE_URL = `${import.meta.env.VITE_API_URL}/auth`;


export async function login(params: LoginParams): Promise<LoginResult> {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Credenciales inválidas');
  }

  const data = await res.json();
  localStorage.setItem('token', data.token);
  return data;
}

export async function getProfile(): Promise<UserProfile> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No autenticado');

  const res = await fetch(`${BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error('No autenticado');
  return res.json();
}
