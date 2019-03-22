import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import moment from "moment";

import { materialServices, debrisServices } from "Services/domain/ccp";

class DebrisSearchBox extends PureComponent {
  state = {
    types: [],
    criteria: {
    }
  };

  _loadData = async () => {
    const types = await debrisServices.getDebrisServiceTypes();
    this.setState({
      types
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
    const { types } = this.state;
    const { isFetching } = this.props;

    return (
      <form onSubmit={this._search}>
        <div className="row">
          <div className="col-md-12">
            <h3>Search</h3>
          </div>
          
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="debris_type">Material type:</label>
                <select
                  name="debrisTypeId"
                  id="debris_type"
                  className="form-control"
                  onChange={this._handleChangeCriteria}
                  multiple
                >
                  <option value="">--Choose--</option>
                  {types &&
                    types.map(equipmentType => (
                      <option key={equipmentType.id} value={equipmentType.id}>
                        {equipmentType.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="keyword">Keyword</label>
                <input type="text" name="q" onChange={this._handleChangeCriteria} id="keyword" className="form-control"/>
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
