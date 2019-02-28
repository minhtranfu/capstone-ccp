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
      constructions: []
    };
  }

  componentDidMount() {
    this._loadEquipmentTypes();
    this._loadConstructions();
  }

  _loadConstructions = async () => {
    const { user } = this.props;

    try {
      const constructions = await ccpApiService.getConstructionsByContractorId(user.id);
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

  _onChangeEquipType = (e) => {
    // const equipTypeId = e.target.value;
    // const { fetchEquipmentTypeSpecs } = this.props;

    // fetchEquipmentTypeSpecs(equipTypeId);
    this._handleFieldChange(e);
  };

  _onChangeDescription = (description) => {
    this.setState({ description });
  };

  _onChangeDateRanage = (e, picker) => {
    // let { ranges } = this.state;
    // if (!ranges) {
    //     ranges = [];
    // }
    // console.log(e, picker);
    // const rangeId = e.target.dataset.rangeId;

    // if (ranges[rangeId] == undefined) {
    //     ranges[rangeId] = {};
    // }

    // ranges[rangeId].startDate = picker.startDate;
    // ranges[rangeId].endDate = picker.endDate;
    // console.log(ranges);
    this.setState({
      availableTimeRanges: [
        {
          beginDate: picker.startDate.format('YYYY-MM-DD'),
          endDate: picker.endDate.format('YYYY-MM-DD')
        }
      ]
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
    if (!isNaN(value)) {
      value = +value;
    }
    this.setState({
      [name]: value
    });
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
              <label htmlFor="">Equipment name <i className="text-danger">*</i></label>
              <input type="text" name="name" onChange={this._handleFieldChange} value={this.state.name || ''} className="form-control" maxLength="80" required />
            </div>
            <div className="form-group">
              <label htmlFor="">Construction <i className="text-danger">*</i></label>
              <select name="constructionId" onChange={this._handleFieldChange} value={this.state.constructionId || ''} id="construction_id" className="form-control" required>
                <option value="">Choose...</option>
                {constructions.map(construction => <option key={construction.id} value={construction.id}>{construction.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="">Equipment type <i className="text-danger">*</i></label>
              <select name="equipmentTypeId" onChange={this._onChangeEquipType} data-live-search="true" value={this.state.equipmentTypeId || ''} id="equip_type_id" className="form-control selectpicker">
                <option value="">Choose...</option>
                {equipmentTypes && equipmentTypes.data && equipmentTypes.data.map(type => {
                  return (<option value={type.id} key={type.id}>{type.name}</option>);
                })}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="daily_price">Price per day <i className="text-danger">*</i></label>
              <input type="number" name="dailyPrice" onChange={this._handleFieldChange} value={this.state.dailyPrice || ''} className="form-control" id="daily_price" required />
            </div>
            <div className="form-group">
              <label htmlFor="delivery_price">Delivery price per km <i className="text-danger">*</i></label>
              <input type="number" name="deliveryPrice" onChange={this._handleFieldChange} value={this.state.deliveryPrice || ''} className="form-control" id="delivery_price" required />
            </div>
            <div className="form-group">
              <label htmlFor="">Available time</label>
              <DateRangePicker minDate={moment()} onApply={this._onChangeDateRanage} containerClass="w-100" data-range-id="1" startDate="1/1/2014" endDate="3/1/2014" autoUpdateInput timePicker timePicker24Hour>
                <div className="input-group date-range-picker">
                  <input type="text" className="form-control" readOnly value={this._getLabelOfRange(0) || ''} />
                  <div className="input-group-append">
                    <span className="input-group-text" id="basic-addon2"><i className="fa fa-calendar"></i></span>
                  </div>
                </div>
              </DateRangePicker>
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

export default connect(
  (state) => {
    return {
      entities: { ...state.entities },
      user: state.user,
    };
  },
  { fetchEquipmentTypes, fetchEquipmentTypeSpecs }
)(AddEquipmentStep1);
