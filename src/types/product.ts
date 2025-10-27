export interface ProductImageDto  {
  id: number;
  url: string;
}

export interface ProductDto  {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  disponible: boolean;
  imagenes?: ProductImageDto[];
  usuarioCreadorId?: number;
}