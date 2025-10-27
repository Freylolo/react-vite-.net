import { useState } from 'react';
import { login } from '../services/authService';
import type { LoginParams } from '../types/auth';

export function useLogin() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

 const handleLogin = async (params: LoginParams) => {
  setError(null);
  setLoading(true);
  try {
    const result = await login(params);
    return result;
  } catch (err: unknown) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('Ocurrió un error desconocido');
    }
    throw err;
  } finally {
    setLoading(false);
  }
};


  return { handleLogin, loading, error };
}
