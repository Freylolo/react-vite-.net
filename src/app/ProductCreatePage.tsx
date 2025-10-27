import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import { createProduct } from '../services/productsService';
import { showError, showLoading, closeLoading, showSuccess } from '../utils/alert';

export default function ProductCreatePage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h2 className="text-xl font-bold mb-4">Agregar producto</h2>
     <ProductForm
      mode="create"  onSubmit={async (data, files) => {
     try {
                showLoading('Guardando...');
                await createProduct(data, files);
      closeLoading();
      await showSuccess('Producto creado', 'Se ha creado correctamente');
      navigate('/products');
    } catch (e: unknown) {
      closeLoading();
      const message =
        e instanceof Error ? e.message : 'No se pudo crear el producto';
      await showError('Error', message);
    }
  }}
/>
    </div>
    
  );
}
