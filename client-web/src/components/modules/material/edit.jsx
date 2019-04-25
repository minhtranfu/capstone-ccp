import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet-async';

import { materialServices } from 'Src/services/domain/ccp';
import { Image, ComponentBlocking } from 'Components/common';

class MaterialEdit extends Component {
  state = {
    material: {},
    editedData: {},
  };

  /**
   * Load material detail
   */
  _loadData = async () => {
    const { params } = this.props.match;
    const { id } = params;

    const data = await materialServices.getMaterialById(id);

    this.setState({
      material: data,
    });
  };

  componentDidMount() {
    this._loadData();
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
      console.log(value);
      if (Number.isNaN(m)) {
        return false;
      }
      value = +m;
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

    let result;
    try {
      this.setState({
        isFetching: true,
        isSuccess: undefined,
        error: undefined,
      });
      result = await materialServices.updateMaterial(material.id, data);

      if (!result.id) {
        this.setState({
          isFetching: false,
          error: {
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
      console.log(error);
      this.setState({
        isFetching: false,
        error,
      });
    }
  };

  render() {
    const { material, editedData, isSuccess, isFetching, error } = this.state;

    const data = {
      ...material,
      ...editedData,
    };

    return (
      <div className="container">
        <Helmet>
          <title>{`Edit material: ${material.name}`}</title>
        </Helmet>
        <h4 className="my-3">Edit material: {material.name}</h4>
        <div className="row">
          <div className="col-md-4">
            <div className="bg-white p-3 shadow-sm">
              <h6 className="pb-2 border-bottom">Thumbnail image</h6>
              <Image
                className="w-100"
                src={
                  material.thumbnailImageUrl ||
                  'http://localhost:3060/public/upload/product-images/unnamed-19-jpg.jpg'
                }
                alt={`${material.name} thumbnail image`}
              />
              <div className="mt-2 text-center">
                <button className="btn btn-outline-primary">Change</button>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="bg-white p-3 shadow-sm position-relative">
              {isFetching &&
                <ComponentBlocking />
              }
              {/* TODO: Add back to list link */}
              <h6 className="pb-2 border-bottom">
                Information{' '}
                <button className="btn btn-link btn-sm float-right">
                  <i className="fal fa-chevron-left" /> Back to list
                </button>
              </h6>
              {isSuccess && <div className="alert alert-success">Save successfully!</div>}
              {error && <div className="alert alert-warning">{error.message}</div>}
              <form onSubmit={this._handleFormSubmit}>
                <div className="form-group">
                  <label htmlFor="material_name">Name:</label>
                  <input
                    type="text"
                    id="material_name"
                    name="name"
                    className="form-control"
                    value={data.name}
                    onChange={this._handleFieldChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="material_price">Price:</label>
                  <input
                    type="text"
                    id="material_price"
                    name="price"
                    className="form-control"
                    value={data.price}
                    onChange={this._handleFieldChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="material_construction">Construction:</label>
                  <input
                    type="text"
                    id="material_contruction"
                    name="contruction"
                    className="form-control"
                    value={data.construction ? data.construction.name : ''}
                    onChange={this._handleFieldChange}
                  />
                </div>
                <div className="form-group mb-0 text-center">
                  <button
                    className="btn btn-primary"
                    disabled={Object.keys(editedData).length === 0 || isFetching}
                  >
                    <i className="fas fa-save" /> Save
                  </button>
                  <button className="btn btn-outline-primary ml-2" onClick={this._handleResetForm}>
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
  const { user } = authentication;

  return {
    user,
  };
};

export default connect(mapStateToProps)(MaterialEdit);
