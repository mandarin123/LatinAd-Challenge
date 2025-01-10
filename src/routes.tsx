import { createBrowserRouter } from 'react-router-dom';
import {Layout} from './layout';
import CartPage from './pages/Cart';
import Search from './pages/Search';
import Home from './pages/Home';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/cart',
        element: <CartPage />,
      },
      {
        path: '/search',
        element: <Search />,
      },
      {
        path: '*',
        element: (
          <div className="flex h-screen items-center justify-center">
            <h1 className="text-2xl font-bold text-gray-800">
              404 - Página no encontrada
            </h1>
          </div>
        ),
      },
    ],
  },
]); 