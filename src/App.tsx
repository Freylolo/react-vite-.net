import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Login from './app/Login';
import CreateUser from './app/CreateUser';
import ProductsPage from './app/ProductsPage';
import Header from './components/layout/Header';
import ProductCreatePage from './app/ProductCreatePage';
import ProductEditPage from './app/ProductEditPage';
import BuysPage from './app/BuysPage';
import ProfilePage from './app/ProfilePage';
import UsersGestorPage from './app/UsersGestorPage';

function Layout() {
  const location = useLocation();
  const hideHeaderRoutes = ['/', '/login','/create-user']; 
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/new" element={<ProductCreatePage />} />
        <Route path="/products/:id/edit" element={<ProductEditPage />} />
        <Route path="/buys" element={<BuysPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/gestor" element={<UsersGestorPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
