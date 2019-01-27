import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Footer from './common/Footer';
import Header from './common/Header';
import Routes from './modules/Routes';

import { TransitionGroup, CSSTransition } from "react-transition-group";

const App = ({ location, history }) => {
  return (
    <div>
      <Header />
      <TransitionGroup>
        <CSSTransition
          key={location.key}
          classNames="fade"
          timeout={500}
        >
          {Routes}
        </CSSTransition>
      </TransitionGroup>
      <Footer />
    </div>
  );
};

App.propTypes = {
  location: PropTypes.instanceOf(Object),
  history: PropTypes.instanceOf(Object)
};

export default withRouter(App);
