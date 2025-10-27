import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateUser } from '../hooks/useCreateUser';
import { showSuccess, showError, showLoading, closeLoading } from '../utils/alert';

export default function CreateUser() {
  const { handleCreateUser, loading } = useCreateUser();
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      showLoading('Creando usuario...');
      await handleCreateUser(form);
      closeLoading();
      await showSuccess('Usuario creado con éxito', 'Ahora puedes iniciar sesión');
      navigate('/');
    } catch (err: unknown) {
      closeLoading();
      if (err instanceof Error) {
        await showError('Error al crear usuario', err.message);
      } else {
        await showError('Error al crear usuario', 'Intenta nuevamente');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-soft w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Crear usuario</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="nombre"
            placeholder="Nombre"
            onChange={handleChange}
            className="px-4 py-2 border rounded-xl"
            required
          />
          <input
            name="apellido"
            placeholder="Apellido"
            onChange={handleChange}
            className="px-4 py-2 border rounded-xl"
            required
          />
          <input
            name="correo"
            type="email"
            placeholder="Correo"
            onChange={handleChange}
            className="px-4 py-2 border rounded-xl"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            onChange={handleChange}
            className="px-4 py-2 border rounded-xl"
            required
          />

          {/* Botón crear dentro del formulario */}
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-600 text-white py-2 rounded-xl hover:bg-brand-700 transition"
          >
            {loading ? 'Creando...' : 'Crear usuario'}
          </button>
        </form>
      </div>
      <button
        type="button"
        onClick={() => navigate('/')}
        className="mt-6 border border-gray-300 text-gray-700 py-2 px-6 rounded-xl hover:bg-gray-100 transition"
      >
        ← Volver
      </button>
    </div>
  );
}
