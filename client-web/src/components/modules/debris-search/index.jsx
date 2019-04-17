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
      debrises: [],
      isFetching: true,
      criteria: {}
    };
  }

  _loadData = async () => {
    const debrises = await debrisServices.getDebrisesByCriteria({});

    this.setState({
      debrises,
      isFetching: false
    });
  };

  _handleSearch = async (criteria) => {
    console.log(criteria);

    this.setState({
      isFetching: true
    });
    const debrises = await debrisServices.getDebrisesByCriteria(criteria);

    this.setState({
      debrises,
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

  _renderDebrisCard = debris => {
    const { criteria } = this.state;
    const { requester, debrisServiceTypes, debrisBids, thumbnailImage } = debris;
    const avatarSrc = requester.thumbnailImageUrl || 'https://www.shareicon.net/download/2016/04/10/747369_man.svg';
    const services = debrisServiceTypes.map(type => type.name).join(', ');

    return (
      <div key={debris.id} className="bg-white shadow my-2 d-flex flex-column flex-sm-row debris-request">
        <div className="image-xs-169">
          <Image src={thumbnailImage.url} width={230} height={140} />
        </div>
        <div className="flex-fill p-3">
          <Link to={getRoutePath(routeConsts.DEBRIS_DETAIL, {id: debris.id})}><h6>{debris.title}</h6></Link>
          <div className="text-muted"><small><i className="fal fa-tags"></i></small> {services}</div>
          <div className="text-muted"><i className="fal fa-map-marker"></i> {debris.address}</div>
          {criteria.latitude &&
            <div className="text-muted">
              <i className="fal fa-map-marker-alt"></i> Distance: {this.calcCrow(criteria.latitude, criteria.longitude, debris.latitude, debris.longitude)}Km
            </div>
          }
          <div><i className="fas fa-gavel"></i> Bid: {debrisBids.length}</div>
        </div>
        <div className="d-flex align-items-center flex-column justify-content-center p-3">
          <div className="lh-1">
            <Image width={80} height={80} src={avatarSrc} className="rounded-circle avatar" circle/>
          </div>
          <Link to={getRoutePath(routeConsts.PROFILE_CONTRACTOR, { id: requester.id })}><h6>{requester.name}</h6></Link>
        </div>
      </div>
    );
  };

  render() {
    const { debrises, isFetching } = this.state;

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
            {(!debrises || debrises.length === 0) && !isFetching &&
              <div className="col-md-12 text-center py-4 alert alert-info">
                <h2>No material found, please try again with another criteria!</h2>
              </div>
            }
            {isFetching &&
              <div className="bg-white p-4 w-100">
                <Skeleton height={210} count={5} />
              </div>
            }
            {!isFetching && debrises &&
              <div className="col-md-8">
                {debrises.map(debris => this._renderDebrisCard(debris))}
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default DebrisSearch;
