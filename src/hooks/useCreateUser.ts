import { useState } from 'react';
import { createUser } from '../services/userService';
import type { UserCreateDto, UserDto } from '../types/user';


export function useCreateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdUser, setCreatedUser] = useState<UserDto | null>(null);

  const handleCreateUser = async (data: UserCreateDto) => {
  setLoading(true);
  setError(null);

  try {
    const user = await createUser(data);
    setCreatedUser(user);
    return user;
  } catch (err: unknown) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('Error desconocido');
    }
    throw err;
  } finally {
    setLoading(false);
  }
};


  return {
    loading,
    error,
    createdUser,
    handleCreateUser,
  };
}
