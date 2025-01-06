import { createBrowserRouter } from 'react-router-dom';
import SearchForm from './components/search/SearchForm';
import DisplayMap from './components/search/DisplayMap';
import {Layout} from './layout';
import CartPage from './pages/Cart';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <SearchForm />,
      },
      {
        path: '/map',
        element: <DisplayMap displays={[]} center={{ lat: 0, lng: 0 }} />,
      },
      {
        path: '/cart',
        element: <CartPage />,
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