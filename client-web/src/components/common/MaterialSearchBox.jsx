import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import moment from "moment";

import { materialServices } from "Services/domain/ccp";

class MaterialSearchBox extends PureComponent {
  state = {
    materialTypes: [],
    criteria: {
      beginDate: moment().format("YYYY-MM-DD")
    }
  };

  _loadData = async () => {
    const materialTypes = await materialServices.getMaterialTypes();
    this.setState({
      materialTypes
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
    const { materialTypes } = this.state;
    const { isFetching } = this.props;

    return (
      <form onSubmit={this._search}>
        <div className="row">
          <div className="col-md-12">
            <h3>Search</h3>
          </div>
          
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="material_type">Material type:</label>
                <select
                  name="materialTypeId"
                  id="material_type"
                  className="form-control"
                  onChange={this._handleChangeCriteria}
                >
                  <option value="">--Choose--</option>
                  {materialTypes &&
                    materialTypes.map(materialType => (
                      <option key={materialType.id} value={materialType.id}>
                        {materialType.name}
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

MaterialSearchBox.propTypes = {
  onSearch: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired
};

export default MaterialSearchBox;
