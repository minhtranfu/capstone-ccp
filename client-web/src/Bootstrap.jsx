import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import Root from './Root';
import configureStore from './redux/store/configure-store';
import { INITIAL_STATE } from './common/app-const';

// Require globals
import '@babel/polyfill';
import 'bootstrap/scss/bootstrap.scss';
import './assets/fontawesome-pro/css/all.css';
import './scss/style.scss';
import 'lodash';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { initializeFirebase } from './push-notification';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';

const store = configureStore(INITIAL_STATE);

// Init firebase message
if ('serviceWorker' in navigator) {
  const registration = runtime.register();
  initializeFirebase();
}

const ROOT_ELEMENT_ID_AS_DEFINED_IN_INDEX_HTML = 'app-root';

ReactDOM.render(
  <AppContainer>
    <Root store={store}/>
  </AppContainer>,
  document.getElementById(ROOT_ELEMENT_ID_AS_DEFINED_IN_INDEX_HTML)
);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./Root', () => {
    const NextApp = require('./Root').default;
    ReactDOM.render(
      <AppContainer>
        <NextApp store={store}/>
      </AppContainer>,
      document.getElementById(ROOT_ELEMENT_ID_AS_DEFINED_IN_INDEX_HTML)
    );
  });
}
