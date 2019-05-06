import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet-async';
import validate from 'validate.js';

import { Image, ComponentBlocking, DropzoneUploadImage } from 'Components/common';
import { getErrorMessage, getValidateFeedback } from 'Utils/common.utils';
import CcpApiService from 'Services/domain/ccp-api-service';
import { materialServices } from 'Services/domain/ccp';

class MaterialEdit extends Component {
  state = {
    material: {},
    editedData: {},
    loadedDataNum: 0,
  };

  validateRules = {
    name: {
      presence: {
        allowEmpty: false,
      },
    },
    manufacturer: {
      presence: {
        allowEmpty: false,
      },
    },
    price: {
      presence: {
        allowEmpty: false,
        message: 'is required',
      },
      numericality: {
        greaterThan: 0,
      },
    },
    construction: {
      presence: {
        allowEmpty: false,
        message: '^Please select a construction',
      },
    },
    description: {
      presence: {
        allowEmpty: false,
      },
    },
  };

  /**
   * Load material detail
   */
  _loadData = async () => {
    const { params } = this.props.match;
    const { id } = params;

    try {
      const material = await materialServices.getMaterialById(id);
      let { loadedDataNum } = this.state;

      this.setState({
        material,
        loadedDataNum: ++loadedDataNum,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);

      this.setState({
        errorMessage,
        isFetching: false,
      });
    }
  };

  _loadConstructions = async () => {
    const { contractor } = this.props;

    try {
      const constructions = await CcpApiService.getConstructionsByContractorId(contractor.id);
      let { loadedDataNum } = this.state;

      this.setState({
        constructions,
        loadedDataNum: ++loadedDataNum,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);

      this.setState({
        errorMessage,
        isFetching: false,
      });
    }
  };

  _loadMaterialTypeCategories = async () => {
    try {
      const categories = await materialServices.getMaterialTypeCategories();
      let { loadedDataNum } = this.state;

      this.setState({
        categories,
        loadedDataNum: ++loadedDataNum,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);

      this.setState({
        errorMessage,
        isFetching: false,
      });
    }
  };

  componentDidMount() {
    this._loadData();
    this._loadConstructions();
    this._loadMaterialTypeCategories();
  }

  /**
   * Handle on field change
   */
  _handleFieldChange = e => {
    e.preventDefault();
    let { name, value } = e.target;
    const { editedData } = this.state;

    if (name === 'price') {
      let m = value;
      if (Number.isNaN(m)) {
        return false;
      }
      value = +m;
    } else if (name === 'construction' || name === 'materialType') {
      value = {
        id: +value,
      };
    }

    this.setState({
      editedData: {
        ...editedData,
        [name]: value,
      },
    });
  };

  /**
   * Reset edited data
   */
  _handleResetForm = () => {
    this.setState({
      editedData: {},
    });
  };

  /**
   * Handle submit form
   */
  _handleFormSubmit = async e => {
    e.preventDefault();
    let { material, editedData } = this.state;

    const data = {
      ...material,
      ...editedData,
    };
    delete data.categoryId;

    const validateResult = validate(data, this.validateRules);
    if (validateResult) {
      console.log(validateResult);
      this.setState({
        validateResult,
      });
      return;
    }

    let result;
    try {
      this.setState({
        isFetching: true,
        isSuccess: undefined,
        errorMessage: undefined,
      });
      result = await materialServices.updateMaterial(material.id, data);

      if (!result.id) {
        this.setState({
          isFetching: false,
          errorMessage: {
            ...result,
          },
        });
      }

      this.setState({
        isFetching: false,
        isSuccess: true,
        material: data,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      this.setState({
        isFetching: false,
        errorMessage,
      });
    }
  };

  /**
   * Upload and add image into equipment on user select images
   */
  _handleFilesSelected = async files => {
    const { material } = this.state;

    if (!Array.isArray(files) || files.length === 0) {
      return;
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append('file', file);
    });

    this.setState({
      isChangingImage: true,
      changeImageError: null,
    });

    // Upload images
    try {
      const images = await CcpApiService.uploadImage(formData);
      const thumbnailImageUrl = images[0];
      const materialResult = await materialServices.updateMaterial(material.id, {
        ...material,
        thumbnailImageUrl,
      });

      this.setState({
        isChangingImage: false,
        material: materialResult,
        showDropZone: false,
      });
    } catch (error) {
      const changeImageError = getErrorMessage(error);
      this.setState({
        changeImageError,
        isChangingImage: false,
      });
    }
  };

  render() {
    const {
      material,
      editedData,
      isSuccess,
      isFetching,
      errorMessage,
      validateResult,
      loadedDataNum,
      constructions,
      categories,
      showDropZone,
      isChangingImage,
      changeImageError,
    } = this.state;

    const data = {
      ...material,
      ...editedData,
    };

    let selectedCategory = {};
    if (data.categoryId) {
      selectedCategory = categories.find(category => category.id === +data.categoryId);
    } else if (categories && data.materialType) {
      selectedCategory = categories.find(category => {
        if (category.materialTypes) {
          return category.materialTypes.find(type => type.id === data.materialType.id);
        }
        return false;
      });
    }
    if (selectedCategory && selectedCategory.id) {
      data.categoryId = selectedCategory.id;
    }
    let selectedType = {};

    return (
      <div className="container">
        {loadedDataNum !== 3 && <ComponentBlocking message="Loading..." />}
        <Helmet>
          <title>{`Edit material: ${material.name}`}</title>
        </Helmet>
        <h4 className="my-3">Edit material: {material.name}</h4>
        <div className="row">
          <div className="col-md-4">
            <div className="bg-white p-3 shadow-sm position-relative">
              {isChangingImage && <ComponentBlocking message="Uploading..." />}
              <h6 className="pb-2 border-bottom">Thumbnail image</h6>
              {changeImageError && (
                <div className="my-2 alert alert-warning">
                  <i className="fal fa-info-circle" /> {changeImageError}
                </div>
              )}
              {showDropZone && <DropzoneUploadImage onChange={this._handleFilesSelected} />}
              {!showDropZone && (
                <div>
                  <Image
                    className="w-100"
                    src={material.thumbnailImageUrl || ''}
                    alt={`${material.name} thumbnail image`}
                  />
                  <div className="mt-2 text-center">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => this.setState({ showDropZone: true })}
                    >
                      Change
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="col-md-8">
            <div className="bg-white p-3 shadow-sm position-relative mb-2">
              {isFetching && <ComponentBlocking />}
              {/* TODO: Add back to list link */}
              <h6 className="pb-2 border-bottom">
                Information{' '}
                <button className="btn btn-link btn-sm float-right">
                  <i className="fal fa-chevron-left" /> Back to list
                </button>
              </h6>
              {isSuccess && <div className="alert alert-success">Save successfully!</div>}
              {errorMessage && <div className="alert alert-warning">{errorMessage}</div>}
              <form onSubmit={this._handleFormSubmit}>
                <div className="form-group">
                  <label htmlFor="material_name">
                    Name: <i className="text-danger">*</i>
                  </label>
                  <input
                    type="text"
                    id="material_name"
                    name="name"
                    className="form-control"
                    value={data.name || ''}
                    onChange={this._handleFieldChange}
                  />
                  {getValidateFeedback('name', validateResult)}
                </div>
                <div className="form-group">
                  <label htmlFor="material_construction">
                    Manufacturer: <i className="text-danger">*</i>
                  </label>
                  <input
                    type="text"
                    id="material_manufacturer"
                    name="manufacturer"
                    className="form-control"
                    value={data.manufacturer || ''}
                    onChange={this._handleFieldChange}
                  />
                  {getValidateFeedback('manufacturer', validateResult)}
                </div>
                <div className="form-group">
                  <label htmlFor="material_construction">
                    Construction: <i className="text-danger">*</i>
                  </label>
                  <select
                    value={data.construction ? data.construction.id : ''}
                    onChange={this._handleFieldChange}
                    name="construction"
                    id="material_construction"
                    className="form-control"
                  >
                    {constructions &&
                      constructions.map(construction => (
                        <option key={construction.id} value={construction.id}>
                          {construction.name}
                        </option>
                      ))}
                  </select>
                  {getValidateFeedback('construction', validateResult)}
                </div>
                <div className="form-group">
                  <label htmlFor="material_category">
                    Material Category: <i className="text-danger">*</i>
                  </label>
                  <select
                    id="material_category"
                    name="categoryId"
                    onChange={this._handleFieldChange}
                    value={data.categoryId || ''}
                    className="form-control"
                  >
                    {categories &&
                      categories.map(cat => {
                        return (
                          <option value={cat.id} key={cat.id}>
                            {cat.name}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="material_type">
                    Material type: <i className="text-danger">*</i>
                  </label>
                  <select
                    name="materialType"
                    onChange={this._handleFieldChange}
                    value={data.materialType ? data.materialType.id : ''}
                    className="form-control"
                  >
                    {selectedCategory &&
                      selectedCategory.materialTypes &&
                      selectedCategory.materialTypes.map(type => {
                        if (data.materialType && data.materialType.id === type.id) {
                          selectedType = type;
                        }

                        return (
                          <option value={type.id} key={type.id}>
                            {type.name}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="material_price">
                    Price (K/{selectedType.unit}): <i className="text-danger">*</i>
                  </label>
                  <input
                    type="text"
                    id="material_price"
                    name="price"
                    className="form-control"
                    value={data.price || ''}
                    onChange={this._handleFieldChange}
                  />
                  {getValidateFeedback('price', validateResult)}
                </div>
                <div className="form-group">
                  <label htmlFor="material_construction">
                    Description: <i className="text-danger">*</i>
                  </label>
                  <textarea
                    id="material_description"
                    name="description"
                    className="form-control"
                    value={data.description || ''}
                    onChange={this._handleFieldChange}
                  />
                  {getValidateFeedback('description', validateResult)}
                </div>
                <div className="form-group mb-0 text-center">
                  <button
                    className="btn btn-primary"
                    disabled={Object.keys(editedData).length === 0 || isFetching}
                  >
                    <i className="fas fa-save" /> Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary ml-2"
                    onClick={this._handleResetForm}
                  >
                    <i className="fas fa-undo" /> Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { authentication } = state;
  const { contractor } = authentication;

  return {
    contractor,
  };
};

export default connect(mapStateToProps)(MaterialEdit);
