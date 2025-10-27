export interface JwtPayload {
  sub?: string;
  email?: string;
  nombre?: string;
  apellido?: string;
  role?: string | string[];
  Rol?: string | string[];
  roles?: string | string[];
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string | string[];
  exp?: number;
  [key: string]: unknown;
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}

function base64UrlDecode(input: string): string {
  let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4;
  if (pad) base64 += '='.repeat(4 - pad);
  return atob(base64);
}

export function decodeToken(): JwtPayload | null {
  const token = getToken();
  if (!token) return null;

  try {
    const [, payloadB64] = token.split('.');
    if (!payloadB64) return null;
    const jsonPayload = decodeURIComponent(
      base64UrlDecode(payloadB64)
        .split('')
        .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload) as JwtPayload;
  } catch {
    return null;
  }
}

function normalizeRole(value: string | string[] | undefined | null): string | null {
  if (!value) return null;
  if (Array.isArray(value)) {
    const first = value.find(Boolean);
    return first ? String(first).toLowerCase() : null;
  }
  return String(value).toLowerCase();
}

export function getUserRoleFromToken(): string | null {
  const p = decodeToken();
  if (!p) return null;

  const role =
    normalizeRole(p.role) ??
    normalizeRole(p.Rol) ??
    normalizeRole(p.roles) ??
    normalizeRole(p['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);

  console.log('Payload JWT:', p);
  console.log('Rol decodificado del token:', role);

  return role;
}

export function getUserInfoFromToken(): {
  nombre?: string;
  apellido?: string;
  email?: string;
  fullName?: string;
  rol?: string;
} | null {
  const payload = decodeToken();
  if (!payload) return null;

  const nombre = payload.nombre as string | undefined;
  const apellido = payload.apellido as string | undefined;
  const email = payload.email as string | undefined;
  const rol = getUserRoleFromToken() ?? undefined;

  const fullName = [nombre, apellido].filter(Boolean).join(' ');
  return { nombre, apellido, email, fullName, rol };
}


