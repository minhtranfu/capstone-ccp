import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

class PrivateRoute extends Component {

  render() {
    const {user, ...otherProps} = this.props;
    
    if (!user.isAuthenticated) {
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
  const { user } = state;
  return {
    user
  };
};

export default connect(mapStateToProps)(PrivateRoute);