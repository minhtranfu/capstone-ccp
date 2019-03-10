import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

class PrivateRoute extends Component {

  render() {
    const {authentication, ...otherProps} = this.props;
    
    if (!authentication.isAuthenticated) {
      return <Redirect to={{
        pathname: "/login",
        state: { referrer: otherProps.path }
      }} />;
    }

    return (
      <Route {...otherProps} />
    );
  }
}

const mapStateToProps = state => {
  const { authentication } = state;
  return {
    authentication
  };
};

export default connect(mapStateToProps)(PrivateRoute);