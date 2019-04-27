import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { withTranslation } from 'react-i18next';

import ccpApiService from "../../services/domain/ccp-api-service";
import { AddressInput } from "Components/common";
import { formatDate } from "Utils/format.utils";

class SearchBox extends PureComponent {
  state = {
    equipmentTypes: [],
    criteria: {
      beginDate: moment(),
      endDate: moment().add(3, 'days'),
    }
  };

  _loadData = async () => {
    const equipmentTypes = await ccpApiService.getEquipmentTypes();
    this.setState({
      equipmentTypes
    });
  };

  componentDidMount() {
    this._loadData();
    this._search();
  }

  _search = e => {
    const { criteria } = this.state
    if (e) {
      e.preventDefault();
    }
    const { onSearch, isFetching } = this.props;
    if (isFetching) {
      return;
    }

    onSearch && onSearch({
      ...criteria,
      beginDate: criteria.beginDate.format("YYYY-MM-DD"),
      endDate: criteria.endDate.format("YYYY-MM-DD"),
    });
  };

  _handleChangeCriteria = e => {
    const { name, value } = e.target;
    let { criteria } = this.state;
    criteria = {
      ...criteria,
      [name]: value
    }

    this.setState({
      criteria
    });
  };

  _handleSelectLocation = location => {
    const { longitude, latitude } = location;
    const { criteria } = this.state;
    
    this.setState({
      criteria: {
        ...criteria,
        long: longitude,
        lat: latitude,
      },
    });
  };

  _onChangeDateRanage = (fieldName, picker) => {
    const { criteria } = this.state;
    const newCriteria = {
      ...criteria,
      [fieldName]: picker.startDate,
    };

    if (fieldName === 'beginDate') {
      // TODO: Clear end date when begin is after end date
      if (picker.startDate.isSameOrAfter(criteria.endDate)) {
        newCriteria.endDate = picker.startDate.add(3, 'days');
      }
    }

    this.setState({
      criteria: newCriteria
    });
  };

  render() {
    const { equipmentTypes, criteria } = this.state;
    const { isFetching, t } = this.props;

    return (
      <form onSubmit={this._search}>
        <div className="row">
          <div className="col-md-12">
            <h3>{t('common.search')}</h3>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="equipment_keyword">{t('common.keyword')}:</label>
              <input type="text" className="form-control"
                name="q"
                id="equipment_keyword"
                onChange={this._handleChangeCriteria}
                placeholder="Find for equiment, type, brand that you want..."
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="equipment_keyword">{t('common.address')}:</label>
              <AddressInput
                wrapperProps={{className: "text-dark"}}
                onSelect={this._handleSelectLocation}
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="form-group">
              <label htmlFor="equipment_type">{t('common.type')}:</label>
              <select
                name="equipmentTypeId"
                id="equipment_type"
                className="form-control"
                onChange={this._handleChangeCriteria}
              >
                <option value="">{t('common.select')}</option>
                {equipmentTypes &&
                  equipmentTypes.map(equipmentType => (
                    <option key={equipmentType.id} value={equipmentType.id}>
                      {equipmentType.name}
                    </option>
                  ))
                }
              </select>
            </div>
          </div>
          <div className="col-md-4">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="begin_date">Start at:</label>
                  {/* <input
                    type="date"
                    className="form-control"
                    name="beginDate"
                    id="begin_date"
                    onChange={this._handleChangeCriteria}
                    value={criteria.beginDate || ''}
                    min={moment().format("YYYY-MM-DD")}
                  /> */}
                  <DateRangePicker
                    singleDatePicker
                    opens="left"
                    minDate={moment()}
                    containerClass="w-100"
                    onApply={(e, picker) => this._onChangeDateRanage('beginDate', picker)}
                  >
                    <div className="input-group date-range-picker">
                      <input type="text" id="timeRange" className="form-control" readOnly value={formatDate(criteria.beginDate) || ''} />
                      <div className="input-group-append">
                        <button type="button" className="input-group-text bg-primary text-white" id="basic-addon2">
                          <i className="fal fa-calendar"></i>
                        </button>
                      </div>
                    </div>
                  </DateRangePicker>
                </div>
              </div>
              <div className="col-md-6 mt-md-0 mt-2">
                <div className="form-group">
                  <label htmlFor="end_date">End at:</label>
                  {/* <input
                    type="date"
                    className="form-control"
                    name="endDate"
                    id="end_date"
                    value={criteria.endDate || ''}
                    onChange={this._handleChangeCriteria}
                    min={
                      criteria.beginDate
                        ? moment(criteria.beginDate).add(1, 'day').format("YYYY-MM-DD")
                        : moment().format("YYYY-MM-DD")
                    }
                  /> */}
                  <DateRangePicker
                    singleDatePicker
                    opens="left"
                    minDate={criteria.beginDate
                      ? moment(criteria.beginDate).add(1, 'day')
                      : moment()}
                    containerClass="w-100"
                    onApply={(e, picker) => this._onChangeDateRanage('endDate', picker)}
                  >
                    <div className="input-group date-range-picker">
                      <input type="text" id="timeRange" className="form-control" readOnly value={formatDate(criteria.endDate) || ''} />
                      <div className="input-group-append">
                        <button type="button" className="input-group-text bg-primary text-white" id="basic-addon2">
                          <i className="fal fa-calendar"></i>
                        </button>
                      </div>
                    </div>
                  </DateRangePicker>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <button
              className="btn btn-success"
              disabled={isFetching}
            >
              {isFetching && (
                <span
                  className="spinner-border spinner-border-sm mr-1"
                  role="status"
                  aria-hidden="true"
                />
              )}
              {t('common.search')}
            </button>
          </div>
        </div>
      </form>
    );
  }
}

SearchBox.propTypes = {
  onSearch: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired
};

export default withTranslation()(SearchBox);
