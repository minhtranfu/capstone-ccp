import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, Redirect, withRouter } from 'react-router-dom';
import classnames from 'classnames';

import { authActions } from '../../../redux/actions/';
import { getRoutePath } from 'Utils/common.utils';
import { routeConsts } from 'Common/consts';

class LoginForm extends Component {

  data = {};
  validateOptions = {
    fields: [
      {
        name: 'username',
        rules: 'required',
      },
      {
        name: 'password',
        rules: 'required',
      }
    ]
  };
  state = {
    validateResult: {
      errors: {}
    }
  };

  _validate = (data, validateOptions) => {
    const result = {
      isInvalid: false,
      errors: {}
    };
    validateOptions.fields.forEach(field => {
      if (field.rules === 'required') {
        if (!data[field.name]) {
          result.isInvalid = true;
          result.errors[field.name] = `${field.name} is required`;
        }
      }
    });

    return result;
  };

  _handleFieldChange = e => {
    const { name, value } = e.target;

    this.data[name] = value;
  };

  _handleLogin = e => {
    e.preventDefault();

    const validateResult = this._validate(this.data, this.validateOptions);
    this.setState({
      validateResult
    });
    if (validateResult.isInvalid) {
      
      return;
    }

    const { login } = this.props;
    const { username, password } = this.data;

    login(username, password);

  };

  _getValidateMessage = (fielName) => {
    const { validateResult } = this.state;
    return (
      <div className="invalid-feedback">
        {validateResult.errors[fielName]}
      </div>
    );
  };

  render() {
    const { validateResult } = this.state;
    const { authentication, location } = this.props;
    const { errors } = validateResult;

    if (authentication.isAuthenticated) {
      let redirectTo = '/';
      if (location.state && location.state.referrer) {
        redirectTo = location.state.referrer;
      }
      
      return <Redirect to={redirectTo} />;
    }

    return (
      <div className="row py-2">
        {authentication.error &&
          <div className="col-md-12">
            <div className="alert alert-warning alert-dismissible fade show" role="alert">
              {authentication.error.response ? authentication.error.response.data.message : authentication.error.message}
            </div>
          </div>
        }
        <div className="col-md-6 py-2 border-right">
          <form onSubmit={this._handleLogin}>
            <div className={classnames('form-group')}>
              <label htmlFor="username">Username:</label>
              <input name="username" id="username" onChange={this._handleFieldChange} type="text" className={classnames('form-control', {'is-invalid': errors.username})} placeholder="Username" autoFocus/>
              {this._getValidateMessage('username')}
            </div>
            <div className={classnames('form-group')}>
              <label htmlFor="password">Password:</label>
              <input name="password" id="password" onChange={this._handleFieldChange} type="password" className={classnames('form-control', {'is-invalid': errors.password})} placeholder="********" />
              {this._getValidateMessage('password')}
            </div>
            <div className="form-group text-center">
              <button className="btn btn-primary" type="submit" disabled={authentication.loggingIn}>
                {authentication.loggingIn &&
                  <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
                }
                {!authentication.loggingIn &&
                  <i className="fal fa-sign-in mr-1"></i>
                }
                Login
                </button>
            </div>
          </form>
        </div>
        <div className="col-md-6">
          <h6 className="mt-3 text-muted">Do not have an account?</h6>
          <Link className="btn btn-block btn-outline-primary" to={getRoutePath(routeConsts.SIGNUP)}><i className="fal fa-user-circle"></i> Sign Up</Link>
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
  login: authActions.login
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginForm));
