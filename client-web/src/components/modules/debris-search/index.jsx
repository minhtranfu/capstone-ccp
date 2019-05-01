import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import Helmet from 'react-helmet-async';
import Skeleton from 'react-loading-skeleton';

import { debrisServices } from 'Services/domain/ccp';
import DebrisSearchBox from './DebrisSearchBox';
import { getRoutePath, parseQueryString, toQueryString, calcDistance } from 'Utils/common.utils';
import { Image } from 'Components/common';
import { routeConsts } from 'Common/consts';

class DebrisSearch extends Component {
  constructor(props) {
    super(props);

    const { location } = this.props;
    let criteria = {};
    if (location.search) {
      criteria = parseQueryString(location.search);
      if (criteria.debrisTypeId) {
        criteria.debrisTypeId = criteria.debrisTypeId.map(debrisTypeId => +debrisTypeId);
      }
    }

    this.state = {
      criteria,
      debrises: [],
      isFetching: false,
      isSearched: false,
    };
  }

  _loadData = async () => {
    const { criteria } = this.state;

    if (Object.keys(criteria).length === 0) {
      return;
    }
    
    this.setState({
      isFetching: true
    });
    const { address, ...criteriaToSearch } = criteria;
    const debrises = await debrisServices.getDebrisesByCriteria(criteriaToSearch);

    this.setState({
      debrises,
      criteria,
      isFetching: false,
      isSearched: true,
    });
  };

  _handleSearch = async (criteria) => {
    const { history } = this.props;

    history.push(`${getRoutePath(routeConsts.DEBRISES)}?${toQueryString(criteria)}`);

    this.setState({
      isFetching: true
    });
    const { address, ...criteriaToSearch } = criteria;
    const debrises = await debrisServices.getDebrisesByCriteria(criteriaToSearch);

    this.setState({
      debrises,
      isFetching: false,
      criteria,
      isSearched: true,
    });
  };

  componentDidMount() {
    this._loadData();
  }

  _renderDebrisCard = debris => {
    const { criteria } = this.state;
    const { requester, debrisServiceTypes, debrisBids, thumbnailImage } = debris;
    const avatarSrc = requester.thumbnailImageUrl || 'https://www.shareicon.net/download/2016/04/10/747369_man.svg';
    const services = debrisServiceTypes.map(type => type.name).join(', ');

    return (
      <div key={debris.id} className="bg-white shadow my-2 d-flex flex-column flex-sm-row debris-request">
        <div className="image-xs-169 lh-1">
          <Image src={thumbnailImage ? thumbnailImage.url : 'https://via.placeholder.com/230x140'} width={230} height={140} alt={debris.title} />
        </div>
        <div className="flex-fill p-3">
          <Link to={getRoutePath(routeConsts.DEBRIS_DETAIL, {id: debris.id})}><h6>{debris.title}</h6></Link>
          <div className="text-muted"><small><i className="fal fa-tags"></i></small> {services}</div>
          <div className="text-muted"><i className="fal fa-map-marker"></i> {debris.address}</div>
          {criteria.latitude &&
            <div className="text-muted">
              <i className="fal fa-map-marker-alt"></i> Distance: {calcDistance(criteria.latitude, criteria.longitude, debris.latitude, debris.longitude)}Km
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


  _renderResults = () => {
    const { isSearched, isFetching, debrises } = this.state;

    if (!isSearched && !isFetching) {
      return null;
    }

    return (
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
    );
  };

  render() {
    const { isFetching, isSearched, criteria } = this.state;

    let containerClassName = '';
    if (!isSearched && !isFetching) {
      containerClassName += 'flex-fill d-flex align-items-center section-search debris';
    }

    return (
      <div className={containerClassName}>
        <Helmet>
          <title>Home</title>
        </Helmet>
        <div className={isSearched || isFetching ? 'section-search debris' : 'flex-fill pb-5'}>
          <div className="container">
            <DebrisSearchBox criteria={criteria} onSearch={this._handleSearch} isFetching={isFetching} />
          </div>
        </div>
        {this._renderResults()}
      </div>
    );
  }
}

export default withRouter(DebrisSearch);
