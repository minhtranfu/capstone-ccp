import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import { Link } from "react-router-dom";

import { debrisServices } from 'Services/domain/ccp';
import { getErrorMessage, getRoutePath } from 'Utils/common.utils';
import { routeConsts } from 'Common/consts';

class MyDebrises extends Component {

  state = {
    debrises: [],
    isFetching: true
  };

  _loadData = async () => {

    try {
      const debrises = await debrisServices.getMyDebrises();
      if (Array.isArray(debrises)) {
        this.setState({
          debrises,
          isFetching: false
        });
      }

      this.setState({
        message: debrises.message,
        isFetching: false
      });
    } catch (error) {
      const message = getErrorMessage(error);

      this.setState({
        message,
        isFetching: false
      });
    }
  };

  componentDidMount() {
    this._loadData();
  }

  // Render placeholder with skeleton while fetching data
  _renderLoading = () => {
    const { isFetching } = this.state;

    if (!isFetching) {
      return null;
    }

    const numOfPlaceholder = 6;
    const placholders = [];
    for (let i = 0; i < numOfPlaceholder; i++) {
      placholders.push(
        <div key={i} className="my-2 lh-1 shadow-sm">
          <Skeleton height={120} />
        </div>
      );
    }

    return placholders;
  };

  _renderDebrises = () => {
    const { debrises } = this.state;

    return debrises.map(debris => {
      const { debrisBids, debrisServiceTypes } = debris;
      const services = debrisServiceTypes.map(type => type.name).join(', ');
      return (
        <div key={debris.id} className="my-2 p-3 bg-white shadow-sm">
          <Link to={getRoutePath(routeConsts.DEBRIS_DETAIL, { id: debris.id })}><h6>{debris.title}</h6></Link>
          <div className="text-muted"><small><i className="fal fa-tags"></i></small> {services}</div>
          <div className="text-muted"><i className="fal fa-map-marker"></i> {debris.address}</div>
          <div className="description">{debris.description}</div>
          <div><i className="fas fa-gavel"></i> Bided: {debrisBids.length}</div>
        </div>
      );
    });
  };

  render() {
    return (
      <div className="container">
        {this._renderLoading()}
        {this._renderDebrises()}
      </div>
    );
  }
}

MyDebrises.props = {
  contractor: PropTypes.object.isRequired
};

// const mapStateToProps = state => {
//   const { authentication } = state;
//   const { user } = authentication;
//   const { contractor } = user;

//   return {
//     contractor
//   };
// };

export default MyDebrises;
