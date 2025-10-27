import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';


export default function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const { handleLogin, error, loading } = useLogin();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleLogin({ correo, password });
      if (remember) localStorage.setItem('remember', 'true');
      navigate('/products');
    } catch {
      // Error ya manejado por el hook
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-soft w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-center text-gray-500 mb-1 text-sm">Inicia sesión</h2>
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Bienvenido</h1>

        {error && (
          <motion.div
            className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm mb-4 border border-red-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="Correo electrónico"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          />

          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="accent-brand-600"
              />
              Recordar inicio de sesión
            </label>
            <a href="#" className="text-brand-600 hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl transition-colors ${
              loading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Entrando...' : 'Iniciar'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          ¿Aún no tienes una cuenta?{' '}
          <Link
          to="/create-user"className="text-brand-600 font-medium hover:underline">
           Crear cuenta
           </Link>
        </div>
      </motion.div>
    </div>
  );
}
