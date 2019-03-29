import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Helmet from 'react-helmet-async';
import Skeleton from 'react-loading-skeleton';

import { debrisServices } from 'Services/domain/ccp';
import DebrisSearchBox from './DebrisSearchBox';
import { getRoutePath } from 'Utils/common.utils';
import { Image } from 'Components/common';
import { routeConsts } from 'Common/consts';

class DebrisSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      isFetching: true,
      criteria: {}
    };
  }

  _loadData = async () => {
    const products = await debrisServices.getDebrisesByCriteria({});

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
    const products = await debrisServices.getDebrisesByCriteria(criteria);

    this.setState({
      products,
      isFetching: false,
      criteria
    });
  };

  componentDidMount() {
    this._loadData();
  }

  //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
  calcCrow = (lat1, lon1, lat2, lon2) => {
    var R = 6371; // km
    var dLat = this.toRad(lat2-lat1);
    var dLon = this.toRad(lon2-lon1);
    var lat1 = this.toRad(lat1);
    var lat2 = this.toRad(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d.toFixed(1);
  }

  toRad = (value) => {
    return value * Math.PI / 180;
  }

  render() {
    const { products, isFetching, criteria } = this.state;

    return (
      <div>
        <Helmet>
          <title>Home</title>
        </Helmet>
        <div className="section-search">
          <div className="container">
            <DebrisSearchBox onSearch={this._handleSearch} isFetching={isFetching} />
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
            {!isFetching && products && products.map((product, index) => {
              const { requester, debrisServiceTypes, debrisBids } = product;
              const avatarSrc = requester.thumbnailImage || 'https://www.shareicon.net/download/2016/04/10/747369_man.svg';
              const services = debrisServiceTypes.map(type => type.name).join(', ');

              return (
                <div key={index} className="col-md-8">
                  <div className="bg-white shadow my-2 p-3 d-flex debris-request">
                    <div className="flex-fill">
                      <Link to={getRoutePath(routeConsts.DEBRIS_DETAIL, {id: product.id})}><h6>{product.title}</h6></Link>
                      <div className="text-muted"><small><i className="fal fa-tags"></i></small> {services}</div>
                      <div className="text-muted"><i className="fal fa-map-marker"></i> {product.address}</div>
                      <div className="description text-muted"><i className="fal fa-info-circle"></i> {product.description}</div>
                      <div><i className="fas fa-gavel"></i> Bid: {debrisBids.length}</div>
                      {/* {criteria.latitude &&
                        <div className="text-muted"><i className="fal fa-map-marker-alt"></i> Distance: {this.calcCrow(criteria.latitude, criteria.longitude, product.latitude, product.longitude)}</div>
                      } */}
                    </div>
                    <div className="d-flex align-items-center flex-column justify-content-center">
                      <Image src={avatarSrc} className="rounded-circle avatar" circle={true}/>
                      <h6>{requester.name}</h6>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default DebrisSearch;
