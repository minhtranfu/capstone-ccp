import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import Sweetalert from 'react-bootstrap-sweetalert';

import { debrisTransactionServices } from 'Services/domain/ccp';
import { getErrorMessage, getRoutePath } from 'Utils/common.utils';
import { routeConsts, DEBRIS_POST_STATUSES, DEBRIS_POST_STATUS_COLORS } from 'Common/consts';
import { ComponentBlocking } from 'Components/common';
import { RatingModal } from 'Components/common';
import { formatPrice } from 'Utils/format.utils';

class DebriseTransactionsRequest extends Component {

  constructor(props) {
    super(props);

    const { params } = props.match;
    let { status } = params;
    if (status) {
      status = status.toUpperCase();
    } else {
      status = DEBRIS_POST_STATUSES.ACCEPTED;
    }

    this.state = {
      status,
      transactions: [],
      isFetching: true
    };
  }

  showableStatuses = {
    [DEBRIS_POST_STATUSES.ACCEPTED]: 'Accepted',
    [DEBRIS_POST_STATUSES.DELIVERING]: 'Comming',
    [DEBRIS_POST_STATUSES.WORKING]: 'Working',
    [DEBRIS_POST_STATUSES.FINISHED]: 'Finished',
    [DEBRIS_POST_STATUSES.CANCELED]: 'Canceled',
  };

  needActionStatuses = [
    DEBRIS_POST_STATUSES.WORKING
  ];

  changeStatusConfirmMessages = {
    [DEBRIS_POST_STATUSES.FINISHED]: 'Service supplier had done?',
  };

  needActionCounters = {};

  _loadData = async () => {

    try {
      const transactions = await debrisTransactionServices.getRequestTransactions();
      if (transactions && Array.isArray(transactions.items)) {
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

    const numOfPlaceholder = 6;
    const placholders = [];
    for (let i = 0; i < numOfPlaceholder; i++) {
      placholders.push(
        <div key={i} className="my-2 lh-1 shadow-sm">
          <Skeleton height={132} />
        </div>
      );
    }

    return placholders;
  };

  /**
   * Set a change status request to show sweetalert confirm
   */
  _handleChangeTransactionStatus = (transactionId, status) => {
    this.setState({
      changeStatusRequest: {
        transactionId,
        status
      }
    });
  };

  /**
   * Show feedback modal
   */
  _showFeedbackModal = (feedbackingTransaction) => {
    this.setState({
      feedbackingTransaction
    });
  };

  /**
   * Return action button base on status of transaction
   */
  _renderActionButtons = transaction => {
    const buttons = [];
    switch (transaction.status) {

      case DEBRIS_POST_STATUSES.WORKING:
        buttons.push(
          <button
            key={`finish-${transaction.id}`}
            className="btn btn-primary mt-2"
            onClick={() => this._handleChangeTransactionStatus(transaction.id, DEBRIS_POST_STATUSES.FINISHED)}
          >Finish</button>
        );
        break;

      case DEBRIS_POST_STATUSES.FINISHED:
        if (!transaction.feedbacked) {
          buttons.push(
            <button
              key={`finish-${transaction.id}`}
              className="btn btn-primary mt-2"
              onClick={() => this._showFeedbackModal(transaction)}
            >Feedback</button>
          );
        }
        break;
    
      default:
        break;
    }

    return buttons;
  };

  /**
   * Return list transaction card base on filtered status
   * with action buttons and count need action transactions
   * for navs filter
   */
  _renderTransactions = () => {
    const { transactions, status, isFetching } = this.state;
    this.needActionCounters = {};

    if (isFetching) {
      return this._renderLoading();
    }

    if (!transactions || !transactions.items || transactions.items.length === 0) {
      return this._renderNoResult();
    }

    return transactions.items.map(transaction => {
      if (this.needActionStatuses.includes(transaction.status)) {
        this.needActionCounters[transaction.status] = this.needActionCounters[transaction.status]
          ? ++this.needActionCounters[transaction.status] : 1;
      }

      if (transaction.status !== status) {
        return null;
      }

      const { debrisPost:debris } = transaction;
      const { debrisBids, debrisServiceTypes } = debris;
      const services = debrisServiceTypes.map(type => type.name).join(', ');
      return (
        <div key={transaction.id} className="my-2 p-3 bg-white shadow-sm d-flex">
          <div className="flex-fill">
            <Link to={getRoutePath(routeConsts.DEBRIS_DETAIL, { id: debris.id })}>
              <h6>
                <span className={`badge badge-${DEBRIS_POST_STATUS_COLORS[transaction.status]}`}>{transaction.status}</span> {debris.title}
              </h6>
            </Link>
            <div className="text-muted"><small><i className="fal fa-tags"></i></small> {services}</div>
            <div className="text-muted"><i className="fal fa-map-marker"></i> {debris.address}</div>
            <div className="description">{debris.description}</div>
            <div><i className="fas fa-gavel"></i> Bid: {debrisBids.length}</div>
          </div>
          <div className="d-flex px-3 flex-md-column">
            <div className="price text-large mb-auto ml-auto">
              {formatPrice(transaction.price)}
            </div>
            {this._renderActionButtons(transaction)}
          </div>
        </div>
      );
    });
  };

  /**
   * Return no result info alert
   */
  _renderNoResult = () => {

    return (
      <div className="alert alert-info text-center mt-5">
        <i className="fal fa-info-circle"></i> You don't have any transaction now!
      </div>
    );
  };

  /**
   * Filter status
   */
  _setFilterStatus = status => {
    const { history } = this.props;
    const newPath = getRoutePath(routeConsts.DEBRIS_REQUEST_STATUS, {status: status.toLowerCase()})
    history.push(newPath);

    this.setState({
      status
    });
  };

  /**
   * Return navs with status to filter
   * with need action transaction count
   */
  _renderNavs = () => {
    return Object.keys(this.showableStatuses).map(status => {
      return (
        <a
          key={status}
          onClick={() => this._setFilterStatus(status)}
          href="#"
          className={`nav-link ${status == this.state.status ? 'active' : ''}`}
          id={`v-pills-${status}-tab`}>
          {this.showableStatuses[status]}
          {this.needActionCounters[status] &&
            <span className="badge badge-pill badge-danger ml-1">{this.needActionCounters[status]}</span>
          }
        </a>
      );
    });
  };

  /**
   * Call API to change status of transaction
   */
  _handleConfirmChangeStatus = async (cancelReason) => {
    const { changeStatusRequest } = this.state;
    const { transactionId, status} = changeStatusRequest;

    this.setState({
      isChangingStatus: true,
      changeStatusRequest: undefined
    });

    try {
      const result = await debrisTransactionServices.putTransaction(transactionId, { status, cancelReason });
      const newState = {
        isChangingStatus: false
      };

      if (result.message) {
        newState.messaging = result.message;
      } else {
        newState.transactions = this._getUpdatedList(transactionId, status);
        newState.isStatusChanged = true;
      }

      this.setState(newState);
    } catch (error) {
      const message = getErrorMessage(error);
      this.setState({
        isChangingStatus: false,
        message
      });
    }
  };

  _getUpdatedList = (transactionId, status) => {
    const { transactions } = this.state;

    const items = transactions.items.map(transaction => {
      if (transaction.id === transactionId) {
        transaction.status = status;
      }

      return transaction
    });

    return {
      ...transactions,
      items,
    };
  };

  /**
   * Clear current change status request
   */
  _clearChangeStatusRequest = () => {
    this.setState({
      changeStatusRequest: undefined
    });
  };

  /**
   * Return alert confirm to change status
   * Or alert show success
   * Or error
   */
  _renderAlert = () =>{
    const { changeStatusRequest, isStatusChanged, message } = this.state;
    
    if (changeStatusRequest) {
      const { status } = changeStatusRequest;
      return (
        <Sweetalert
          info={status !== DEBRIS_POST_STATUSES.CANCELED}
          input={status === DEBRIS_POST_STATUSES.CANCELED}
          title={this.changeStatusConfirmMessages[status]}
          confirmButtonText={status}
          onConfirm={this._handleConfirmChangeStatus}
          onCancel={this._clearChangeStatusRequest}
          />
      );
    }

    if (isStatusChanged) {
      return (
        <Sweetalert
          success
          title="Update status successfully!"
          onConfirm={() => this.setState({ isStatusChanged: undefined })}
          onCancel={() => this.setState({ isStatusChanged: undefined })}
          />
      );
    }

    if (message) {
      return (
        <Sweetalert
          error
          title="An error occur!"
          onConfirm={() => this.setState({ message: undefined })}
          onCancel={() => this.setState({ message: undefined })}
          >
          {message}
          </Sweetalert>
      );
    }
  };

  _closeRatingModal = (feedback) => {
    const newState = {
      feedbackingTransaction: undefined
    };

    if (feedback && feedback.id) {
      const { feedbackingTransaction, transactions } = this.state;
      newState.transactions.items = transactions.items.map(transaction => {
        if (transaction.id !== feedbackingTransaction.id) {
          return transaction;
        }

        transaction.feedbacked = true;

        return transaction;
      });
    }

    this.setState(newState);
  };

  render() {
    const { isChangingStatus, feedbackingTransaction } = this.state;

    const transactionCards = this._renderTransactions();

    return (
      <div className="container">
        <RatingModal isOpen={!!feedbackingTransaction} transaction={feedbackingTransaction} onClose={this._closeRatingModal} />
        {this._renderAlert()}
        {isChangingStatus &&
          <ComponentBlocking/>
        }
        <h1 className="my-3">
          Debris transactions are requested by me
          <button className="btn btn-outline-primary float-right" onClick={this._loadData}><i className="fal fa-sync"></i></button>
        </h1>
        <div className="row">
          <div className="col-md-3">
            <div className="border-right border-primary h-100">
              <div className="sticky-top sticky-sidebar nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                <h4>Status</h4>
                {Object.keys(this.showableStatuses).map(status => {
                  return (
                    <a
                      key={status}
                      onClick={() => this._setFilterStatus(status)}
                      href="#"
                      className={`nav-link ${status == this.state.status ? 'active' : ''}`}
                      id={`v-pills-${status}-tab`}>
                      {this.showableStatuses[status]}
                      {this.needActionCounters[status] &&
                        <span className="badge badge-pill badge-danger ml-1">{this.needActionCounters[status]}</span>
                      }
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="col-md-9">
            {transactionCards}
          </div>
        </div>
      </div>
    );
  }
}

DebriseTransactionsRequest.props = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object
};

export default withRouter(DebriseTransactionsRequest);
