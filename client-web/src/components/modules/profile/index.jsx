import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { Fade } from 'reactstrap';
import validate from 'validate.js';
import Skeleton from 'react-loading-skeleton';

import { DropzoneUploadImage, Image, ComponentBlocking } from 'Components/common';
import { userServices } from 'Services/domain/ccp';
import { getErrorMessage } from 'Utils/common.utils';
import { authActions } from 'Redux/actions';
import { CONTRACTOR_STATUS_INFOS } from 'Common/consts';

class Profile extends Component {

  state = {
    editedData: {},
    validateResult: {},
    isUploadingVerifyingImages: false,
  };

  // Validate rules for contact info form
  contactInfoRules = {
    name: {
      presence: {
        allowEmpty: false
      }
    },
    email: {
      presence: {
        allowEmpty: false
      },
      email: true
    },
    phoneNumber: {
      presence: {
        allowEmpty: false
      },
      format: {
        pattern: "[0-9]+",
        flags: "i",
        message: "can only contain number"
      }
    }
  };

  _loadVerifyingImages = async () => {
    const { contractor, verifyingImages, loadVerifyingImages } = this.props;

    if (verifyingImages.isFetching || !!verifyingImages.errorMessage || !!verifyingImages.items.length) {
      return;
    }

    loadVerifyingImages(contractor.id);
  };

  componentDidMount() {
    this._loadVerifyingImages();
  }

  // Handle submit form update info
  _handleSubmitForm = async e => {
    e.preventDefault();
    const { isFetching, editedData } = this.state;
    const { contractor, updateUserInfo } = this.props;

    if (isFetching) {
      return;
    }

    // Prepare data for update contractor info
    const updateData = {
      ...contractor,
      ...editedData,
    };
    const validateResult = validate(updateData, this.contactInfoRules);
    if (validateResult) {
      this.setState({ validateResult });
      return;
    }

    try {
      this.setState({
        validateResult,
        isFetching: true
      });

      const result = await userServices.updateContractorById(contractor.id, updateData);

      // Update contractor info to redux to make change globally
      updateUserInfo({
        contractor: result
      });

      this.setState({
        isFetching: false,
        editedData: {},
        successMessage: 'Your account has been updated!'
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);

      this.setState({
        errorMessage,
        isFetching: false
      });
    }
  };

  // Update editedData in state when field was changed
  _handleFieldChanged = e => {
    const { name, value } = e.target;
    const { editedData } = this.state;

    this.setState({
      editedData: {
        ...editedData,
        [name]: value
      }
    });
  };

  // Show hide dropzone for changing avatar
  _toggleDropZone = () => {
    const { isChangingAvatar } = this.state;

    this.setState({
      isChangingAvatar: !isChangingAvatar
    });
  };

  // Handle selected file from dropzone
  _handleSelectAvatar = async files => {

    if (!files[0]) {
      return;
    }

    // Handle upload file[0]
    this.setState({
      isFetching: true
    });
    try {
      // Upload avatar
      const formData = new FormData();
      formData.append('file', files[0]);
      const uploadResult = await userServices.uploadAvatar(formData);
      if (!uploadResult[0]) {
        this.setState({
          errorMessage: 'Can not upload, please try again!',
          isFetching: false
        });
        return;
      }

      // Update avatar to current user
      const thumbnailImageUrl = uploadResult[0];
      const { contractor, updateUserInfo } = this.props;
      const updateData = {
        ...contractor,
        thumbnailImageUrl
      };
      const updateResult = await userServices.updateContractorById(contractor.id, updateData);

      // Update contractor info to redux to make change globally
      updateUserInfo({
        contractor: updateResult
      });

      this.setState({
        isFetching: false,
        isChangingAvatar: false,
        successMessage: 'Your avatar has been updated!'
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);

      this.setState({
        errorMessage,
        isFetching: false
      });
    }
  };

  _handleSelectVerifyingImages = async files => {
    const { contractor, setVerifyingImageItems } = this.props;
    if (files.length === 0) {
      return;
    }

    this.setState({
      isUploadingVerifyingImages: true
    });
    try {
      // Upload avatar
      const formData = new FormData();
      files.forEach(file => {
        formData.append('file', file);
      });

      const uploadResult = await userServices.uploadVerifyingImages(formData);
      if (!Array.isArray(uploadResult)) {
        this.setState({
          errorMessage: 'Can not upload, please try again!',
          isFetching: false
        });
        return;
      }

      // Update avatar to current user
      const images = uploadResult.map(image => ({ id: image.id }));
      const items = await userServices.addVerifyingImages({ contractorId: contractor.id, data: images });

      // Update verifyingImages info to redux to make change globally
      setVerifyingImageItems(items);

      this.setState({
        isUploadingVerifyingImages: false
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);

      this.setState({
        errorMessage,
        isUploadingVerifyingImages: false
      });
    }
  };

  // Discard all changes
  _resetData = () => {
    this.setState({
      editedData: {}
    });
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

  // Render avatar and change avatar section
  _renderAvatarSection = () => {
    const { isChangingAvatar, editedData } = this.state;
    const { contractor } = this.props;
    const currentData = {
      ...contractor,
      ...editedData
    };

    return (
      <div className="bg-white p-3">
        <div className="text-center">
          {isChangingAvatar &&
            <DropzoneUploadImage
              multiple={false}
              onChange={this._handleSelectAvatar}
            />
          }
          {!isChangingAvatar &&
            <img src={currentData.thumbnailImageUrl} alt="Avatar" className="rounded-circle" width="280" height="280" />
          }
          <div>
            <button className="btn btn-outline-primary btn-sm mt-2"
              onClick={this._toggleDropZone}
            >{isChangingAvatar ? 'Cancel' : 'Change'}</button>
          </div>
        </div>
      </div>
    );
  };

  // Render form update info section
  _renderFormSection = () => {
    const { isFetching, editedData } = this.state;
    const { contractor } = this.props;
    const currentData = {
      ...contractor,
      ...editedData
    };

    return (
      <div className="bg-white p-3 mb-3">
        <form onSubmit={this._handleSubmitForm}>
          <div className="form-group">
            <label htmlFor="profile_name">Name: <i className="text-danger">*</i></label>
            <input type="text" className="form-control"
              id="profile_name"
              name="name"
              value={currentData.name}
              onChange={this._handleFieldChanged}
            />
            {this._getValidateFeedback('name')}
          </div>
          <div className="form-group">
            <label htmlFor="profile_email">Email: <i className="text-danger">*</i></label>
            <input type="text" className="form-control"
              id="profile_email"
              name="email"
              value={currentData.email}
              onChange={this._handleFieldChanged}
            />
            {this._getValidateFeedback('email')}
          </div>
          <div className="form-group">
            <label htmlFor="profile_phone">Phone number: <i className="text-danger">*</i></label>
            <input type="text" className="form-control"
              id="profile_phone"
              name="phoneNumber"
              value={currentData.phoneNumber}
              onChange={this._handleFieldChanged}
            />
            {this._getValidateFeedback('phoneNumber')}
          </div>
          <div className="form-group text-center">
            <button className="btn btn-primary"
              disabled={isFetching || !Object.keys(editedData).length}
            >
              Save
            </button>
            <button type="button" className="btn btn-outline-primary ml-2"
              onClick={this._resetData}
              disabled={isFetching || !Object.keys(editedData).length}
            >Reset</button>
          </div>
        </form>
      </div>
    );
  };

  // Render message
  _renderMessage = () => {
    const { successMessage, errorMessage } = this.state;

    return (
      <div>
        {successMessage &&
          <Fade in={true}>
            <div className="alert alert-success shadow-sm">
              <i className="fal fa-check-circle"></i> {successMessage}
            </div>
          </Fade>
        }
        {errorMessage &&
          <Fade in={true}>
            <div className="alert alert-warning shadow-sm">
              <i className="fal fa-info-circle"></i> {errorMessage}
            </div>
          </Fade>
        }
      </div>
    );
  };

  _renderVerifySection = () => {
    const { isUploadingVerifyingImages } = this.state;
    const { contractor, verifyingImages } = this.props;

    const statusBsColor = contractor.status ? CONTRACTOR_STATUS_INFOS[contractor.status].bsColor : '';
    const statusName = contractor.status ? CONTRACTOR_STATUS_INFOS[contractor.status].name : '';

    return (
      <div>
        <h5 className="mb-2">Account verifying</h5>
        <div className="bg-white p-3 mb-3 position-relative">
          {isUploadingVerifyingImages &&
            <ComponentBlocking message="Uploading..." />
          }
          <div className="mb-2">
            Account status: <span className={`badge badge-pill badge-${statusBsColor}`}>{statusName}</span>
          </div>
          <div className="mb-3">
            <DropzoneUploadImage
              onChange={this._handleSelectVerifyingImages}
              height={100}
            />
          </div>
          <div className="row">
            {verifyingImages.isFetching &&
              <div className="col-md-12">
                <Skeleton height={200} />
              </div>
            }
            {verifyingImages.items.map(item => {
              return (
                <div key={item.id} className="col-md-6 my-1">
                  <div className="image-with-times image-169 border rounded">
                    <Image src={item.url} className="w-100" />
                    {item.verified &&
                      <span className="badge badge-primary badge-pill"><i className="fal fa-check-circle"></i> Verified</span>
                    }
                    {!item.verified &&
                      <span className="infos">
                        <span className="badge badge-info badge-pill"><i className="fal fa-info-circle"></i> Not verified</span>
                      </span>
                    }
                    {/* <span className="actions">
                      <button onClick={() => console.log('asdasd')} className="btn btn-sm bg-light btn-outline-danger shadow">
                        <i className="fas fa-times"></i>
                      </button>
                    </span> */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { isFetching } = this.state;

    return (
      <div className="container">
        {isFetching &&
          <ComponentBlocking />
        }
        <h5 className="my-3">Account information</h5>
        {this._renderMessage()}
        <div className="row">
          <div className="col-md-4">
            {this._renderAvatarSection()}
          </div>
          <div className="col-md-8">
            {this._renderFormSection()}
            {this._renderVerifySection()}
          </div>
        </div>
      </div>
    );
  }
}

Profile.props = {
  contractor: PropTypes.object.isRequired,
  updateUserInfo: PropTypes.func.isRequired,
  setVerifyingImageItems: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  const { authentication } = state;
  const { contractor, verifyingImages } = authentication;

  return {
    contractor,
    verifyingImages,
  };
};

const mapDispatchToProps = {
  updateUserInfo: authActions.loginSuccess,
  setVerifyingImageItems: authActions.setVerifyingImageItems,
  loadVerifyingImages: authActions.loadVerifyingImages,
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
