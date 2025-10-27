import { useNavigate } from 'react-router-dom';
import { getUserInfoFromToken } from '../../utils/auth';
import { showSuccess } from '../../utils/alert';

export default function Header() {
  const navigate = useNavigate();
  const user = getUserInfoFromToken();
  const isAdmin = user?.rol?.toLowerCase() === 'admin';

  const handleLogout = () => { 
    localStorage.removeItem('token');
    showSuccess('Sesión cerrada', 'Vuelve pronto ☕');
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-[#FDF6EC] via-[#D7B99A] to-[#e8b692] text-[#2F2A28] shadow-sm border-b border-[#f0e8e4]/40">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <h1
          onClick={() => navigate('/products')}
          className="text-lg font-bold cursor-pointer hover:text-[#5B4033] transition"
        >
          ☕ Cafetería Calico
        </h1>

        {/* Navegación */}
        <nav className="flex gap-6 items-center text-sm font-medium">
          {user && (
            <>
              <button onClick={() => navigate('/products')} className="hover:text-[#5B4033]">
                Productos
              </button>
              <button onClick={() => navigate('/buys')} className="hover:text-[#5B4033]">
                Mis compras
              </button>
              <button onClick={() => navigate('/profile')} className="hover:text-[#5B4033]">
                Perfil
              </button>
              {isAdmin && (
                <button onClick={() => navigate('/gestor')} className="hover:text-[#5B4033]">
                  Gestión de usuarios
                </button>
              )}
            </>
          )}
        </nav>

        {/* Usuario y logout */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-700">
                Hola,&nbsp;
                <span className="font-semibold text-[#5B4033]">
                  {user.fullName || user.email}
                </span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-[#E75A5A] hover:bg-[#D94A4A] text-white text-sm font-medium px-3 py-1.5 rounded-xl shadow transition-all duration-200 hover:shadow-md"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-[#FCEDCA] hover:bg-[#f6e2a8] text-[#5B4033] text-sm font-medium px-3 py-1.5 rounded-xl shadow transition-all duration-200 hover:shadow-md"
            >
              Iniciar sesión
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
