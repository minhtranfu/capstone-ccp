import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { materialServices } from 'Services/domain/ccp';
import { AddressInput } from 'Components/common';

class MaterialSearchBox extends PureComponent {
  state = {
    materialTypes: [],
    criteria: {},
  };

  _loadData = async () => {
    const materialTypes = await materialServices.getMaterialTypes();
    this.setState({
      materialTypes,
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
      [name]: value,
    };

    this.setState({
      criteria,
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

  render() {
    const { materialTypes } = this.state;
    const { isFetching, t } = this.props;

    return (
      <form onSubmit={this._search}>
        <div className="row">
          <div className="col-md-12">
            <h3>{t('material.search')}</h3>
          </div>

          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="keyword">{t('common.keyword')}:</label>
              <input
                type="text"
                name="q"
                onChange={this._handleChangeCriteria}
                id="keyword"
                className="form-control"
                placeholder={t('material.keywordPlaceholder')}
              />
            </div>
          </div>
          <div className="col-md-4">
            <label htmlFor="keyword">{t('common.yourAddress')}:</label>
            <AddressInput
              onSelect={this._handleSelectLocation}
              wrapperProps={{ className: 'text-dark' }}
            />
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="material_type">{t('material.type')}:</label>
              <select
                name="materialTypeId"
                id="material_type"
                className="form-control"
                onChange={this._handleChangeCriteria}
              >
                <option value="">{t('common.all')}</option>
                {materialTypes &&
                  materialTypes.map(materialType => (
                    <option key={materialType.id} value={materialType.id}>
                      {materialType.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="col-md-12">
            <button type="submit" className="btn btn-success" disabled={isFetching}>
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

MaterialSearchBox.propTypes = {
  onSearch: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

export default withTranslation()(MaterialSearchBox);
