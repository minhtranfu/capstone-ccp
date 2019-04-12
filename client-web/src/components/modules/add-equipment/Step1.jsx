import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import validate from 'validate.js';

import 'bootstrap-daterangepicker/daterangepicker.css';
import DateRangePicker from 'react-bootstrap-daterangepicker';

import Step from './Step';
import { fetchEquipmentTypes } from '../../../redux/actions/thunks';
import { ENTITY_KEY } from '../../../common/app-const';

import ccpApiService from '../../../services/domain/ccp-api-service';
import { getValidateFeedback } from 'Utils/common.utils';

class AddEquipmentStep1 extends Step {
  constructor(props) {
    super(props);

    this.state = {
      constructions: [],
      categories: [],
      availableTimeRanges: [{}],
      validateResult: {}
    };
  }

  validateRules = {
    name: {
      presence: {
        allowEmpty: false
      }
    },
    constructionId: {
      presence: {
        allowEmpty: false,
        message: 'is required'
      }
    },
    address: {
      presence: {
        allowEmpty: false
      }
    },
    equipmentTypeId: {
      presence: {
        allowEmpty: false,
        message: 'is required'
      }
    },
    dailyPrice: {
      presence: {
        allowEmpty: false,
        message: 'is required'
      },
      numericality: {
        greaterThan: 0
      }
    },
    availableTimeRanges: {
      presence: {
        allowEmpty: false,
        message: 'is required'
      },
    }
  };

  componentDidMount() {
    this._loadEquipmentTypes();
    this._loadConstructions();
    this._loadEquipmentTypeCategories();
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

  // Load equipment type categories
  _loadEquipmentTypeCategories = async () => {

    try {
      const categories = await ccpApiService.getEquipmentTypeCategories();
      this.setState({
        categories
      });
    } catch (error) {
      alert('Error while loading categories');
    }
  };

  // Load equipment
  _loadEquipmentTypes = () => {
    const { fetchEquipmentTypes } = this.props;

    fetchEquipmentTypes();
  };

  // Handle select date range
  _onChangeDateRanage = (picker, rangeId) => {
    let { availableTimeRanges } = this.state;
    if (!availableTimeRanges) {
      availableTimeRanges = [];
    }

    availableTimeRanges[rangeId] = {
      beginDate: picker.startDate.format('YYYY-MM-DD'),
      endDate: picker.endDate.format('YYYY-MM-DD')
    };

    this.setState({
      availableTimeRanges
    });
  };

  // Get date range in string by range id
  _getLabelOfRange = (rangeId) => {
    const { availableTimeRanges } = this.state;
    if (availableTimeRanges == undefined || availableTimeRanges.length == 0) {
      return '';
    }

    const range = availableTimeRanges[rangeId];
    if (range == undefined || !range.beginDate) {
      return '';
    }

    const { beginDate, endDate } = range;

    return `${beginDate} - ${endDate}`;
  }

  // Change value of field in state
  _handleFieldChange = e => {
    const name = e.target.name;
    let value = e.target.value;
    const newState = {};

    if (name === 'constructionId') {
      this._handleSelectConstruction(value);
    }

    if (name === 'address') {
      newState.isAddressEditted = true;
    } else if (name === 'dailyPrice') {
      value = value.replace(/[^0-9\.]+/g, '');
      newState.showableDailyPrice = value;
    }

    if (!isNaN(value)) {
      value = +value;
    }

    newState[name] = value;

    this.setState(newState);
  };

  // Validate and call back step done
  _handleSubmitForm = () => {
    const { availableTimeRanges } = this.state;
    const data = {
      ...this.state,
      availableTimeRanges: availableTimeRanges.filter(range => !!range.beginDate),
      constructions: undefined,
      validateResult: undefined
    };
    
    // Validate form
    let validateResult = validate(data, this.validateRules);
    
    // Validate timerange
    let isSelectATimeRange = false;
    availableTimeRanges.forEach(range => {
      if (range.beginDate) {
        isSelectATimeRange = true;
      }
    });
    if (!isSelectATimeRange && (!validateResult || !validateResult.availableTimeRanges)) {
      if (!validateResult) {
        validateResult = {};
      }
      validateResult.availableTimeRanges = 'Please select at least time range!';
    }

    if (validateResult) {
      this.setState({
        validateResult
      });
      return;
    }

    this.setState({
      validateResult
    }, () => {
      this._handleStepDone({ data });
    });
  };

  // render list date range picker with remove option
  _renderDateRangePickers = () => {
    let { availableTimeRanges } = this.state;
    const numOfRange = availableTimeRanges.length;

    return availableTimeRanges.map((range, i) => {
      return (
        <div key={i} className="input-group date-range-picker mb-4">
          <DateRangePicker minDate={moment()} onApply={(e, picker) => this._onChangeDateRanage(picker, i)} containerClass="custom-file" autoApply alwaysShowCalendars>
          {/* <input type="text" className="form-control" readOnly value={this._getLabelOfRange(i) || ''} /> */}
            <input type="text" className="custom-file-input" id={`inputDate${i}`} />
            <label className="custom-file-label" htmlFor={`inputDate${i}`} aria-describedby={`inputDate${i}`}>{this._getLabelOfRange(i) || 'Select time range'}</label>
          </DateRangePicker>
          {numOfRange > 1 &&
            <div className="input-group-append">
              <button className="btn btn-outline-danger" onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                this._removeTimeRangePicker(i);
                return false;
              }}><i className="fal fa-trash"></i></button>
            </div>
          }
        </div>
      );
    });
  };

  // Add one date range
  _addTimeRangePicker = () => {
    const { availableTimeRanges } = this.state;

    this.setState({
      availableTimeRanges: [
        ...availableTimeRanges,
        {}
      ]
    });
  };

  // Remove one date range by id
  _removeTimeRangePicker = rangeId => {
    let { availableTimeRanges } = this.state;
    availableTimeRanges = availableTimeRanges.filter((range, id) => id !== rangeId);

    this.setState({
      availableTimeRanges
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

  render() {
    const { entities } = this.props;
    const equipmentTypes = entities[ENTITY_KEY.EQUIPMENT_TYPES];
    const { constructions, categories, categoryId, validateResult } = this.state;

    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h4 className="my-3">General information</h4>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="">Equipment name: <i className="text-danger">*</i></label>
              <input type="text" name="name" onChange={this._handleFieldChange} value={this.state.name || ''} className="form-control" maxLength="80" required />
              {getValidateFeedback('name', validateResult)}
            </div>
            <div className="form-group">
              <label htmlFor="">Construction: <i className="text-danger">*</i></label>
              <select name="constructionId" onChange={this._handleFieldChange} value={this.state.constructionId || ''} id="construction_id" className="form-control" required>
                <option value="">Choose...</option>
                {constructions.map(construction => <option key={construction.id} value={construction.id}>{construction.name}</option>)}
              </select>
              {getValidateFeedback('constructionId', validateResult)}
            </div>
            <div className="form-group">
              <label htmlFor="">Address: <i className="text-danger">*</i></label>
              <input type="text" name="address" onChange={this._handleFieldChange} value={this.state.address || ''} className="form-control" />
              {getValidateFeedback('address', validateResult)}
            </div>
            <div className="form-group">
              <label htmlFor="">Equipment Category: </label>
              <select name="categoryId" onChange={this._handleFieldChange} data-live-search="true" value={this.state.categoryId || ''} id="equip_type_id" className="form-control selectpicker">
                <option value="0">Choose...</option>
                {categories && categories.map(cat => {
                  return (<option value={cat.id} key={cat.id}>{cat.name}</option>);
                })}
              </select>
              {getValidateFeedback('categoryId', validateResult)}
            </div>
            <div className="form-group">
              <label htmlFor="">Equipment type: <i className="text-danger">*</i></label>
              <select name="equipmentTypeId" onChange={this._handleFieldChange} data-live-search="true" value={this.state.equipmentTypeId || ''} id="equip_type_id" className="form-control selectpicker">
                <option value="">Choose...</option>
                {equipmentTypes && equipmentTypes.data && equipmentTypes.data.map(type => {

                  if (!!categoryId && type.generalEquipment.id !== categoryId) {
                    return null;
                  }

                  return (<option value={type.id} key={type.id}>{type.name}</option>);
                })}
              </select>
              {getValidateFeedback('equipmentTypeId', validateResult)}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="daily_price">Price per day (K): <i className="text-danger">*</i></label>
              <input type="string" name="dailyPrice" onChange={this._handleFieldChange} value={this.state.showableDailyPrice} className="form-control text-right" id="daily_price" />
              {getValidateFeedback('dailyPrice', validateResult)}
            </div>
            <div className="form-group">
              <label htmlFor="">Available time:</label>
              {this._renderDateRangePickers()}
              {getValidateFeedback('availableTimeRanges', validateResult)}
            </div>
            <div className="form-group text-center">
              <button className="btn btn-outline-primary mt-4" onClick={this._addTimeRangePicker}><i className="fal fa-plus"></i> Add more time range</button>
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
  fetchEquipmentTypes: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  const { authentication, entities } = state;
  const { contractor } = authentication;

  return {
    contractor,
    entities
  };
};

export default connect(mapStateToProps, {
  fetchEquipmentTypes
})(AddEquipmentStep1);
