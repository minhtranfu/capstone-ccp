import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import moment from "moment";

import ccpApiService from "../../services/domain/ccp-api-service";

class SearchBox extends PureComponent {
  state = {
    equipmentTypes: [],
    criteria: {
      beginDate: moment().format("YYYY-MM-DD")
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
  }

  _search = () => {
    const { onSearch } = this.props;

    onSearch && onSearch(this.state.criteria);
  };

  _handleChangeCriteria = e => {
    const { name, value } = e.target;
    let { criteria } = this.state;
    criteria = {
      ...criteria,
      [name]: value
    }

    if (name === 'beginDate') {
      // TODO: Clear end date when begin is after end date
      if (moment(value).isSameOrAfter(moment(criteria.endDate))) {
        return this.setState({
          criteria: {
            ...criteria,
            endDate: undefined
          }
        });
      }
    }

    this.setState({
      criteria
    });
  };

  render() {
    const { equipmentTypes, criteria } = this.state;
    const { isFetching } = this.props;

    return (
      <div className="row">
        <div className="col-md-12">
          <h3>Search</h3>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="equipment_type">Equipment type:</label>
            <select
              name="equipmentTypeId"
              id="equipment_type"
              className="form-control"
              onChange={this._handleChangeCriteria}
            >
              <option value="">--Choose--</option>
              {equipmentTypes &&
                equipmentTypes.map(equipmentType => (
                  <option key={equipmentType.id} value={equipmentType.id}>
                    {equipmentType.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="col-md-6">

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="begin_date">Start at:</label>
                <input
                  type="date"
                  className="form-control"
                  name="beginDate"
                  id="begin_date"
                  onChange={this._handleChangeCriteria}
                  value={criteria.beginDate || ''}
                  min={moment().format("YYYY-MM-DD")}
                />
              </div>
            </div>
            <div className="col-md-6 mt-md-0 mt-2">
              <div className="form-group">
                <label htmlFor="end_date">End at:</label>
                <input
                  type="date"
                  className="form-control"
                  name="endDate"
                  id="end_date"
                  value={criteria.endDate}
                  onChange={this._handleChangeCriteria}
                  min={
                    criteria.beginDate
                      ? moment(criteria.beginDate).add(1, 'day').format("YYYY-MM-DD")
                      : moment().format("YYYY-MM-DD")
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <button
            className="btn btn-success"
            onClick={this._search}
            disabled={isFetching}
          >
            {isFetching && (
              <span
                className="spinner-border spinner-border-sm mr-1"
                role="status"
                aria-hidden="true"
              />
            )}
            Search
          </button>
        </div>
      </div>
    );
  }
}

SearchBox.propTypes = {
  onSearch: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired
};

export default SearchBox;
