export interface LoginParams {
  correo: string;
  password: string;
}

export interface LoginResult {
  token: string;
}

export interface UserProfile {
  userId: number;
  email: string;
  nombre: string;
  apellido: string;
  rol: string;
}
