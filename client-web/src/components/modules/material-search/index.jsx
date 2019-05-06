import React, { Component } from 'react';
import Helmet from 'react-helmet-async';
import Skeleton from 'react-loading-skeleton';
import { withTranslation } from 'react-i18next';

import MaterialSearchBox from 'Components/common/MaterialSearchBox';
import MaterialCard from 'Components/common/MaterialCard';
import { materialServices } from 'Services/domain/ccp';

class MaterialSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      isFetching: true,
      criteria: {},
    };
  }

  _loadData = async () => {
    const products = await materialServices.searchMaterials({});

    this.setState({
      products,
      isFetching: false,
    });
  };

  _handleSearch = async criteria => {
    this.setState({
      isFetching: true,
    });
    const products = await materialServices.searchMaterials(criteria);

    this.setState({
      products,
      isFetching: false,
      criteria,
    });
  };

  componentDidMount() {
    this._loadData();
  }

  _handleSort = e => {
    const { name, value } = e.target;
    const { criteria } = this.state;

    this._handleSearch({
      ...criteria,
      [name]: value,
    });
  };

  render() {
    const { t } = this.props;
    const { products, isFetching, criteria } = this.state;

    return (
      <div>
        <Helmet>
          <title>Home</title>
        </Helmet>
        <div className="section-search text-light material">
          <div className="container">
            <MaterialSearchBox onSearch={this._handleSearch} isFetching={isFetching} />
          </div>
        </div>
        <div className="container">
          <div className="row py-3">
            
            <div className="col-md-12 d-flex justify-content-between">
              <h3 className="d-inline">{t('common.result')}</h3>
              <span className="form-inline">
                {t('common.orderBy')}:
                <select
                  name="orderBy"
                  id="equipment_order_by"
                  className="form-control form-control-sm ml-1"
                  onChange={this._handleSort}
                >
                  <option value="_score.desc">{t('common.orderByScore')}</option>
                  <option value="created_time.desc">{t('common.orderByLatest')}</option>
                  <option value="price.desc">{t('common.priceDescrease')}</option>
                  <option value="price.asc">{t('common.priceIncrease')}</option>
                </select>
              </span>
            </div>

            {(!products || products.length === 0) && !isFetching && (
              <div className="col-md-12 text-center py-4 alert alert-info">
                <h2>No material found, please try again with another criteria!</h2>
              </div>
            )}
            {isFetching && (
              <div className="bg-white p-4 w-100">
                <Skeleton height={210} count={5} />
              </div>
            )}
            {!isFetching &&
              products &&
              products.map((product, index) => (
                <MaterialCard
                  key={index}
                  className="col-md-4"
                  product={product}
                  criteria={criteria}
                />
              ))}
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(MaterialSearch);
