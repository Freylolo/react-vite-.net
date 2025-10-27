import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Base = {
  nombre: string;
  descripcion?: string;
  precio: number;
  disponible: boolean;
};

type Props = {
  initial?: Partial<Base>;
  mode: 'create' | 'edit';
  onSubmit: (data: Base, files: File[]) => Promise<void> | void;
  submitting?: boolean;
};

export default function ProductForm({ initial, mode, onSubmit, submitting }: Props) {
  // Usamos string para mantener el '0' visible y evitar que se borre al enfocar
  const [form, setForm] = useState<Omit<Base, 'precio'> & { precioStr: string }>({
    nombre: '',
    descripcion: '',
    precioStr: '',
    disponible: true,
  });

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const navigate = useNavigate();


  useEffect(() => {
    if (initial) {
      setForm((f) => ({
        ...f,
        nombre: initial.nombre ?? '',
        descripcion: initial.descripcion ?? '',
        precioStr:
          typeof initial.precio === 'number' && !Number.isNaN(initial.precio)
            ? String(initial.precio)
            : '0',
        disponible: initial.disponible ?? true,
      }));
    }
  }, [initial]);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arr = Array.from(e.target.files ?? []).slice(0, 3);
    setFiles(arr);
    setPreviews(arr.map((f) => URL.createObjectURL(f)));
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const precioNum = Number(form.precioStr.replace(',', '.'));
    const safePrecio = Number.isFinite(precioNum) ? precioNum : 0;

    await onSubmit(
      {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion?.trim() || '',
        precio: safePrecio,
        disponible: form.disponible,
      },
      files
    );
  };

  return (
    <>
    <form onSubmit={submitHandler} className="flex flex-col gap-4">
      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
        <input
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          placeholder="Ej. Latte de vainilla"
          className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300"
          required
        />
        <p className="mt-1 text-xs text-gray-500">Escribe el nombre comercial del producto.</p>
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          placeholder="Ej. Espresso doble con leche vaporizada y jarabe de vainilla."
          className="w-full px-4 py-2 border rounded-xl min-h-[100px] focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
        <p className="mt-1 text-xs text-gray-500">Describe ingredientes, tamaño o notas de sabor.</p>
      </div>

      {/* Precio (con '0' persistente) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
        <input
          inputMode="decimal"
          pattern="[0-9]*[.,]?[0-9]*"
          value={form.precioStr}
          onChange={(e) => {
            const v = e.target.value;
            // Permitimos vacío temporalmente, pero si queda vacío, mostramos '0'
            if (v === '') {
              setForm({ ...form, precioStr: '0' });
            } else {
              setForm({ ...form, precioStr: v });
            }
          }}
          onBlur={() => {
            if (form.precioStr.trim() === '' || form.precioStr === '.') {
              setForm({ ...form, precioStr: '0' });
            }
          }}
          placeholder="0.00"
          className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300"
          required
        />
        <p className="mt-1 text-xs text-gray-500">Introduce el precio (puedes usar coma o punto para decimales).</p>
      </div>

      {/* Disponible */}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.disponible}
          onChange={(e) => setForm({ ...form, disponible: e.target.checked })}
          className="h-4 w-4 accent-gray-700"
        />
        Disponible
      </label>

      {/* Imágenes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Imágenes (hasta 3) <span className="text-gray-400 font-normal">(opcional)</span>
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          className="mt-1 block"
        />
        <p className="mt-1 text-xs text-gray-500">Puedes subir hasta 3 imágenes del producto.</p>

        {previews.length > 0 && (
          <div className="mt-2 grid grid-cols-3 gap-2">
            {previews.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`preview-${i}`}
                className="aspect-square object-cover rounded-lg border"
              />
            ))}
          </div>
        )}
      </div>

      {/* Botón submit (neutro) */}
      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 rounded-xl border border-blue-300 text-gray-800 hover:bg-gray-100 disabled:opacity-60"
      >
        {submitting ? 'Guardando...' : mode === 'create' ? 'Crear producto' : 'Guardar cambios'}
      </button>
       <br></br>
    </form>
      {/* Botón Regresar fuera del formulario */}
    <div className="mb-6">
      <button
        onClick={() => navigate('/products')}
        className="px-4 py-2 rounded-lg bg-[#1090eb] text-white hover:bg-[#0b73c9] transition"
      >
        Regresar
      </button>
    </div>
  </>
  );
}
