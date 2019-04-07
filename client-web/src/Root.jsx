import PropTypes from 'prop-types';
import React from 'react';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/lib/integration/react';

import App from './components/App';
import PageLoader from 'Components/common/PageLoader';

export default function Root ({
  store, persistor
}) {
  return (
    <Provider store={store}>
      <PersistGate loading={<PageLoader />} persistor={persistor}>
        <BrowserRouter>
          <HelmetProvider>
            <App/>
          </HelmetProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

Root.propTypes = {
  store: PropTypes.object
};
