import React, { PureComponent } from 'react';
import SearchBox from '../../common/SearchBox';
import EquipmentCard from '../../common/EquipmentCard';
import Helmet from 'react-helmet-async';

import ccpApiService from '../../../services/domain/ccp-api-service';

class Home extends PureComponent {
  constructor (props) {
    super(props);

    this.state = {
      products: []
    };
  }

    _loadData = async () => {
      const products = await ccpApiService.searchEquipment({});

      if (products.length === 0) {
        alert('Data is empty!');
      }

      this.setState({
        products
      });
    };

    _handleSearch = async (criteria) => {
      console.log(criteria);
      const products = await ccpApiService.searchEquipment(criteria);

      if (products.length === 0) {
        alert('Data is empty!');
      }

      this.setState({
        products
      });
    };

    componentDidMount () {
      this._loadData();
    }

    render () {
      const { products } = this.state;

      return (
        <div>
          <Helmet>
            <title>Trang chủ</title>
          </Helmet>
          <div className="section-search text-light">
            <div className="container">
              <SearchBox onSearch={this._handleSearch} />
            </div>
          </div>
          <div className="container">
            <div className="row py-3">
              <div className="col-md-12">
                <h3>Kết quả phù hợp</h3>
              </div>
              {products && products.map(product => <EquipmentCard key={product.id} className="col-md-4" product={product}/>)}
            </div>
          </div>
        </div>
      );
    }
}

export default Home;
