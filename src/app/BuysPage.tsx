import { useEffect, useState } from 'react';
import { getMyBuys } from '../services/productsService';
import type { BuyDto } from '../types/buy';
import { useNavigate } from 'react-router-dom';

export default function BuysPage() {
  const [buys, setBuys] = useState<BuyDto[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    getMyBuys()
      .then(setBuys)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-4">Mis compras</h1>

      {loading && <p>Cargando...</p>}

      {!loading && buys.length === 0 && (
        <p className="text-gray-500">Aún no has realizado compras.</p>
      )}

      <ul className="space-y-4">
        {buys.map((buy) => (
          <li key={buy.id} className="border p-4 rounded-xl shadow">
            <h2 className="font-semibold">{buy.product.nombre}</h2>
            <p className="text-sm text-gray-600">Cantidad: {buy.cantidad}</p>
            <p className="text-sm text-gray-600">Fecha: {new Date(buy.fechaCompra).toLocaleDateString()}</p>
             <p className="text-sm text-gray-600">Total: ${buy.total.toFixed(2)} </p>
          </li>
        ))}
      </ul>
      <br></br>
     <div className="mb-6">
      <button
        onClick={() => navigate('/products')}
        className="px-4 py-2 rounded-lg bg-[#1090eb] text-white hover:bg-[#0b73c9] transition"
      >
        Regresar
      </button>
    </div>
    </div>
  );
}
