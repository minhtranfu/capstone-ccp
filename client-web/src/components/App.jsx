import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Header from './common/Header';
import SubHeader from './common/SubHeader';
import Footer from './common/Footer';
import Routes from './modules/Routes';

const App = ({ location, history }) => {
  return (
    <div>
      <Header />
      <SubHeader />
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
