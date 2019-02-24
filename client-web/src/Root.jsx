import PropTypes from 'prop-types';
import React from 'react';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

import App from './components/App';

export default function Root ({
  store
}) {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <HelmetProvider>
          <App/>
        </HelmetProvider>
      </BrowserRouter>
    </Provider>
  );
}

Root.propTypes = {
  store: PropTypes.object
};
