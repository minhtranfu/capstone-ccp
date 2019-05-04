import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { CSSTransition } from 'react-transition-group';
import SweetAlert from 'react-bootstrap-sweetalert';
import Skeleton from 'react-loading-skeleton';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import ccpApiService from 'Services/domain/ccp-api-service';
import { RatingEquipmentTransaction, Image, StarRatings } from "Components/common";
import { TRANSACTION_STATUSES, EQUIPMENT_STATUSES, routeConsts, EQUIPMENT_SHOWABLE_STATUSES } from 'Common/consts';
import { getRoutePath } from 'Utils/common.utils';
import { formatPrice } from 'Utils/format.utils';

class MyRequests extends Component {
  state = {
    filterStatus: 'all',
    confirm: {},
    alert: {}
  };

  confirmMessages = {
    [TRANSACTION_STATUSES.ACCEPTED]: 'Are you sure to accept this transaction?',
    [TRANSACTION_STATUSES.CANCELED]: 'Are you sure to cancel this transaction?',
    [TRANSACTION_STATUSES.DENIED]: 'Are you sure to deny this transaction?',
    [TRANSACTION_STATUSES.PROCESSING]: 'Are you going to delivery equipment of this transaction?',
    [TRANSACTION_STATUSES.FINISHED]: 'Have you received the equipment from requester?'
  };

  showableStatuses = {
    [TRANSACTION_STATUSES.PENDING]: 'Pending',
    [TRANSACTION_STATUSES.ACCEPTED]: 'Accepted',
    [TRANSACTION_STATUSES.PROCESSING]: 'Processing',
    [TRANSACTION_STATUSES.FINISHED]: 'Finished',
    [TRANSACTION_STATUSES.DENIED]: 'Denied'
  };

  tabContents = {};

  needActionCounters = {};

  _loadData = async () => {
    const { contractor } = this.props;
    const transactions = await ccpApiService.getTransactionsBySupplierId(contractor.id);
    this.setState({
      transactions
    });
  };

  componentDidMount() {
    this._loadData();
  }

  _handleFilterChange = e => {
    const value = e.target.value;
    this.setState({
      filterStatus: value
    });
  };

  _handleChangeStatus = (transactionId, status) => {
    const confirm = {
      status,
      transactionId,
      show: true,
      onConfirm: this._handleChangeStatusConfirm,
      confirmText: 'Yes',
      confirmStyle: 'info',
      showCancel: true,
      onCancel: this._removeConfirm
    };
    confirm.title = this.confirmMessages[status];

    this.setState({
      confirm
    });
  };

  _showLoadingConfirm = () => {
    const { confirm } = this.state;
    this.setState({
      confirm: {
        ...confirm,
        confirmText: <span><span className="spinner-border" role="status" aria-hidden="true"></span> Changing...</span>,
        confirmClass: 'disabled',
        showCancel: false,
        onCancel: undefined,
        onConfirm: () => { }
      }
    });
  };

  _handleChangeStatusConfirm = async () => {
    const { confirm } = this.state;

    this._showLoadingConfirm();
    const data = {
      status: confirm.status
    };

    let transaction = null;
    try {
      transaction = await ccpApiService.updateTransactionById(confirm.transactionId, data);
    } catch (error) {

      let title = 'An unknowned error has been occured, please try again!';

      if (error.response && error.response.data && error.response.data.message) {
        title = error.response.data.message;
      } else if (error.message) {
        title = error.message;
      }

      this.setState({
        alert: {
          danger: true,
          title
        },
        confirm: {}
      });

      return;
    }

    // Error: can not get the result
    if (!transaction) {
      this.setState({
        alert: {
          danger: true,
          title: 'An error occur!',
          message: 'Please try again!'
        },
        confirm: {}
      });

      return;
    }

    // Error: status was not changed
    if (transaction.status !== data.status) {
      this.setState({
        alert: {
          danger: true,
          title: 'Something went wrong!',
          message: 'Status was not changed, please try again!'
        },
        confirm: {}
      });
      return;
    }

    // Success, alert success and update current list
    const alert = {
      success: true,
      title: 'Success!',
      message: `Transaction status was changed to ${confirm.status}.`
    };
    const transactions = this._getUpdatedTransactionsList(transaction);
    this.setState({
      alert,
      confirm: {},
      transactions
    });
  };

  _getUpdatedTransactionsList = updatedTransaction => {
    const { transactions } = this.state;

    const items = transactions.items.map(transaction => {
      if (transaction.id !== updatedTransaction.id) {
        return transaction;
      }

      // Update information of transaction
      transaction = {
        ...transaction,
        ...updatedTransaction
      };

      return transaction;
    });

    return {
      ...transactions,
      items,
    };
  };

  _removeAlert = () => {
    this.setState({
      alert: {}
    });
  };

  _removeConfirm = () => {
    this.setState({
      confirm: {}
    });
  };

  _renderLoadingTransactions = () => {
    const { transactions } = this.state;

    const loadingTransactions = [];
    if (!transactions) {
      for (let i = 0; i < 10; i++) {
        loadingTransactions.push(
          <div key={i} className="d-flex transaction my-3 rounded shadow-sm">
            <div className="image flex-fill">
              <Skeleton width={300} height={200} />
            </div>
            <div className="detail flex-fill p-2">
              <h6><Skeleton width={40} className="d-inline" /> <Skeleton width={300} className="d-inline" /></h6>
              <div className="white-space-normal">
                <Skeleton count={3} width={300} />
              </div>
            </div>
          </div>
        );
      }
    }

    return loadingTransactions;
  };

  _renderAlert = () => {
    const { confirm, alert } = this.state;

    return (
      <div>
        {confirm.title &&
          <SweetAlert
            info
            showCancel={confirm.showCancel}
            confirmBtnText={confirm.confirmText}
            confirmBtnBsStyle={confirm.confirmStyle}
            confirmBtnCssclassName={confirm.confirmClass}
            title={confirm.title}
            onConfirm={confirm.onConfirm}
            onCancel={confirm.onCancel}
          >
            {confirm.message}
          </SweetAlert>
        }
        {alert.title &&
          <SweetAlert {...alert} onConfirm={this._removeAlert} />
        }
      </div>
    );
  };

  _renderTabContents = () => {
    const { transactions } = this.state;

    this.tabContents = {};
    this.needActionCounters = {};

    if (!transactions || transactions.length === 0) {
      return;
    }

    transactions.items.map(transaction => {
      const transactionItem = this._renderTransaction(transaction);
      if (!this.tabContents[transaction.status]) {
        this.tabContents[transaction.status] = [];
      }

      this.tabContents[transaction.status].push(transactionItem);
    });
  }

  _countNeedActionForStatus = (status) => {
    if (!this.needActionCounters[status]) {
      this.needActionCounters[status] = 0;
    }
    this.needActionCounters[status]++;
  };

  /**
   * Show feedback modal
   */
  _toggleRatingEquipmentTransaction = (feedbackTransaction) => {
    const { isShowRatingEquipmentTransaction } = this.state;
    this.setState({
      isShowRatingEquipmentTransaction: !isShowRatingEquipmentTransaction,
      feedbackTransaction
    });
  };

  _renderTransaction = transaction => {
    const { filterStatus } = this.state;
    const { equipment } = transaction;

    if (filterStatus !== 'all' && transaction.status !== filterStatus) {
      return null;
    }

    const days = moment(transaction.endDate).diff(moment(transaction.beginDate), 'days') + 1;

    let statusClasses = 'badge ';
    let changeStatusButtons = '';
    switch (transaction.status) {
      case TRANSACTION_STATUSES.PENDING:
        this._countNeedActionForStatus(TRANSACTION_STATUSES.PENDING);
        statusClasses += ' badge-info';
        changeStatusButtons = (
          <div className="mt-2">
            <button className="btn btn-sm btn-success" onClick={() => this._handleChangeStatus(transaction.id, TRANSACTION_STATUSES.ACCEPTED)}>Accept</button>
            <button className="btn btn-sm btn-outline-danger ml-2" onClick={() => this._handleChangeStatus(transaction.id, TRANSACTION_STATUSES.DENIED)}>Deny</button>
          </div>
        );
        break;

      case TRANSACTION_STATUSES.ACCEPTED:
        this._countNeedActionForStatus(TRANSACTION_STATUSES.ACCEPTED);
        statusClasses += ' badge-success';
        if (transaction.equipment.status === EQUIPMENT_STATUSES.AVAILABLE) {
          changeStatusButtons = (
            <div className="mt-2">
              <button className="btn btn-sm btn-success" onClick={() => this._handleChangeStatus(transaction.id, TRANSACTION_STATUSES.PROCESSING)}>Deliver</button>
            </div>
          );
        }
        break;

      case TRANSACTION_STATUSES.DENIED:
        statusClasses += 'badge-danger';
        break;

      case TRANSACTION_STATUSES.CANCELED:
        statusClasses += 'badge-danger';
        break;

      case TRANSACTION_STATUSES.PROCESSING:
        statusClasses += 'badge-warning';

        if (transaction.equipment.status === EQUIPMENT_STATUSES.WAITING_FOR_RETURNING) {
          this._countNeedActionForStatus(TRANSACTION_STATUSES.PROCESSING);

          changeStatusButtons = (
            <div className="mt-2">
              <button className="btn btn-sm btn-success" onClick={() => this._handleChangeStatus(transaction.id, TRANSACTION_STATUSES.FINISHED)}>Receive</button>
            </div>
          );
        }

        break;

      case TRANSACTION_STATUSES.FINISHED:
        statusClasses += 'badge-success';
        // TODO: use or remove comment
        // changeStatusButtons = (
        //   <div className="mt-2">
        //     <button className="btn btn-sm btn-success" onClick={() => this._toggleRatingEquipmentTransaction(transaction)}>Feedback</button>
        //   </div>
        // );
        break;
    }

    const thumbnail = transaction.equipment.thumbnailImage ? transaction.equipment.thumbnailImage.url : '/public/upload/product-images/unnamed-19-jpg.jpg';
    const { requester } = transaction;

    return (
      <CSSTransition
        key={transaction.id}
        classNames="fade"
        timeout={500}
      >
        <div className="d-flex transaction my-3 rounded shadow-sm flex-column flex-sm-row">
          <div className="image flex-fill">
            <img src={thumbnail} className="rounded-left" />
          </div>
          <div className="detail flex-fill p-2">
            <Link to={getRoutePath(routeConsts.EQUIPMENT_TRANSACTION_DETAIL, { id: transaction.id })}>
              <h6><span className={statusClasses}>{transaction.status}</span> {equipment.name}</h6>
            </Link>
            <div>
              <span>Days: {days}</span>
              <span className="ml-2 text-muted">({transaction.beginDate} to {transaction.endDate})</span>
            </div>
            <div>
              <span className="">Daily Price: {formatPrice(equipment.dailyPrice)}</span>
              <span className="ml-2 pl-2 border-left">Total fee: {formatPrice(equipment.dailyPrice * days)}</span>
              <div className="">Equipment: {EQUIPMENT_SHOWABLE_STATUSES[equipment.status]}</div>
            </div>
            {changeStatusButtons}
          </div>
          <div className="contractor-detail p-2 text-center">
            <Link to={getRoutePath(routeConsts.PROFILE_CONTRACTOR, { id: requester.id })} >
              <Image
                circle
                className="rounded-circle"
                width={50}
                height={50}
                src={requester.thumbnailImageUrl || 'https://www.shareicon.net/download/2016/04/10/747369_man.svg'}
              />
            </Link>
            <div className="text-left text-sm-center mx-2">
              <Link to={getRoutePath(routeConsts.PROFILE_CONTRACTOR, { id: requester.id })} >
                <span>{requester.name}</span>
              </Link>
              <div className="mt-n2">
                <StarRatings rating={requester.averageEquipmentRating} starDimension="15px" />
              </div>
              <div>
                <a className="text-muted" href={`tel:${requester.phoneNumber}`}>
                  <i className="fal fa-phone"></i> {requester.phoneNumber}
                </a>
              </div>
            </div>
          </div>
        </div>
      </CSSTransition>
    );
  };

  render() {
    const { isShowRatingEquipmentTransaction, feedbackTransaction } = this.state;
    this._renderTabContents();

    return (
      <div className="container py-3 user-dashboard">
        {this._renderAlert()}
        <RatingEquipmentTransaction
          isOpen={isShowRatingEquipmentTransaction}
          onClose={() => this._toggleRatingEquipmentTransaction()}
          transaction={feedbackTransaction}
        />
        <div className="row">
          <div className="col-md-12">
            <h4>
              My transactions
              <button className="btn btn-outline-primary float-right" onClick={this._loadData}><i className="fal fa-sync"></i></button>
            </h4>
          </div>
          <div className="col-md-3">
            <div className="border-right border-primary h-100">
              <div className="sticky-top sticky-sidebar nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                <h5>Status</h5>
                {Object.keys(this.showableStatuses).map(status => {
                  return (
                    <a key={status} className={`nav-link ${status == TRANSACTION_STATUSES.PENDING ? 'active' : ''}`} id={`v-pills-${status}-tab`} data-toggle="pill" href={`#v-pills-${status}`} role="tab" aria-controls={`v-pills-${status}`} aria-selected={status == TRANSACTION_STATUSES.PENDING}>
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
            <div className="tab-content" id="v-pills-tabContent">
              {Object.keys(TRANSACTION_STATUSES).map(status => {
                return (
                  <div key={status} className={`tab-pane fade ${status == TRANSACTION_STATUSES.PENDING ? 'show active' : ''}`} id={`v-pills-${status}`} role="tabpanel" aria-labelledby={`v-pills-${status}-tab`}>
                    {this.tabContents[status]}
                    {this._renderLoadingTransactions()}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

MyRequests.props = {
  contractor: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  const { authentication } = state;
  const { contractor } = authentication;

  return {
    contractor
  };
};

export default connect(mapStateToProps)(MyRequests);
