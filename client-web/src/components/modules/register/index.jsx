import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { userServices } from 'Services/domain/ccp';
import { getErrorMessage } from 'Utils/common.utils';
import validate from 'validate.js';
import { ComponentBlocking } from 'Components/common';

class Register extends Component {
  state = {};
  data = {};

  // validate rules for validate.js
  constraints = {
    username: {
      presence: true,
      format: {
        pattern: "[a-z0-9]+",
        flags: "i",
        message: "can only contain a-z and 0-9"
      }
    },
    password: {
      presence: true,
      length: {
        minimum: 6,
        message: "must be at least 6 characters"
      }
    },
    confirmPassword: {
      presence: true,
      equality: "password"
    },
    name: {
      presence: true
    },
    email: {
      presence: true,
      email: true
    },
    phone: {
      presence: true,
      format: {
        pattern: "[0-9]+",
        flags: "i",
        message: "can only contain number"
      }
    }
  };

  _handleFieldChanged = e => {
    const { name, value } = e.target;

    this.data[name] = value;
  };

  /**
   * Validate and submit data when user submit form
   */
  _handleSubmitForm = e => {
    e.preventDefault();
    const { isFetching } = this.state;
    if (isFetching) {
      return;
    }

    // validate with validate.js
    const validateResult = validate(this.data, this.constraints);
    if (validateResult) {
      this.setState({ validateResult });
      return;
    }

    // Prepare data
    const data = {
      credentials: {
        username: this.data.username,
        password: this.data.password
      },
      contractor: {
        name: this.data.name,
        email: this.data.email,
        phoneNumber: this.data.phone
      }
    };

    try {
      // Set isFetch to block UI
      this.setState({
        isFetching: true
      });

      const result = userServices.register(data);
      if (result.id) {
        this.setState({
          isFetching: false,
          user: result
        });
      } else {
        this.setState({
          isFetching: false,
          message: 'An unknown error occured!'
        });
      }
    } catch (error) {
      const message = getErrorMessage(error);
      this.setState({
        message,
        isFetching: false
      });
    }

  };

  /**
   * Get validate message from validate result
   * with bootstrap 4 input feedback
   */
  _getValidateFeedback = fieldName => {
    const { validateResult } = this.state;

    if (!validateResult || !validateResult[fieldName]) {
      return null;
    }

    return (
      <div className="invalid-feedback d-block">
        {validateResult[fieldName]}
      </div>
    );
  };

  render() {
    const { isFetching, message } = this.state;

    return (
      <div className="container">
        {isFetching &&
          <ComponentBlocking/>
        }
        <h1 className="text-center my-3">Sign Up</h1>
        {message &&
          <div className="alert alert-warning">
            {message}
          </div>
        }
        <div className="row">
          <div className="col-md-6 border-right">
            <h4>Login information:</h4>
            <div className="form-group">
              <label htmlFor="register_username">Username: <i className="text-danger">*</i></label>
              <input type="text" className="form-control" id="register_username" name="username"
                onChange={this._handleFieldChanged}
              />
              {this._getValidateFeedback('username')}
            </div>
            <div className="form-group">
              <label htmlFor="register_password">Password: <i className="text-danger">*</i></label>
              <input type="password" className="form-control" id="register_password" name="password"
                onChange={this._handleFieldChanged}
              />
              {this._getValidateFeedback('password')}
            </div>
            <div className="form-group">
              <label htmlFor="register_password_confirm">Confirm password: <i className="text-danger">*</i></label>
              <input type="password" className="form-control" id="register_password_confirm" name="confirmPassword"
                onChange={this._handleFieldChanged}
              />
              {this._getValidateFeedback('confirmPassword')}
            </div>
          </div>
          <div className="col-md-6">
            <h4>Contact information:</h4>
            <div className="form-group">
              <label htmlFor="register_name">Name: <i className="text-danger">*</i></label>
              <input type="text" className="form-control" id="register_name" name="name"
                onChange={this._handleFieldChanged}
              />
              {this._getValidateFeedback('name')}
            </div>
            <div className="form-group">
              <label htmlFor="register_email">Email: <i className="text-danger">*</i></label>
              <input type="email" className="form-control" id="register_email" name="email"
                onChange={this._handleFieldChanged}
              />
              {this._getValidateFeedback('email')}
            </div>
            <div className="form-group">
              <label htmlFor="register_phone">Phone: <i className="text-danger">*</i></label>
              <input type="tel" className="form-control" id="register_phone" name="phone"
                onChange={this._handleFieldChanged}
              />
              {this._getValidateFeedback('phone')}
            </div>
          </div>
          <div className="col-md-12">
            <div className="form-group text-center mt-3">
              <div className="mb-2">
                By clicking sign up button, you agreed with <Link to="#" target="_blank">our terms and conditions</Link>
              </div>
              <button className="btn btn-primary"
                onClick={this._handleSubmitForm}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
