import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';

import { debrisServices } from 'Services/domain/ccp';
import { getErrorMessage, getRoutePath } from 'Utils/common.utils';
import { routeConsts } from 'Common/consts';
import { Pagination } from 'Components/common';

class MyDebrises extends Component {
  state = {
    debrises: {},
    isFetching: false,
    activePage: 1,
  };
  pageSize = 6;

  _loadData = async activePage => {
    this.setState({
      isFetching: true,
    });
    try {
      const debrises = await debrisServices.getMyDebrises({
        offset: (activePage - 1) * this.pageSize,
        limit: this.pageSize,
      });
      this.setState({
        activePage,
        debrises,
        isFetching: false,
      });
    } catch (error) {
      const message = getErrorMessage(error);

      this.setState({
        message,
        isFetching: false,
      });
    }
  };

  componentDidMount() {
    const { activePage } = this.state;
    this._loadData(activePage);
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

  // Render no debris
  _renderNoDebris = () => {
    return (
      <div className="py-5 text-center">
        <h2>You have no material!</h2>
        <Link to={getRoutePath(routeConsts.DEBRIS_ADD)}>
          <button className="btn btn-success btn-lg">
            <i className="fal fa-plus" /> Request for a debris service
          </button>
        </Link>
      </div>
    );
  };

  _handleDeleteDebris = debrisId => {
    console.log(debrisId);
  };

  _renderDebrises = () => {
    const { debrises, isFetching } = this.state;

    if (isFetching) {
      return this._renderLoading();
    }

    if (!debrises || !debrises.items || debrises.items.length === 0) {
      return this._renderNoDebris();
    }

    return debrises.items.map(debris => {
      const { debrisBids, debrisServiceTypes } = debris;
      const services = debrisServiceTypes.map(type => type.name).join(', ');
      return (
        <div key={debris.id} className="my-2 p-3 bg-white shadow-sm">
          <div>
            <Link to={getRoutePath(routeConsts.DEBRIS_DETAIL, { id: debris.id })}>
              <h6 className="d-inline">{debris.title}</h6>
            </Link>
            <span className="float-right">
              <button className="btn btn-sm btn-outline-primary">
                <i className="fal fa-edit" />
              </button>
              <button
                className="btn btn-sm btn-outline-danger ml-2"
                onClick={() => this._handleDeleteDebris(debris.id)}
              >
                <i className="fal fa-trash" />
              </button>
            </span>
          </div>
          <div className="text-muted">
            <small>
              <i className="fal fa-tags" />
            </small>{' '}
            {services}
          </div>
          <div className="text-muted">
            <i className="fal fa-map-marker" /> {debris.address}
          </div>
          <div>
            <i className="fas fa-gavel" /> Bid: {debrisBids.length}
          </div>
        </div>
      );
    });
  };

  render() {
    const { debrises, activePage } = this.state;

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-9">
            <h2 className="my-3">
              My debris requests
              <Link to={getRoutePath(routeConsts.DEBRIS_ADD)} className="float-right">
                <button className="btn btn-success">
                  <i className="fal fa-plus" /> New request
                </button>
              </Link>
            </h2>
            {this._renderDebrises()}
            {debrises && debrises.totalItems > this.pageSize && (
              <div className="text-center">
                <Pagination
                  activePage={activePage}
                  itemsCountPerPage={this.pageSize}
                  totalItemsCount={debrises.totalItems}
                  pageRangeDisplayed={5}
                  onChange={this._loadData}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

MyDebrises.props = {
  contractor: PropTypes.object.isRequired,
};

// const mapStateToProps = state => {
//   const { authentication } = state;
//   const { contractor } = authentication;

//   return {
//     contractor
//   };
// };

export default MyDebrises;
