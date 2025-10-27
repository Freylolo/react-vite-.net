import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { getUserRoleFromToken } from '../utils/auth';
import CartBar from '../components/CartBar'; 
export default function ProductsPage() {
  const {
    products,
    loading,
    incluirNoDisponibles,
    setIncluirNoDisponibles,
    query,
    setQuery,
  } = useProducts();

  const navigate = useNavigate();
  const role = getUserRoleFromToken();
  const isAdmin = role === 'admin';

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <header className="mb-6 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <h1 className="text-2xl font-bold">Productos</h1>
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          {isAdmin && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 accent-black"
                checked={incluirNoDisponibles}
                onChange={(e) => setIncluirNoDisponibles(e.target.checked)}
              />
              Incluir no disponibles
            </label>
          )}

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o descripción…"
            className="w-72 rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
          />

          {isAdmin && (
            <button
              onClick={() => navigate('/products/new')}
              className="rounded-xl px-3 py-2 text-sm font-medium bg-[#1090eb] text-white"
            >
              + Agregar
            </button>
          )}
        </div>
      </header>

      {!loading && products.length === 0 && (
        <div className="text-center text-gray-500 py-10">No se encontraron productos.</div>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onClick={() => {}}
            isAdmin={isAdmin}
            onEdit={(id) => navigate(`/products/${id}/edit`)}
          />
        ))}
      </section>
      <CartBar></CartBar>
      </div>
  );
}
