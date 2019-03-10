import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect, withRouter } from 'react-router-dom';

import { userActions } from '../../../redux/actions/';

class LoginForm extends Component {

  data = {};

  _handleFieldChange = e => {
    const { name, value } = e.target;

    this.data[name] = value;
  };

  _handleLogin = e => {
    e.preventDefault();
    const { login } = this.props;
    const { username, password } = this.data;

    login(username, password);

  };

  render() {
    const { authentication, location } = this.props;

    if (authentication.isAuthenticated) {
      let redirectTo = '/';
      if (location.state && location.state.referrer) {
        redirectTo = location.state.referrer;
      }
      
      return <Redirect to={redirectTo} />;
    }

    return (
      <div className="row py-4">
        <div className="col-md-6 border-right">
          <form onSubmit={this._handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input name="username" id="username" onChange={this._handleFieldChange} type="text" className="form-control" placeholder="Username" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input name="password" id="password" onChange={this._handleFieldChange} type="password" className="form-control" placeholder="********" />
            </div>
            <div className="form-group text-center">
              <button className="btn btn-success" type="submit" disabled={authentication.loggingIn}>
                {authentication.loggingIn &&
                  <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
                }
                {!authentication.loggingIn &&
                  <i className="fa fa-sign-in mr-1"></i>
                }
                Login
                </button>
            </div>
          </form>
        </div>
        <div className="col-md-6">
          <h6 className="text-muted">Login with</h6>
          <button className="btn btn-block btn-danger"><i className="fa fa-google"></i> Google</button>
          <button className="btn btn-block btn-primary"><i className="fa fa-facebook"></i> Facebook</button>
          <h6 className="mt-3 text-muted">Do not have an account?</h6>
          <button className="btn btn-block btn-success"><i className="fa fa-user-circle-o"></i> Đăng ký</button>
        </div>
      </div>
    );
  }
}

LoginForm.props = {
  user: PropTypes.object,
  login: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  const { authentication } = state;

  return {
    authentication
  }
};

const mapDispatchToProps = {
  login: userActions.login
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginForm));
