import type { ProductDto } from '../types/product';
import { Plus } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

type Props = {
  product: ProductDto;
  onClick?: (p: ProductDto) => void;
  isAdmin?: boolean;
  onEdit?: (id: number) => void;
};

const API_URL = import.meta.env.VITE_PUBLIC_URL;

export default function ProductCard({ product, onClick, isAdmin = false, onEdit }: Props) {
  const { addToCart } = useCartStore();

  const firstImg = product.imagenes?.[0]
    ? `${API_URL.replace(/\/+$/, '')}/uploads/${product.imagenes[0]}`
    : undefined;

  const otherImgs = product.imagenes?.slice(1) ?? [];

  const handleCardClick = () => {
    if (onClick) onClick(product);
  };

  return (
    <div
      className="rounded-2xl border bg-white p-4 shadow transition hover:shadow-lg"
      role={onClick ? 'button' : undefined}
      onClick={onClick ? handleCardClick : undefined}
      tabIndex={onClick ? 0 : -1}
    >
      {/* Imagen principal */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100">
        {firstImg ? (
          <img
            src={firstImg}
            alt={product.nombre}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full grid place-content-center text-sm text-gray-500">
            Sin imagen
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
          title="Agregar al carrito"
          className="absolute bottom-2 right-2 z-10 rounded-full p-2 bg-white/90 shadow-lg backdrop-blur-md border border-gray-300 hover:bg-white transition"
        >
          <Plus className="w-4 h-4 text-gray-800" />
        </button>
      </div>

      {/* Galería de imágenes adicionales */}
      {otherImgs.length > 0 && (
        <div className="mt-2 flex gap-2 overflow-x-auto">
          {otherImgs.map((img, index) => (
            <img
              key={index}
              src={`${API_URL.replace(/\/+$/, '')}/uploads/${img}`}
              alt={`Imagen ${index + 2}`}
              className="h-16 w-24 object-cover rounded-md border"
              loading="lazy"
            />
          ))}
        </div>
      )}

      {/* Detalles del producto */}
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3
            className="text-base font-semibold truncate cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.(product);
            }}
          >
            {product.nombre}
          </h3>
          {product.descripcion && (
            <p className="text-sm text-gray-500 line-clamp-2">{product.descripcion}</p>
          )}
        </div>
        <span className="shrink-0 font-bold">
          ${product.precio?.toFixed?.(2) ?? product.precio}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-xs ${
              product.disponible
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {product.disponible ? 'Disponible' : 'No disponible'}
          </span>
          {product.imagenes && product.imagenes.length > 1 && (
            <span className="text-xs text-gray-500">
              {product.imagenes.length} imágenes
            </span>
          )}
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-2 py-1 text-xs border rounded-lg hover:bg-gray-100"
              title="Editar producto"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(product.id);
              }}
            >
              Editar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
