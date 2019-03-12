import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';
// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

import 'bootstrap-daterangepicker/daterangepicker.css';
import DateRangePicker from 'react-bootstrap-daterangepicker';

import Step from './Step';
import { fetchEquipmentTypes, fetchEquipmentTypeSpecs } from '../../../redux/actions/thunks';
import { ENTITY_KEY } from '../../../common/app-const';

import ccpApiService from '../../../services/domain/ccp-api-service';

class AddEquipmentStep1 extends Step {
  constructor(props) {
    super(props);

    this.state = {
      constructions: [],
      availableTimeRanges: [
        {}
      ]
    };
  }

  componentDidMount() {
    this._loadEquipmentTypes();
    this._loadConstructions();
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

  _loadEquipmentTypes = () => {
    const { fetchEquipmentTypes } = this.props;

    fetchEquipmentTypes();
  };

  _onChangeDescription = (description) => {
    this.setState({ description });
  };

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

  _renderDateRangePickers = () => {
    const { availableTimeRanges } = this.state;
    const numOfRange = availableTimeRanges.length;

    return availableTimeRanges.map((range, i) => {
      return (
        <div className="form-group" key={i}>
          <label htmlFor="">Available time:</label>
          <div className="input-group date-range-picker">
            <DateRangePicker minDate={moment()} onApply={(e, picker) => this._onChangeDateRanage(picker, i)} containerClass="custom-file" autoApply alwaysShowCalendars>
            {/* <input type="text" className="form-control" readOnly value={this._getLabelOfRange(i) || ''} /> */}
              <input type="text" class="custom-file-input" id={`inputDate${i}`} />
              <label className="custom-file-label" for={`inputDate${i}`} aria-describedby={`inputDate${i}`}>{this._getLabelOfRange(i) || 'Select time range'}</label>
            </DateRangePicker>
            {numOfRange > 1 &&
              <div className="input-group-append">
                <button className="btn btn-outline-danger" onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  this._removeTimeRangePicker(i);
                  return false;
                }}><i className="fa fa-trash"></i></button>
              </div>
            }
          </div>
        </div>
      );
    });
  };

  _addTimeRangePicker = () => {
    const { availableTimeRanges } = this.state;

    this.setState({
      availableTimeRanges: [
        ...availableTimeRanges,
        {}
      ]
    });
  };

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
    const equipmentTypes = entities[ENTITY_KEY.EQUIPMENT_TYPES];
    const { constructions } = this.state;

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
              <label htmlFor="">Equipment type: <i className="text-danger">*</i></label>
              <select name="equipmentTypeId" onChange={this._handleFieldChange} data-live-search="true" value={this.state.equipmentTypeId || ''} id="equip_type_id" className="form-control selectpicker">
                <option value="">Choose...</option>
                {equipmentTypes && equipmentTypes.data && equipmentTypes.data.map(type => {
                  return (<option value={type.id} key={type.id}>{type.name}</option>);
                })}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="daily_price">Price per day (K): <i className="text-danger">*</i></label>
              <input type="number" name="dailyPrice" onChange={this._handleFieldChange} defaultValue={this._getShowablePrice(this.state.showableDailyPrice)} className="form-control" id="daily_price" required />
            </div>
            <div className="form-group">
              <label htmlFor="delivery_price">Delivery price per km (K): <i className="text-danger">*</i></label>
              <input type="number" name="deliveryPrice" onChange={this._handleFieldChange} defaultValue={this._getShowablePrice(this.state.showableDeliveryPrice)} className="form-control" id="delivery_price" required />
            </div>
            {this._renderDateRangePickers()}
            <div className="form-group text-center">
              <button className="btn btn-outline-primary mt-4" onClick={this._addTimeRangePicker}><i className="fa fa-plus"></i> Add more time range</button>
            </div>
          </div>
          <div className="col-12 text-center">
            <div className="form-group">
              <button className="btn btn-success" onClick={this._handleSubmitForm}>NEXT STEP <i className="fa fa-chevron-right"></i></button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AddEquipmentStep1.propTypes = {
  entities: PropTypes.object.isRequired,
  fetchEquipmentTypes: PropTypes.func.isRequired,
  fetchEquipmentTypeSpecs: PropTypes.func.isRequired
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
  fetchEquipmentTypes,
  fetchEquipmentTypeSpecs
})(AddEquipmentStep1);
