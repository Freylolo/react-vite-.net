import { useEffect, useState } from 'react';
import { getProfile } from '../services/authService';
import { getUserById, updateUser } from '../services/userService';
import { showSuccess, showError } from '../utils/alert';
import type { UserDto } from '../types/user';
import { Dialog } from '@headlessui/react'; 
import { Pencil } from 'lucide-react';      

export default function ProfilePage() {
  const [user, setUser] = useState<UserDto | null>(null);
  const [form, setForm] = useState<Partial<UserDto & { password?: string }>>({});
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false); 

 useEffect(() => {
  const load = async () => {
    try {
      const summary = await getProfile();
      console.log('🔍 Datos del perfil:', summary);

      if (!summary.userId || summary.userId <= 0) {
        throw new Error(`ID de usuario inválido: ${summary.userId}`);
      }

      const data = await getUserById(summary.userId);
      setUser(data);
      setForm(data);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'No se pudo cargar tu perfil';
      showError('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  load();
}, []);

  const submit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!user) {
    showError('Error', 'Usuario no cargado');
    return;
  }
  const parsedId =
  typeof user.id === 'number'
    ? user.id
    : parseInt(String(user.id).trim(), 10);

  if (!Number.isFinite(parsedId) || parsedId <= 0) {
  showError('Error', `ID de usuario inválido: ${user.id}`);
  return;
}

  try {
    console.log('Actualizando usuario con ID:', parsedId);
    console.log('Datos enviados:', form);

    await updateUser(parsedId, form);

    showSuccess('Perfil actualizado correctamente');

    // Mantener el id tal cual vino, y mezclar los cambios del form
    setUser((prev) => (prev ? { ...prev, ...form, id: prev.id } as UserDto : prev));

    setIsOpen(false);
  } catch (err) {
    console.error(err);
    showError('Error', 'No se pudo actualizar el perfil');
  }
};


  if (loading) return <p className="p-6">Cargando...</p>;
  if (!user) return <p className="p-6">No se encontró el usuario</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Mi perfil</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="text-sm text-blue-600 flex items-center gap-1 hover:underline"
        >
          <Pencil className="w-4 h-4" />
          Editar
        </button>
      </div>

      <div className="space-y-2 text-gray-800">
        <p><strong>Nombre:</strong> {user.nombre}</p>
        <p><strong>Apellido:</strong> {user.apellido}</p>
        <p><strong>Correo:</strong> {user.correo}</p>
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <Dialog.Title className="text-lg font-bold mb-4">Editar perfil</Dialog.Title>

            <form onSubmit={submit} className="space-y-4">
              <input
                type="text"
                value={form.nombre || ''}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Nombre"
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                value={form.apellido || ''}
                onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                placeholder="Apellido"
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="email"
                value={form.correo || ''}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
                placeholder="Correo"
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="password"
                value={form.password || ''}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Nueva contraseña (opcional)"
                className="w-full border rounded px-3 py-2"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border rounded-lg text-gray-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Guardar
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
