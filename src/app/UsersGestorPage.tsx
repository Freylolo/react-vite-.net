import { useEffect, useMemo, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Pencil, Trash2, Search } from "lucide-react";
import type { UserDto } from "../types/user";
import { getAllUsers, updateUser, deleteUser } from "../services/userService";
import { showConfirm, showError, showSuccess } from "../utils/alert";

export default function UsersGestorPage() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<UserDto | null>(null);
  const [form, setForm] = useState<Partial<UserDto & { password?: string }>>(
    {}
  );

  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    (async () => {
      try {
        const list = await getAllUsers();
        setUsers(list);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Error desconocido";
        showError("Error", msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [u.nombre, u.apellido, u.correo, u.rol, u.activo]
        .filter(Boolean)
        .some((val) => String(val).toLowerCase().includes(q))
    );
  }, [users, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const openEdit = (u: UserDto) => {
    setEditing(u);
    setForm({
      nombre: u.nombre,
      apellido: u.apellido,
      correo: u.correo,
      activo: u.activo,
    });
    setIsOpen(true);
  };

  const closeEdit = () => {
    setIsOpen(false);
    setEditing(null);
    setForm({});
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    try {
      await updateUser(editing.id, {
        nombre: form.nombre,
        apellido: form.apellido,
        correo: form.correo,
        password: form.password,
      });

      setUsers((prev) =>
        prev.map((u) => (u.id === editing.id ? { ...u, ...form, id: u.id } : u))
      );

      showSuccess(
        "Usuario actualizado",
        "Los cambios se guardaron correctamente"
      );
      closeEdit();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      showError("Error", msg);
    }
  };

  const handleDelete = async (u: UserDto) => {
    const ok = await showConfirm(
      "¿Eliminar usuario?",
      `Esta acción no se puede deshacer.\nUsuario: ${u.nombre} ${u.apellido} (${u.correo})`,
      "Sí, eliminar"
    );
    if (!ok) return;

    try {
      await deleteUser(u.id);
      setUsers((prev) => prev.filter((x) => x.id !== u.id));
      showSuccess("Usuario eliminado", "Se eliminó correctamente");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      showError("Error", msg);
    }
  };

  if (loading) return <p className="p-6">Cargando usuarios...</p>;

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <h1 className="text-xl font-bold">Gestión de usuarios</h1>

        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar por nombre, correo, rol…"
            className="w-full sm:w-80 border rounded-xl px-4 py-2 pr-9"
          />
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="overflow-x-auto border rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold">ID</th>
              <th className="px-4 py-3 font-semibold">Nombre</th>
              <th className="px-4 py-3 font-semibold">Apellido</th>
              <th className="px-4 py-3 font-semibold">Correo</th>
              <th className="px-4 py-3 font-semibold">Rol</th>
              <th className="px-4 py-3 font-semibold">Estado</th>
              <th className="px-4 py-3 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  No hay usuarios que coincidan con la búsqueda.
                </td>
              </tr>
            )}

            {pageData.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-3">{u.id}</td>
                <td className="px-4 py-3">{u.nombre}</td>
                <td className="px-4 py-3">{u.apellido}</td>
                <td className="px-4 py-3">{u.correo}</td>
                <td className="px-4 py-3">{u.rol ?? "-"}</td>
                <td className="px-4 py-3">
                  {u.activo ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                      Activo
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                      Inactivo
                    </span>
                  )}
                </td>{" "}
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(u)}
                      className="px-3 py-1.5 border rounded-lg hover:bg-gray-50 inline-flex items-center gap-1"
                    >
                      <Pencil className="w-4 h-4" /> Editar
                    </button>
                    <button
                      onClick={() => handleDelete(u)}
                      className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1.5 border rounded-lg disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-sm text-gray-600">
          Página {page} de {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-3 py-1.5 border rounded-lg disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>

      {/* Modal de edición */}
      <Dialog open={isOpen} onClose={closeEdit} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <Dialog.Title className="text-lg font-bold mb-4">
              Editar usuario
            </Dialog.Title>

            <form onSubmit={submitEdit} className="space-y-4">
              <input
                type="text"
                value={form.nombre ?? ""}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Nombre"
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                value={form.apellido ?? ""}
                onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                placeholder="Apellido"
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="email"
                value={form.correo ?? ""}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
                placeholder="Correo"
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="password"
                value={form.password ?? ""}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Nueva contraseña (opcional)"
                className="w-full border rounded px-3 py-2"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeEdit}
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
