import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ConfigProvider } from 'antd';
import { RouterProvider } from 'react-router-dom';
import { store, persistor } from './store';
import esES from 'antd/lib/locale/es_ES';
import { router } from './routes';
import { APIProvider } from '@vis.gl/react-google-maps';
import theme from './theme/themeConfig';

const apiKey = 'AIzaSyDXATZeJNq59FfgyE3CiSKuvcCjHLp2joc';

function App() {
  return (
    <APIProvider 
      apiKey={apiKey} 
      libraries={["places", "marker"]}
    >
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ConfigProvider
            locale={esES}
            theme={theme}
          >
            <RouterProvider router={router} />
          </ConfigProvider>
        </PersistGate>
      </Provider>
    </APIProvider>
  );
}

export default App;
