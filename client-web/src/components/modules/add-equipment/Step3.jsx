import React from 'react';
import Step from './Step';
import PropTypes from 'prop-types';
import { UncontrolledTooltip } from 'reactstrap';

import { fetchEquipmentTypes, fetchEquipmentTypeSpecs } from 'Redux/actions/thunks';
import { connect } from 'react-redux';
import { equipmentServices } from 'Services/domain/ccp';
import { DropzoneUploadImage, ComponentBlocking } from 'Components/common';
import { getErrorMessage, getValidateFeedback } from 'Utils/common.utils';
import validate from 'validate.js';
import { formatPrice } from 'Utils/format.utils';

class AddEquipmentStep3 extends Step {
  state = {
    images: [],
    validateResult: {},
    isGettingSuggestedPrice: false,
    suggestedPrice: 0,
  };

  // Validate rules
  validateRules = {
    equipmentImages: {
      presence: {
        allowEmpty: false,
        message: '^Please upload at least one image',
      },
    },
    description: {
      presence: {
        allowEmpty: false,
      },
    },
    dailyPrice: {
      presence: {
        allowEmpty: false,
        message: 'is required',
      },
      numericality: {
        greaterThan: 0,
      },
    },
  };

  /**
   * Change field value in state
   * Delete validate feedback for the field
   */
  _handleFieldChange = e => {
    let { name, value } = e.target;
    const { validateResult } = this.state;

    const newState = {
      validateResult: {
        ...validateResult,
        [name]: undefined,
      },
    };

    if (name === 'dailyPrice') {
      value = +`${value}`.replace(/[^0-9\.]+/g, '');
      if (Number.isNaN(value)) {
        return;
      }
      // TODO: Format price
      // newState.showableDailyPrice = formatPrice(`${value}`);
      if (value !== 0) {
        // newState.showableDailyPrice = +value;
        newState.showableDailyPrice = formatPrice(`${value}`, false);
      }
    }
    newState[name] = value;

    this.setState(newState);
  };

  /**
   * Upload equipment
   */
  _uploadImages = async files => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('file', file);
    });

    const images = await equipmentServices.uploadEquipmentImage(formData);
    return images;
  };

  // Upload selected images and set to state
  _handleSelectFiles = async selectedFiles => {
    let { selectedThumbnailIndex, images, validateResult } = this.state;

    if (!selectedFiles || !selectedFiles.length) {
      return;
    }

    this.setState({
      isFetching: true,
    });
    try {
      // Upload images
      const uploadedImages = await this._uploadImages(selectedFiles);

      if (typeof selectedThumbnailIndex === 'undefined') {
        selectedThumbnailIndex = 0;
      }

      images = [...images, ...uploadedImages];

      // Update state, delete feedback message for images
      this.setState({
        images,
        selectedThumbnailIndex,
        isFetching: false,
        validateResult: {
          ...validateResult,
          equipmentImages: undefined,
        },
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      this.setState({
        errorMessage,
        isFetching: false,
      });
    }
  };

  // Validate form and call step done callback with step data
  _handleSubmitForm = async () => {
    const { images, description, selectedThumbnailIndex, dailyPrice } = this.state;

    let data = {
      dailyPrice,
      description,
      equipmentImages: images.map(image => ({ id: image.id })),
    };

    // Validate form
    const validateResult = validate(data, this.validateRules);
    if (validateResult) {
      this.setState({
        validateResult,
      });

      return;
    }

    data.thumbnailImage = {
      id: images[selectedThumbnailIndex].id,
    };

    // Hanlde step done
    this._handleStepDone({
      data,
    });
  };

  // Set image as thumbnail
  _handleSelectThumbnail = selectedThumbnailIndex => {
    this.setState({
      selectedThumbnailIndex,
    });
  };

  // Delete image by index
  _deleteImage = needDeleted => {
    let { images, selectedThumbnailIndex } = this.state;

    if (needDeleted === selectedThumbnailIndex) {
      selectedThumbnailIndex = 0;
    }

    images = images.filter((file, index) => index !== needDeleted);
    this.setState({
      images,
      selectedThumbnailIndex,
    });
  };

  // Render list preview images
  _renderPreview = () => {
    const { images, selectedThumbnailIndex } = this.state;

    if (!images || images.length === 0) {
      return null;
    }

    const imageElements = images.map((file, index) => {
      const statusClass =
        index === selectedThumbnailIndex ? 'is-thumbnail border-primary border' : '';

      return (
        <div key={index} className="col-6 col-lg-3 my-2">
          <div className={`cursor-pointer position-relative ${statusClass}`}>
            <img
              className="w-100"
              tabIndex="0"
              src={file.url}
              onClick={() => this._handleSelectThumbnail(index)}
              onKeyUp={e => {
                if (e.keyCode === 32 || e.keyCode === 13) {
                  this._handleSelectThumbnail(index);
                }
              }}
            />
            <button
              className="btn btn-link top-right-button text-danger"
              onClick={() => this._deleteImage(index)}
            >
              <i className="fas fa-times" />
            </button>
          </div>
        </div>
      );
    });

    return (
      <div className="my-2 row">
        <h6 className="col-12">Select a thumbnail</h6>
        {imageElements}
      </div>
    );
  };

  _getSuggestedPrice = async () => {
    const { currentState } = this.props;

    this.setState({
      isGettingSuggestedPrice: true,
      suggestPriceError: undefined,
    });

    // Prepare data for suggestion
    const suggestData = {
      equipmentType: {
        id: +currentState.equipmentTypeId,
      },
      additionalSpecsValues: currentState.additionalSpecsValues,
    };

    try {
      const suggestResult = await equipmentServices.getEquipmentSuggestedPrice(suggestData);

      this.setState({
        isGettingSuggestedPrice: false,
        suggestedPrice: +suggestResult.suggestedPrice.toFixed(0),
      });
    } catch (error) {
      const suggestPriceError = getErrorMessage(error);

      this.setState({
        suggestPriceError,
        isGettingSuggestedPrice: false,
      });
    }
  };

  _handleGetSuggestedPrice = prevProps => {
    const { isShown } = this.props;

    if (!isShown || prevProps.isShown) {
      return;
    }

    this._getSuggestedPrice();
  };

  componentDidUpdate(prevProps) {
    this._handleGetSuggestedPrice(prevProps);
  }

  render() {
    const {
      isFetching,
      errorMessage,
      validateResult,
      isGettingSuggestedPrice,
      suggestedPrice,
      suggestPriceError,
    } = this.state;

    return (
      <div className="container">
        {isFetching && <ComponentBlocking />}
        {isGettingSuggestedPrice && <ComponentBlocking message="Getting suggested price..." />}
        <div className="row">
          <div className="col-md-12">
            <h4 className="my-3">More information</h4>
            {errorMessage && (
              <div className="alert alert-warning shadow-sm">
                <i className="fal fa-info-circle" /> {errorMessage}
              </div>
            )}
            {suggestPriceError && (
              <div className="alert alert-warning shadow-sm">
                <i className="fal fa-info-circle" /> {suggestPriceError}{' '}
                <button
                  className="btn btn-sm btn-outline-primary ml-2"
                  onClick={this._getSuggestedPrice}
                >
                  Retry
                </button>
              </div>
            )}
          </div>
          <div className="col-md-6">
            <label htmlFor="">Upload some photo of equipment</label>
            <DropzoneUploadImage onChange={this._handleSelectFiles} />
            {getValidateFeedback('equipmentImages', validateResult)}
            {this._renderPreview()}
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="daily_price">
                Price per day (K): <i className="text-danger">*</i>
              </label>
              {suggestedPrice > 0 &&
                <div className="mb-2">
                  <span className="text-muted">Suggested price:</span>
                  <span className="ml-1 text-primary">
                    <strong>
                      {formatPrice(suggestedPrice - 0.05 * suggestedPrice, true, 0)} ~{' '}
                      {formatPrice(suggestedPrice + 0.05 * suggestedPrice, true, 0)}
                    </strong>
                  </span>
                  <i className="fal fa-question-circle text-muted ml-1" id="about_suggested_price" />
                  <UncontrolledTooltip target="about_suggested_price">
                    Suggested price base on recently market
                  </UncontrolledTooltip>
                </div>
              }
              <input
                type="string"
                name="dailyPrice"
                onChange={this._handleFieldChange}
                value={this.state.showableDailyPrice}
                className="form-control"
                id="daily_price"
              />
              {getValidateFeedback('dailyPrice', validateResult)}
            </div>
            <div className="form-group">
              <label htmlFor="">Description</label>
              <textarea
                tag="textarea"
                className="form-control"
                rows="8"
                name="description"
                value={this.state.description || ''}
                onChange={this._handleFieldChange}
              />
              {getValidateFeedback('description', validateResult)}
            </div>
          </div>
          <div className="col-md-12 text-center">
            <div className="form-group">
              <button className="btn btn-outline-primary mr-2" onClick={this._handleBackStep}>
                <i className="fal fa-chevron-left" /> PREVIOUS STEP
              </button>
              <button className="btn btn-primary ml-2" onClick={this._handleSubmitForm}>
                POST EQUIPMENT <i className="fal fa-paper-plane" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AddEquipmentStep3.propTypes = {
  entities: PropTypes.object.isRequired,
};

export default connect(
  state => {
    return { entities: { ...state.entities } };
  },
  { fetchEquipmentTypes, fetchEquipmentTypeSpecs }
)(AddEquipmentStep3);
