import React, { Component } from 'react';
import { connect } from "react-redux";


class EditEquipment extends Component {

  state = {
    equipment: {},
    editedData: {}
  };

  /**
   * Load equipment detail
   */
  _loadData = async () => {
    const { params } = this.props.match;
    const { id } = params;

    const data = await equipmentServices.getMaterialById(id);

    this.setState({
      equipment: data
    });
  };

  componentDidMount() {
    this._loadData();
  }
  
  /**
   * Handle on field change
   */
  _handleFieldChange = e => {
    let { name, value } = e.target;
    const { editedData } = this.state;

    this.setState({
      editedData: {
        ...editedData,
        [name]: value
      }
    });
  };

  /**
   * Reset edited data
   */
  _handleResetForm = () => {
    this.setState({
      editedData: {}
    });
  };
  
  /**
   * Handle submit form
   */
  _handleFormSubmit = async e => {
    e.preventDefault();
    const { equipment, editedData } = this.state;
    const data = {
      ...equipment,
      ...editedData
    };

    let result;
    try {
      this.setState({isFetching: true});
      result = await equipmentServices.updateMaterial(equipment.id, data);

      if (!result.id) {
        this.setState({
          isFetching: false,
          error: {
            ...result
          }
        });
      }
      
      this.setState({
        isFetching: false,
        isSuccess: true,
        equipment: data
      });
    } catch (error) {
      console.log(error);
      this.setState({
        isFetching: false,
        error
      });
    }
  };

  render() {
    const { equipment, editedData, isSuccess, isFetching, error } = this.state;

    const data = {
      ...equipment,
      ...editedData
    };

    return (
      <div className="container">
        <h1 className="my-3">Edit equipment: {equipment.name}</h1>
        <div className="row">
          <div className="col-md-4">
            <div className="bg-white px-2 py-3">
              <h4>Thumbnail image</h4>
              <Image className="w-100" src={equipment.thumbnailImageUrl || 'http://localhost:3060/public/upload/product-images/unnamed-19-jpg.jpg'} alt={`${equipment.name} thumbnail image`}/>
            </div>
          </div>
          <div className="col-md-8">
            <div className="bg-white px-2 py-3">
              {/* TODO: Add back to list link */}
              <h4>Information <button className="btn btn-sm btn-outline-info float-right"><i className="fal fa-chevron-left"></i> Back to list</button></h4>
              {isSuccess &&
                <div className="alert alert-success">Save successfully!</div>
              }
              {error &&
                <div className="alert alert-warning">{error.message}</div>
              }
              <form onSubmit={this._handleFormSubmit}>
                <div className="form-group">
                  <label htmlFor="equipment_name">Name:</label>
                  <input type="text" id="equipment_name" name="name" className="form-control"
                    value={data.name}
                    onChange={this._handleFieldChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="equipment_price">Price:</label>
                  <input type="text" id="equipment_price" name="price" className="form-control"
                    value={data.price}
                    onChange={this._handleFieldChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="equipment_unit">Unit:</label>
                  <input type="text" id="equipment_unit" name="unit" className="form-control"
                    value={data.unit}
                    onChange={this._handleFieldChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="equipment_construction">Construction:</label>
                  <input type="text" id="equipment_contruction" name="contruction" className="form-control"
                    value={data.construction ? data.construction.name : ''}
                    onChange={this._handleFieldChange}
                  />
                </div>
                <div className="form-group">
                  <button className="btn btn-primary" disabled={Object.keys(editedData).length === 0 || isFetching}><i className="fas fa-save"></i> Save</button>
                  <button className="btn btn-outline-primary ml-2" onClick={this._handleResetForm}><i className="fas fa-undo"></i> Reset</button>
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
    user
  };
};

export default connect(mapStateToProps)(EditEquipment);