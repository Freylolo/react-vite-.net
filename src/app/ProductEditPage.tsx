// src/app/ProductEditPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import {
  getProductById,
  updateProduct,
  replaceProductImages,
  patchDisponibilidad,
  deleteProduct,
} from "../services/productsService";
import {
  showError,
  showLoading,
  closeLoading,
  showSuccess,
  showConfirm,
} from "../utils/alert";
import type { ProductDto } from "../types/product";

export default function ProductEditPage() {
  const { id } = useParams();
  const pid = Number(id);
  const [product, setProduct] = useState<ProductDto | null>(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id || Number.isNaN(pid)) {
      (async () => {
        await showError("Error", "ID de producto inválido");
        navigate("/products");
      })();
      return;
    }

    (async () => {
      try {
        showLoading("Cargando...");
        const p = await getProductById(pid);
        setProduct(p);
      } catch (e: unknown) {
        const msg =
          e instanceof Error ? e.message : "No se pudo cargar el producto";
        await showError("Error", msg);
      } finally {
        closeLoading();
      }
    })();
  }, [id, pid, navigate]);

  if (!product) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Editar producto</h2>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                showLoading("Actualizando disponibilidad...");
                await patchDisponibilidad(product.id, !product.disponible);
                setProduct({ ...product, disponible: !product.disponible });
                closeLoading();
                await showSuccess("Listo", "Disponibilidad actualizada");
                navigate("/products");
              } catch (e: unknown) {
                closeLoading();
                const msg =
                  e instanceof Error ? e.message : "No se pudo actualizar";
                await showError("Error", msg);
              }
            }}
            className="rounded-lg px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300"
          >
            {product.disponible ? "Marcar no disponible" : "Marcar disponible"}
          </button>
          <button
            onClick={async () => {
              const confirmed = await showConfirm(
                "¿Eliminar este producto?",
                "Esta acción no se puede deshacer."
              );
              if (!confirmed) return;

              try {
                showLoading("Eliminando...");
                await deleteProduct(product.id);
                closeLoading();
                await showSuccess(
                  "Eliminado",
                  "Producto eliminado correctamente"
                );
                navigate("/products");
              } catch (e: unknown) {
                closeLoading();
                const msg =
                  e instanceof Error ? e.message : "No se pudo eliminar";
                await showError("Error", msg);
              }
            }}
            className="rounded-lg px-3 py-1.5 text-sm bg-red-500 hover:bg-red-600 text-white transition"
          >
            Eliminar
          </button>
        </div>
      </div>
      <ProductForm
        mode="edit"
        initial={product}
        submitting={saving}
        onSubmit={async (data, files) => {
          try {
            setSaving(true);
            showLoading("Guardando...");
            await updateProduct(product.id, data);
            if (files.length > 0) {
              await replaceProductImages(product.id, files);
            }
            closeLoading();
            await showSuccess("Guardado", "Cambios aplicados");
            navigate("/products");
          } catch (e: unknown) {
            closeLoading();
            const msg = e instanceof Error ? e.message : "No se pudo guardar";
            await showError("Error", msg);
          } finally {
            setSaving(false);
          }
        }}
      />
    </div>
  );
}
