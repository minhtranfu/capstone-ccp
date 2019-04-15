import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Header from './layout/Header';
import SubHeader from './layout/SubHeader';
import Footer from './layout/Footer';
import Routes from './modules/Routes';
import LoginModal from './modules/login/LoginModal';
import NotificationRoot from './layout/NotificationRoot';

import { authActions } from '../redux/actions';

import PageLoader from './common/PageLoader';

class App extends PureComponent {

  componentDidUpdate() {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }

  componentWillMount() {
    const { loadUserFromToken } = this.props;

    loadUserFromToken();
  }

  // shouldComponentUpdate(nextProps) {
  //   const { location, isAuthenticated } = this.props;

  //   if (location !== nextProps.location) {
  //     return true;
  //   }

  //   if (isAuthenticated !== nextProps.isAuthenticated) {
  //     return true;
  //   }

  //   return false;
  // }

  render() {
    const { authenticating, isAuthenticated } = this.props;

    if (authenticating) {
      return <PageLoader pastDelay />;
    }

    return (
      <div className="d-flex flex-column min-vh-100">
        <Header />
        {isAuthenticated &&
          <SubHeader />
        }
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
  authenticating: PropTypes.bool,
  isAuthenticated: PropTypes.bool,
  loadUserFromToken: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  const { authentication } = state;
  const { authenticating, isAuthenticated } = authentication;
  return {
    authenticating,
    isAuthenticated
  };
};

const mapDispatchToProps = {
  loadUserFromToken: authActions.loadUserFromToken
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
