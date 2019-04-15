import React from "react";
import Step from "./Step";
import PropTypes from "prop-types";

import {
  fetchEquipmentTypes,
  fetchEquipmentTypeSpecs
} from "../../../redux/actions/thunks";
import { connect } from "react-redux";
import { equipmentServices } from "Services/domain/ccp";
import { DropzoneUploadImage, ComponentBlocking } from "Components/common";
import { getErrorMessage, getValidateFeedback } from "Utils/common.utils";
import validate from 'validate.js';

class AddEquipmentStep3 extends Step {
  state = {
    images: [],
    validateResult: {}
  };

  // Validate rules
  validateRules = {
    equipmentImages: {
      presence: {
        allowEmpty: false,
        message: '^Please upload at least one image'
      },
    },
    description: {
      presence: {
        allowEmpty: false
      }
    }
  };

  /**
   * Change field value in state
   * Delete validate feedback for the field
   */
  _handleFieldChange = e => {
    const { name, value } = e.target;
    const { validateResult } = this.state;
    this.setState({
      [name]: value,
      validateResult: {
        ...validateResult,
        [name]: undefined
      }
    });
  };

  /**
   * Upload equipment
   */
  _uploadImages = async files => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append("file", file);
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
      isFetching: true
    });
    try {
      // Upload images
      const uploadedImages = await this._uploadImages(selectedFiles);

      if (typeof selectedThumbnailIndex === 'undefined') {
        selectedThumbnailIndex = 0;
      }
  
      images = [
        ...images,
        ...uploadedImages
      ];
  
      // Update state, delete feedback message for images
      this.setState({
        images,
        selectedThumbnailIndex,
        isFetching: false,
        validateResult: {
          ...validateResult,
          equipmentImages: undefined
        }
      });

    } catch (error) {
      const errorMessage = getErrorMessage(error);
      this.setState({
        errorMessage,
        isFetching: false
      });
    }
  };

  // Validate form and call step done callback with step data
  _handleSubmitForm = async () => {
    const { images, description, selectedThumbnailIndex } = this.state;

    let data = {
      description,
      equipmentImages: images.map(image => ({id: image.id}))
    };

    // Validate form
    const validateResult = validate(data, this.validateRules);
    if (validateResult) {
      this.setState({
        validateResult
      });

      return;
    }

    data.thumbnailImage = {
      id: images[selectedThumbnailIndex].id
    };
    
    // Hanlde step done
    this._handleStepDone({
      data
    });
  };

  // Set image as thumbnail
  _handleSelectThumbnail = selectedThumbnailIndex => {
    this.setState({
      selectedThumbnailIndex
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
      selectedThumbnailIndex
    });
  };

  // Render list preview images
  _renderPreview = () => {
    const { images, selectedThumbnailIndex } = this.state;

    if (!images || images.length === 0) {
      return null;
    }

    const imageElements = images.map((file, index) => {
      const statusClass = index === selectedThumbnailIndex ? 'is-thumbnail border-primary border' : '';

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
              <i className="fas fa-times"></i>
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

  render() {
    const { isFetching, errorMessage, validateResult } = this.state;

    return (
      <div className="container">
        {isFetching &&
          <ComponentBlocking/>
        }
        <div className="row">
          <div className="col-md-12">
            <h4 className="my-3">More information</h4>
            {errorMessage &&
              <div className="alert alert-warning shadow-sm">
                <i className="fal fa-info-circle"></i> {errorMessage}
              </div>
            }
          </div>
          <div className="col-md-6">
            <label htmlFor="">Upload some photo of equipment</label>
            <DropzoneUploadImage onChange={this._handleSelectFiles} />
            {getValidateFeedback('equipmentImages', validateResult)}
            {this._renderPreview()}
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="">Description</label>
              <textarea
                tag="textarea"
                className="form-control"
                rows="8"
                name="description"
                value={this.state.description || ""}
                onChange={this._handleFieldChange}
              />
              {getValidateFeedback('description', validateResult)}
            </div>
          </div>
          <div className="col-md-12 text-center">
            <div className="form-group">
              <button
                className="btn btn-outline-primary mr-2"
                onClick={this._handleBackStep}
              >
                <i className="fal fa-chevron-left" /> PREVIOUS STEP
              </button>
              <button
                className="btn btn-primary ml-2"
                onClick={this._handleSubmitForm}
              >
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
  entities: PropTypes.object.isRequired
};

export default connect(
  state => {
    return { entities: { ...state.entities } };
  },
  { fetchEquipmentTypes, fetchEquipmentTypeSpecs }
)(AddEquipmentStep3);
