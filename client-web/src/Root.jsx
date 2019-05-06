import PropTypes from 'prop-types';
import React from 'react';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { Router } from 'react-router-dom';
import { PersistGate } from 'redux-persist/lib/integration/react';

import App from './components/App';
import PageLoader from 'Components/common/PageLoader';

import history from 'Common/createHistory';

export default function Root({ store, persistor }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<PageLoader />} persistor={persistor}>
        <Router history={history}>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </Router>
      </PersistGate>
    </Provider>
  );
}

Root.propTypes = {
  store: PropTypes.object,
};
