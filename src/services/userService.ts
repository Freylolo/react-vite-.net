import { getToken } from '../utils/auth';
import type { UserCreateDto, UserDto } from '../types/user';

const API_URL = import.meta.env.VITE_API_URL;

export async function createUser(user: UserCreateDto): Promise<UserDto> {
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Error al crear el usuario');
  }

  return res.json();
}

export async function getUserById(id: number): Promise<UserDto> {
  const token = getToken();
  const res = await fetch(`${API_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error al cargar usuario');
  return res.json();
}

export async function updateUser(id: number, data: Partial<UserDto> & { password?: string }) {
  const token = getToken();
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar usuario');
}

