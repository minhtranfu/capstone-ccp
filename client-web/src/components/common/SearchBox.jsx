import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import ccpApiService from '../../services/domain/ccp-api-service';

class SearchBox extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      equipmentTypes: []
    };

    this.criteria = {};
  }

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

    onSearch && onSearch(this.criteria);
  };

  _handleChangeCriteria = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    this.criteria[name] = value;
  };

  render() {
    const { equipmentTypes } = this.state;
    const { isFetching } = this.props;

    return (
      <div className="row">
        <div className="col-md-12">
          <h3>Search</h3>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="equipment_type">Equipment type:</label>
            <select name="equipmentTypeId" id="equipment_type" className="form-control" onChange={this._handleChangeCriteria}>
              <option value="">--Choose--</option>
              {
                equipmentTypes && equipmentTypes.map(equipmentType => <option key={equipmentType.id} value={equipmentType.id}>{equipmentType.name}</option>)
              }
            </select>
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="time">Time</label>
            <div className="row">
              <div className="col-md-6">
                <input type="date" className="form-control" name="beginDate" id="begin_date" onChange={this._handleChangeCriteria} defaultValue={moment().format('YYYY-MM-DD')} />
              </div>
              <div className="col-md-6 mt-md-0 mt-2">
                <input type="date" className="form-control" name="endDate" id="end_date" onChange={this._handleChangeCriteria} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <button className="btn btn-success" onClick={this._search} disabled={isFetching}>
            {isFetching &&
              <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
            }
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
