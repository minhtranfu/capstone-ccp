import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Step from './Step';
import { fetchMaterialTypes } from '../../../redux/actions/thunks';

import ccpApiService from '../../../services/domain/ccp-api-service';

class AddEquipmentStep1 extends Step {
  state = {
    constructions: [],
    categories: []
  };

  formFields = {};

  componentDidMount() {
    this._loadMaterialTypes();
    this._loadConstructions();
    this._loadMaterialTypeCategories();

    setTimeout(() => {
      this.formFields.name.focus();
    }, 500);
  }

  _loadConstructions = async () => {
    const { contractor } = this.props;

    try {
      const constructions = await ccpApiService.getConstructionsByContractorId(contractor.id);
      this.setState({
        constructions
      });
    } catch (error) {
      alert('Error while loading constructions');
    }
  };

  _loadMaterialTypeCategories = async () => {

    try {
      const categories = await ccpApiService.materialServices.getMaterialTypeCategories();
      this.setState({
        categories
      });
    } catch (error) {
      alert('Error while loading categories');
    }
  };

  _loadMaterialTypes = () => {
    const { fetchMaterialTypes } = this.props;

    fetchMaterialTypes();
  };

  _onChangeDescription = (description) => {
    this.setState({ description });
  };

  _handleFieldChange = e => {
    const name = e.target.name;
    let value = e.target.value;

    if (name === 'constructionId') {
      this._handleSelectConstruction(value);
    }

    if (!isNaN(value)) {
      value = +value;
    }

    const newState = {
      [name]: value
    };

    if (name === 'address') {
      newState.isAddressEditted = true;
    }

    this.setState(newState);
  };

  _handleSubmitForm = () => {
    // Todo: Validate form

    this._handleStepDone({
      data: {
        ...this.state,
        constructions: undefined
      }
    });
  };

  // When select construction, change address of equipment too
  _handleSelectConstruction = constructionId => {
    const { isAddressEditted, constructions } = this.state;

    if (isAddressEditted) {
      return;
    }

    const selectedContruction = constructions.find(construction => +construction.id === +constructionId);
    this.setState({
      address: selectedContruction.address
    });
  };

  _getShowablePrice = (amount, decimalCount = 2, decimal = ".", thousands = ",") => {

    if (!amount) {
      return '';
    }

    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

      const negativeSign = amount < 0 ? "-" : "";

      let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;

      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
      return '';
    }
  };

  render() {
    const { entities } = this.props;
    const { constructions, categories, categoryId } = this.state;
    let selectedCategory = {};
    if (categoryId) {
      selectedCategory = categories.find(category => category.id === +categoryId);
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h4 className="my-3">General information</h4>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="">Material name: <i className="text-danger">*</i></label>
              <input ref={nameField => this.formFields.name = nameField} type="text" name="name" onChange={this._handleFieldChange} value={this.state.name || ''} className="form-control" maxLength="80" required autoFocus/>
            </div>
            <div className="form-group">
              <label htmlFor="">Construction: <i className="text-danger">*</i></label>
              <select name="constructionId" onChange={this._handleFieldChange} value={this.state.constructionId || ''} id="construction_id" className="form-control" required>
                <option value="">Choose...</option>
                {constructions.map(construction => <option key={construction.id} value={construction.id}>{construction.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="">Address: <i className="text-danger">*</i></label>
              <input type="text" name="address" onChange={this._handleFieldChange} value={this.state.address || ''} className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="">Material Category: <i className="text-danger">*</i></label>
              <select name="categoryId" onChange={this._handleFieldChange} data-live-search="true" value={this.state.categoryId || ''} id="equip_type_id" className="form-control selectpicker">
                <option value="0">Choose...</option>
                {categories && categories.map(cat => {
                  return (<option value={cat.id} key={cat.id}>{cat.name}</option>);
                })}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="">Material type: <i className="text-danger">*</i></label>
              <select name="materialTypeId" onChange={this._handleFieldChange} data-live-search="true" value={this.state.materialTypeId || ''} id="equip_type_id" className="form-control selectpicker">
                <option value="">Choose...</option>
                {selectedCategory && selectedCategory.materialTypes && selectedCategory.materialTypes.map(type => {
                  return (<option value={type.id} key={type.id}>{type.name}</option>);
                })}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="manufacturer">Manufacturer: <i className="text-danger">*</i></label>
              <input type="text" name="manufacturer" onChange={this._handleFieldChange} className="form-control" id="manufacturer" required />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price(K): <i className="text-danger">*</i></label>
              <input type="number" name="price" onChange={this._handleFieldChange} className="form-control" id="price" required />
            </div>
            <div className="form-group">
              <label htmlFor="unit">Unit: <i className="text-danger">*</i></label>
              <input type="text" name="unit" onChange={this._handleFieldChange} className="form-control" id="unit" required />
            </div>
          </div>
          <div className="col-12 text-center">
            <div className="form-group">
              <button className="btn btn-primary" onClick={this._handleSubmitForm}>NEXT STEP <i className="fal fa-chevron-right"></i></button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AddEquipmentStep1.propTypes = {
  entities: PropTypes.object.isRequired,
  fetchMaterialTypes: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  const { authentication, entities } = state;
  const { user } = authentication;
  const { contractor } = user;

  return {
    contractor,
    entities
  };
};

export default connect(mapStateToProps, {
  fetchMaterialTypes
})(AddEquipmentStep1);
