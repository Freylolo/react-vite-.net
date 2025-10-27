import { useEffect, useMemo, useRef, useState } from 'react';
import { getProducts } from '../services/productsService';
import type { ProductDto } from '../types/product';
import { showError, showLoading, closeLoading } from '../utils/alert';

export function useProducts() {
  const [incluirNoDisponibles, setIncluirNoDisponibles] = useState(false);
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

 useEffect(() => {
  (async () => {
    try {
      setLoading(true);
      showLoading('Cargando productos...');
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      const data = await getProducts(incluirNoDisponibles, ctrl.signal);
      setItems(data);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return; 
      }
      const msg =
        err instanceof Error
          ? err.message
          : 'No se pudo cargar productos';

      showError('Error', msg);
    } finally {
      setLoading(false);
      closeLoading();
    }
  })();
}, [incluirNoDisponibles]);


  const [debounced, setDebounced] = useState('');
  useEffect(() => {
    const id = setTimeout(() => setDebounced(query.trim().toLowerCase()), 300);
    return () => clearTimeout(id);
  }, [query]);

  const filtered = useMemo(() => {
    if (!debounced) return items;
    return items.filter((p) => {
      const n = (p.nombre ?? '').toLowerCase();
      const d = (p.descripcion ?? '').toLowerCase();
      return n.includes(debounced) || d.includes(debounced);
    });
  }, [items, debounced]);

  return {
    loading,
    products: filtered,
    incluirNoDisponibles,
    setIncluirNoDisponibles,
    query,
    setQuery,
  };
}
