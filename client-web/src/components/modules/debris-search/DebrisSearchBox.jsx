import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import moment from 'moment';
import Select from 'react-select';

import { debrisServices } from 'Services/domain/ccp';
import { AddressInput } from 'Components/common';

class DebrisSearchBox extends PureComponent {
  state = {
    typeOptions: [],
    criteria: {
    }
  };

  _loadData = async () => {
    const types = await debrisServices.getDebrisServiceTypes();
    const typeOptions = types.map(type => ({ label: type.name, value: type.id, }));
    this.setState({
      typeOptions
    });
  };

  componentDidMount() {
    this._loadData();
  }

  _search = e => {
    e.preventDefault();
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

    this.setState({
      criteria
    });
  };

  _handleSelectServiceTypes = selectedOptions => {
    const debrisTypeId = selectedOptions.map(option => option.value);
    const { criteria } = this.state;

    this.setState({
      criteria: {
        ...criteria,
        debrisTypeId
      }
    });
  };

  /**
   * Handle user change location
   */
  _handleChangeLocation = location => {
    const { latitude, longitude } = location;
    const { criteria } = this.state;

    this.setState({
      criteria: {
        ...criteria,
        latitude,
        longitude
      }
    });
  };

  render() {
    const { typeOptions } = this.state;
    const { isFetching } = this.props;

    return (
      <form onSubmit={this._search}>
        <div className="row">
          <div className="col-md-12 text-light">
            <h3>Search</h3>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="keyword" className="text-light">Keyword:</label>
              <input type="text" name="q" onChange={this._handleChangeCriteria} id="keyword" className="form-control" />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="location" className="text-light">Location:</label>
              <AddressInput onSelect={this._handleChangeLocation} inputProps={{id: 'location'}} />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="service_types" className="text-light">Debris type:</label>
              <Select
                isMulti
                openMenuOnFocus
                isSearchable={false}
                closeMenuOnSelect={false}
                tabSelectsValue={false}
                inputId="service_types"
                placeholder="Select some services you need..."
                options={typeOptions}
                onChange={this._handleSelectServiceTypes}
              />
            </div>
          </div>
          <div className="col-md-12">
            <button
              type="submit"
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
              Search
              </button>
          </div>

        </div>
      </form>
    );
  }
}

DebrisSearchBox.propTypes = {
  onSearch: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired
};

export default DebrisSearchBox;
