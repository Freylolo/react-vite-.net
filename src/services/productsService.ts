import type { ProductDto } from '../types/product';
import type { BuyDto } from '../types/buy';


const API_URL = import.meta.env.VITE_API_URL;

function getToken(): string | null {
  return localStorage.getItem('token');
}

async function parseErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    if (data && typeof data.message === 'string' && data.message.length > 0) {
      return data.message;
    }
  } catch {
    // ignoramos error al intentar parsear JSON
  }
  return fallback;
}

/* ----------------------------- GET ALL PRODUCTS ----------------------------- */
export async function getProducts(
  incluirNoDisponibles = false,
  signal?: AbortSignal
): Promise<ProductDto[]> {
  const url = `${API_URL}/products?incluirNoDisponibles=${incluirNoDisponibles}`;
  const headers: Record<string, string> = { Accept: 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { headers, signal });

  if (!res.ok) {
    const fallback = `Error ${res.status} al obtener productos`;
    const message = await parseErrorMessage(res, fallback);
    throw new Error(message);
  }

  return (await res.json()) as ProductDto[];
}

/* ----------------------------- GET PRODUCT BY ID ----------------------------- */
export async function getProductById(id: number): Promise<ProductDto> {
  const url = `${API_URL}/products/${id}`;
  const headers: Record<string, string> = { Accept: 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { headers });

  if (!res.ok) {
    const fallback = `Error ${res.status} al obtener producto`;
    const message = await parseErrorMessage(res, fallback);
    throw new Error(message);
  }

  return (await res.json()) as ProductDto;
}

/* ----------------------------- CREATE PRODUCT ----------------------------- */
export async function createProduct(
  dto: Omit<ProductDto, 'id' | 'imagenes'>,
  files: File[]
): Promise<void> {
  const form = new FormData();
  const precioNormalizado = String(dto.precio).replace(',', '.');
  
  form.append('nombre', dto.nombre);
  if (dto.descripcion) form.append('descripcion', dto.descripcion);
  form.append('precio', precioNormalizado); 
  form.append('disponible', String(dto.disponible ?? true));

  // Imágenes (máximo 3)
  files.slice(0, 3).forEach((f) => form.append('imagenes', f));

  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers,
    body: form,
  });

  if (!res.ok) {
    const fallback = `Error ${res.status} al crear producto`;
    const message = await parseErrorMessage(res, fallback);
    throw new Error(message);
  }
}


/* ----------------------------- UPDATE PRODUCT ----------------------------- */
export async function updateProduct(
  id: number,
  dto: Partial<ProductDto>
): Promise<void> {
  const url = `${API_URL}/products/${id}`;
  const token = getToken();
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const fallback = `Error ${res.status} al actualizar producto`;
    const message = await parseErrorMessage(res, fallback);
    throw new Error(message);
  }
}

/* ----------------------------- REPLACE IMAGES ----------------------------- */
export async function replaceProductImages(
  id: number,
  files: File[]
): Promise<void> {
  const form = new FormData();
  files.slice(0, 3).forEach((f) => form.append('imagenes', f));

  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/products/${id}/imagenes`, {
    method: 'PUT',
    headers,
    body: form,
  });

  if (!res.ok) {
    const fallback = `Error ${res.status} al actualizar imágenes`;
    const message = await parseErrorMessage(res, fallback);
    throw new Error(message);
  }
}

/* ----------------------------- PATCH DISPONIBILIDAD ----------------------------- */
export async function patchDisponibilidad(
  id: number,
  disponible: boolean
): Promise<void> {
  const url = `${API_URL}/products/${id}/disponibilidad`;
  const token = getToken();
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ disponible }),
  });

  if (!res.ok) {
    const fallback = `Error ${res.status} al cambiar disponibilidad`;
    const message = await parseErrorMessage(res, fallback);
    throw new Error(message);
  }
}

/* ----------------------------- DELETE PRODUCT ----------------------------- */
export async function deleteProduct(id: number): Promise<void> {
  const url = `${API_URL}/products/${id}`;
  const token = getToken();
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { method: 'DELETE', headers });

  if (!res.ok) {
    const fallback = `Error ${res.status} al eliminar producto`;
    const message = await parseErrorMessage(res, fallback);
    throw new Error(message);
  }
}

export async function buyProduct(productId: number, cantidad: number): Promise<void> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/buys`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ productId, cantidad }),
  });

  if (!res.ok) {
    const fallback = `Error ${res.status} al intentar comprar`;
    const message = await parseErrorMessage(res, fallback);
    throw new Error(message);
  }
}

export async function getMyBuys(): Promise<BuyDto[]> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/buys/me`, { headers });

  if (!res.ok) {
    const fallback = `Error ${res.status} al obtener compras`;
    const message = await parseErrorMessage(res, fallback);
    throw new Error(message);
  }

  return (await res.json()) as BuyDto[];
}
