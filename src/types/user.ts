export interface UserCreateDto {
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
}

export interface UserDto {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
}