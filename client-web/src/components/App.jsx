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

import { authActions } from '../redux/actions';

import PageLoader from './common/PageLoader';

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
    const { authentication } = this.props;

    if (authentication.authenticating) {
      return <PageLoader pastDelay />;
    }

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
  authentication: PropTypes.object.isRequired,
  loadUserFromToken: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  const { authentication } = state;
  return {
    authentication
  };
};

const mapDispatchToProps = {
  loadUserFromToken: authActions.loadUserFromToken
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
