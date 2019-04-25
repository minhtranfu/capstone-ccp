import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import validate from 'validate.js';
import { Fade } from 'reactstrap';
import { connect } from 'react-redux';

import { userServices } from 'Services/domain/ccp';
import { getErrorMessage, getRoutePath } from 'Utils/common.utils';
import { ComponentBlocking, DropzoneUploadImage } from 'Components/common';
import { routeConsts } from 'Common/consts';

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
  _handleSubmitForm = async e => {
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

      // upload avatar
      data.contractor.thumbnailImageUrl = await this._uploadAvatar();

      const result = await userServices.register(data);
      if (result.username) {
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

  _uploadAvatar = async () => {
    const { avatarFile } = this.state;

    if (!avatarFile) {
      return '';
    }

    const formData = new FormData();
    formData.append('file', avatarFile);
    const uploadResult = await userServices.uploadAvatar(formData);

    return uploadResult[0];
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

  // Receive files(array) from dropzone and set fisrt image to state
  _onSelectAvatar = files => {
    if (!files[0]) {
      return;
    }

    const avatarFile = files[0];
    const avatar = URL.createObjectURL(avatarFile);
    this.setState({
      avatar,
      avatarFile
    });
  };

  // revoke preview URL and clear avatar in state
  _clearAvatar = () => {
    const { avatar } = this.state;
    URL.revokeObjectURL(avatar);
    this.setState({
      avatar: undefined,
      avatarFile: undefined
    });
  };

  _renderSuccessMessage = () => {
    return (
      <div className="container text-center">
        <div>
          <i className="fal fa-check-circle fa-9x text-success"></i>
        </div>
        <h1 className="text-success">Register successfully!</h1>
        <p>Your account is being verified.</p>
        <div className="text-center">
          <Link to={getRoutePath(routeConsts.LOGIN)}>Login</Link>
        </div>
      </div>
    );
  };

  render() {
    const { isFetching, message, avatar, user } = this.state;
    const { authentication } = this.props;

    if (authentication.isAuthenticated) {
      return <Redirect to={getRoutePath(routeConsts.HOME)}/>
    }

    if (user) {
      return (
        <Fade in={true} className="my-auto">
          {this._renderSuccessMessage()}
        </Fade>
      );
    }

    return (
      <div className="container">
        {isFetching &&
          <ComponentBlocking/>
        }
        <h4 className="text-center my-3 pb-2 border-bottom">Sign Up</h4>
        {message &&
          <div className="alert alert-warning">
            {message}
          </div>
        }
        <div className="bg-white p-3 shadow-sm">
          <div className="row">
            <div className="col-md-4 offset-md-4 mb-4 text-center">
              <h5>Avatar</h5>
              {!avatar &&
                <DropzoneUploadImage onChange={this._onSelectAvatar} multiple={false} />
              }
              {avatar &&
                <div>
                  <img src={avatar} alt="Preview avatar" width="170" height="170" className="rounded-circle shadow"/>
                  <div>
                    <button className="btn btn-outline-primary mt-2" onClick={this._clearAvatar}><i className="fal fa-times"></i> Remove</button>
                  </div>
                </div>
              }
            </div>
            <div className="col-md-6 border-right">
              <h5>Login information</h5>
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
              <h5>Contact information</h5>
              <div className="form-group">
                <label htmlFor="register_name">Full name: <i className="text-danger">*</i></label>
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
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { authentication } = state;

  return {
    authentication
  };
};

export default connect(mapStateToProps)(Register);
