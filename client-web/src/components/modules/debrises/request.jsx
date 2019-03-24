import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';

import { debrisTransactionServices } from 'Services/domain/ccp';
import { getErrorMessage, getRoutePath } from 'Utils/common.utils';
import { routeConsts } from 'Common/consts';

class DebriseTransactionsRequest extends Component {

  state = {
    transactions: [],
    isFetching: true
  };

  _loadData = async () => {

    try {
      const transactions = await debrisTransactionServices.getRequestTransactions();
      if (Array.isArray(transactions)) {
        this.setState({
          transactions,
          isFetching: false
        });
      }

      this.setState({
        message: transactions.message,
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

  _rendertransactions = () => {
    const { transactions } = this.state;

    return transactions.map(transaction => {
      const { debrisPost:debris } = transaction;
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

  _renderNoResult = () => {
    const { transactions, isFetching } = this.state;

    if (isFetching || transactions.length > 0) {
      return null;
    }

    return (
      <div className="alert alert-info text-center mt-5">
        <i className="fal fa-info-circle"></i> You don't have any transaction now!
      </div>
    );
  };

  render() {
    return (
      <div className="container">
        {this._renderLoading()}
        {this._rendertransactions()}
        {this._renderNoResult()}
      </div>
    );
  }
}

DebriseTransactionsRequest.props = {
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

export default DebriseTransactionsRequest;
