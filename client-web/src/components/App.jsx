import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Footer from './common/Footer';
import Header from './common/Header';
import Routes from './modules/Routes';

const App = ({ location, history }) => {
  
  return (
    <div>
      <Header />
        {Routes}
      <Footer />
    </div>
  );
};

App.propTypes = {
  location: PropTypes.instanceOf(Object),
  history: PropTypes.instanceOf(Object)
};

export default withRouter(App);
