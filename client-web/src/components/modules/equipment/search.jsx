import React, { Component } from 'react';
import SearchBox from '../../common/SearchBox';
import EquipmentCard from '../../common/EquipmentCard';
import Helmet from 'react-helmet-async';
import moment from 'moment';
import Skeleton from 'react-loading-skeleton';

import ccpApiService from '../../../services/domain/ccp-api-service';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      isFetching: true
    };
  }

  _loadData = async () => {
    const products = await ccpApiService.searchEquipment({
      beginDate: moment().format('YYYY-MM-DD')
    });

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
    const products = await ccpApiService.searchEquipment(criteria);

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
            <SearchBox onSearch={this._handleSearch} isFetching={isFetching} />
          </div>
        </div>
        <div className="container">
          <div className="row py-3">
            <div className="col-md-12">
              <h3>Result</h3>
            </div>
            {(!products || products.length === 0) && !isFetching &&
              <div className="col-md-12 text-center py-4 alert alert-info">
                <h2>No equipment found, please try again with another criteria!</h2>
              </div>
            }
            {isFetching &&
              <div className="bg-white p-4 w-100">
                <Skeleton height={210} count={5} />
              </div>
            }
            {!isFetching && products && products.map((product, index) => <EquipmentCard key={index} className="col-md-4" product={product} />)}
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
