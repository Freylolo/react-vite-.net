#  Prueba Frontend

Frontend desarrollado en **React + Vite + TypeScript** para la gestión de productos, con integración a un backend ASP.NET Core Web API.

---

##  Backend

Este proyecto se conecta con el backend disponible en:

**Repositorio:** [Freylolo/Prueba1.WebApi](https://github.com/Freylolo/Prueba1.WebApi)

**Tecnología:** ASP.NET Core 8.0  
**Ruta base de la API:** `http://localhost:5258/api`  
**Ruta pública de archivos:** `http://localhost:5258/uploads`

---

##  Tecnologías principales

- **React 19**
- **Vite 7**
- **TypeScript 5.9**
- **TailwindCSS 3.4**
- **Zustand** (gestión de estado)
- **Styled Components**
- **React Router DOM 7**
- **SweetAlert2** (alertas interactivas)
- **Framer Motion** (animaciones)
- **Lucide React** (íconos SVG)
- **Headless UI** (componentes accesibles)

---

## Scripts disponibles

| Script     | Descripción                                 |
|------------|---------------------------------------------|
| `dev`      | Inicia el servidor de desarrollo con Vite   |
| `build`    | Compila TypeScript y genera el build final  |
| `lint`     | Ejecuta ESLint sobre el proyecto            |
| `preview`  | Previsualiza el build generado              |

---

## Estructura de módulos

### Dependencias

- `react`, `react-dom`: núcleo de la aplicación
- `react-router-dom`: navegación entre vistas
- `zustand`: manejo de estado global
- `styled-components`: estilos con CSS-in-JS
- `sweetalert2`, `sweetalert2-react-content`: alertas personalizadas
- `framer-motion`: animaciones fluidas
- `lucide-react`: íconos modernos
- `@headlessui/react`: componentes accesibles

### DevDependencies

- `vite`, `@vitejs/plugin-react`: entorno de desarrollo moderno
- `typescript`, `tsc`: tipado estático
- `eslint`, `typescript-eslint`: análisis de código
- `tailwindcss`, `postcss`, `autoprefixer`: estilos utilitarios
- `@types/*`: definiciones de tipos para TypeScript

---

## Configuración del entorno

1. Clona el repositorio:
   ```bash
   git clone (https://github.com/Freylolo/react-vite-.net.git)
   cd prueba-frontend
