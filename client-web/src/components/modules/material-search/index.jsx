import React, { Component } from 'react';
import MaterialSearchBox from '../../common/MaterialSearchBox';
import MaterialCard from '../../common/MaterialCard';
import Helmet from 'react-helmet-async';
import moment from 'moment';
import Skeleton from 'react-loading-skeleton';

import ccpApiService from '../../../services/domain/ccp-api-service';
import { materialServices } from "Services/domain/ccp";

class MaterialSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      isFetching: true
    };
  }

  _loadData = async () => {
    const products = await materialServices.searchMaterials({});

    if (products.length === 0) {
      alert('Data is empty!');
    }

    this.setState({
      products,
      isFetching: false
    });
  };

  _handleSearch = async (criteria) => {
    console.log(criteria);

    this.setState({
      isFetching: true
    });
    const products = await materialServices.searchMaterials(criteria);

    this.setState({
      products,
      isFetching: false
    });
  };

  componentDidMount() {
    this._loadData();
  }

  render() {
    const { products, isFetching } = this.state;

    return (
      <div>
        <Helmet>
          <title>Home</title>
        </Helmet>
        <div className="section-search text-light">
          <div className="container">
            <MaterialSearchBox onSearch={this._handleSearch} isFetching={isFetching} />
          </div>
        </div>
        <div className="container">
          <div className="row py-3">
            <div className="col-md-12">
              <h3>Result</h3>
            </div>
            {(!products || products.length === 0) && !isFetching &&
              <div className="col-md-12 text-center py-4 alert alert-info">
                <h2>No material found, please try again with another criteria!</h2>
              </div>
            }
            {isFetching &&
              <div className="bg-white p-4 w-100">
                <Skeleton height={210} count={5} />
              </div>
            }
            {!isFetching && products && products.map((product, index) => <MaterialCard key={index} className="col-md-4" product={product} />)}
          </div>
        </div>
      </div>
    );
  }
}

export default MaterialSearch;
