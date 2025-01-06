import React from 'react';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import { RouterProvider } from 'react-router-dom';
import { store } from './store';
import esES from 'antd/lib/locale/es_ES';
import { router } from './routes';
import { APIProvider } from '@vis.gl/react-google-maps';


function App() {
  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_ID || ''}>
      <Provider store={store}>
        <ConfigProvider
          locale={esES}
        >
          <RouterProvider router={router} />
        </ConfigProvider>
      </Provider>
    </APIProvider>
  );
}

export default App;
