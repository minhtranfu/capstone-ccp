import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Header from './common/Header';
import SubHeader from './common/SubHeader';
import Footer from './common/Footer';
import Routes from './modules/Routes';
import LoginModal from './modules/login/LoginModal';
import NotificationRoot from './common/NotificationRoot';

import { userActions } from '../redux/actions';

class App extends Component {

  componentDidUpdate() {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }

  componentWillMount() {
    const { loadUserFromToken } = this.props;

    loadUserFromToken();
  }

  render() {

    return (
      <div>
        <Header />
        <SubHeader />
        {Routes}
        <Footer />
        <LoginModal />
        <NotificationRoot />
      </div>
    );
  }
}

App.propTypes = {
  location: PropTypes.instanceOf(Object),
  history: PropTypes.instanceOf(Object),
  loadUserFromToken: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  loadUserFromToken: userActions.loadUserFromToken
};

export default withRouter(connect(null, mapDispatchToProps)(App));
