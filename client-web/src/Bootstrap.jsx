import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import Root from './Root';
import configureStore from './redux/store/configure-store';
import { INITIAL_STATE } from './common/app-const';

// Require globals
import '@babel/polyfill';
import 'bootstrap/scss/bootstrap.scss';
import 'font-awesome/scss/font-awesome.scss';
import './scss/style.scss';
import 'lodash';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { initializeFirebase, askForPermissioToReceiveNotifications } from './push-notification';

const store = configureStore(INITIAL_STATE);

// Init firebase message
initializeFirebase();
askForPermissioToReceiveNotifications();

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
