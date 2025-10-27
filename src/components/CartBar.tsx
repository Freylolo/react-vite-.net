import { useCartStore } from '../store/cartStore';
import { buyProduct } from '../services/productsService';
import { useNavigate } from 'react-router-dom';
import { showError, showLoading, closeLoading, showSuccess } from '../utils/alert';

export default function CartBar() {
  const { items, clearCart, removeFromCart } = useCartStore();
  const navigate = useNavigate();


  const handleBuy = async () => {
    try {
      showLoading('Procesando compra...');
      for (const item of items) {
         console.log('Intentando comprar:', {
        productId: item.product.id,
        cantidad: item.cantidad,
      });
        await buyProduct(item.product.id, item.cantidad);
      }
      clearCart();
      closeLoading();
      await showSuccess('¡Gracias por tu compra!');
       navigate('/buys');
    }  catch (e: unknown) {
        closeLoading();
        const msg = e instanceof Error ? e.message : 'No se pudo completar la compra';
        await showError('Error', msg);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 rounded-xl shadow-lg border bg-white p-4 z-50">
      <h3 className="font-bold text-lg mb-2">Carrito</h3>
      <ul className="max-h-52 overflow-y-auto">
        {items.map((item) => (
          <li key={item.product.id} className="flex justify-between items-center mb-2">
            <div>
              <p className="text-sm font-semibold">{item.product.nombre}</p>
              <p className="text-xs text-gray-500">Cantidad: {item.cantidad}</p>
            </div>
            <button
              onClick={() => removeFromCart(item.product.id)}
              className="text-xs text-red-500 hover:underline"
            >
              Quitar
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={handleBuy}
        className="mt-3 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
      >
        Comprar ahora
      </button>
    </div>
  );
}
