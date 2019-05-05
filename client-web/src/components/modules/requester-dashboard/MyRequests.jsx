import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { CSSTransition } from 'react-transition-group';
import SweetAlert from 'react-bootstrap-sweetalert';
import Skeleton from 'react-loading-skeleton';
import { Link } from "react-router-dom";

import {
  TRANSACTION_STATUSES,
  EQUIPMENT_STATUSES,
  EQUIPMENT_SHOWABLE_STATUSES,
  routeConsts
} from 'Common/consts';
import { RatingEquipmentTransaction, Image, StarRatings } from "Components/common";
import ccpApiService from 'Services/domain/ccp-api-service';
import { getRoutePath, getExtendableTimeRange } from 'Utils/common.utils';
import { formatPrice } from 'Utils/format.utils';
import ExtendTimeModal from './extend-time-modal';

class MyRequests extends Component {

  // Initial state
  state = {
    transactions: [],
    confirm: {},
    alert: {},
    filterStatus: 'all',
    isOpenExtendTimeModal: false,
    transactionToExtend: {}
  };

  // Message to show when user want to change status of a transaction
  confirmMessages = {
    [TRANSACTION_STATUSES.ACCEPTED]: 'Are you sure to accept this transaction?',
    [TRANSACTION_STATUSES.CANCELED]: 'Are you sure to cancel this transaction?',
    [TRANSACTION_STATUSES.DENIED]: 'Are you sure to deny this transaction?',
    [TRANSACTION_STATUSES.PROCESSING]: 'Are you going to delivery equipment of this transaction?',
    [TRANSACTION_STATUSES.FINISHED]: 'Did you received equipment of this transaction?'
  };

  changingEquipmentStatusMessage = {
    [EQUIPMENT_STATUSES.RENTING]: 'Have you received the equipment?',
    [EQUIPMENT_STATUSES.WAITING_FOR_RETURNING]: 'You want to return this equipment early?'
  };

  // Statuses need to show in left panel
  showableStatuses = {
    [TRANSACTION_STATUSES.PENDING]: 'Pending',
    [TRANSACTION_STATUSES.ACCEPTED]: 'Accepted',
    [TRANSACTION_STATUSES.PROCESSING]: 'Processing',
    [TRANSACTION_STATUSES.FINISHED]: 'Finished',
    [TRANSACTION_STATUSES.DENIED]: 'Denied'
  };

  // Store counter for status that need an action
  needActionCounters = {};

  /**
   * Load transaction of current user (requester)
   */
  _loadTransactions = async () => {
    const { contractor } = this.props;
    const transactions = await ccpApiService.getTransactionsByRequesterId(contractor.id);

    this.setState({
      transactions
    });
  };

  componentDidMount() {
    this._loadTransactions();
  }

  /**
   * 
   */
  _renderTabNavs = () => {
    return Object.keys(this.showableStatuses).map(status => {
      return (
        <a key={status} className={`nav-link ${status == TRANSACTION_STATUSES.PENDING ? 'active' : ''}`} id={`v-pills-${status}-tab`} data-toggle="pill" href={`#v-pills-${status}`} role="tab" aria-controls={`v-pills-${status}`} aria-selected={status == TRANSACTION_STATUSES.PENDING}>
          {this.showableStatuses[status]}
          {this.needActionCounters[status] &&
            <span className="badge badge-pill badge-danger ml-1">{this.needActionCounters[status]}</span>
          }
        </a>
      );
    });
  };

  /**
   * Render list of placeholder for loading transaction element
   */
  _renderLoadingTransactions = () => {
    const { transactions } = this.state;

    const loadingTransactions = [];
    if (!transactions || transactions.length === 0) {
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

  /**
   * Render tab panel for each showable status
   */
  _renderTabPanels = () => {

    return Object.keys(TRANSACTION_STATUSES).map(status => {
      return (
        <div key={status} className={`tab-pane fade ${status == TRANSACTION_STATUSES.PENDING ? 'show active' : ''}`} id={`v-pills-${status}`} role="tabpanel" aria-labelledby={`v-pills-${status}-tab`}>
          {this.tabContents[status]}
          {this._renderLoadingTransactions()}
        </div>
      );
    });
  };

  /**
   * Render transaction and add into the list base on status of tranction
   */
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

  /**
   * Count number of transaction need an action
   */
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

    if (feedbackTransaction === true) {
      const { feedbackTransaction: feedbackTransactionState } = this.state;
      feedbackTransactionState.feedbacked = true;
    }

    this.setState({
      isShowRatingEquipmentTransaction: !isShowRatingEquipmentTransaction,
      feedbackTransaction
    });
  };

  _handleAdjustTime = (transactionToExtend, extendableTimeRange) => {
    this.setState({
      transactionToExtend,
      extendableTimeRange,
      isOpenExtendTimeModal: true,
    });
  };

  /**
   * Render a transaction element
   */
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
        statusClasses += ' badge-info';
        break;

      case TRANSACTION_STATUSES.ACCEPTED:
        statusClasses += 'badge-success';
        this._countNeedActionForStatus(transaction.status);

        const extendableTimeRange = getExtendableTimeRange(transaction);

        changeStatusButtons = (
          <div className="mt-2">
            <button className="btn btn-sm btn-outline-danger" onClick={() => this._handleChangeStatus(transaction.id, TRANSACTION_STATUSES.CANCELED)}>Cancel</button>
            {extendableTimeRange &&
              <button className="ml-2 btn btn-sm btn-outline-info" onClick={() => this._handleAdjustTime(transaction, extendableTimeRange)}>Extend hiring time</button>
            }
          </div>
        );
        break;

      case TRANSACTION_STATUSES.DENIED:
        statusClasses += 'badge-danger';
        break;

      case TRANSACTION_STATUSES.CANCELED:
        statusClasses += 'badge-danger';
        break;

      case TRANSACTION_STATUSES.PROCESSING:
        if (transaction.equipment.status === EQUIPMENT_STATUSES.DELIVERING) {
          this._countNeedActionForStatus(transaction.status);

          const extendableTimeRange = getExtendableTimeRange(transaction);

          changeStatusButtons = (
            <div className="mt-2">
              <button className="btn btn-sm btn-success" onClick={() => this._handleChangeEquipmentStatus(transaction, EQUIPMENT_STATUSES.RENTING)}>Receive</button>
              {extendableTimeRange &&
                <button className="ml-2 btn btn-sm btn-outline-info" onClick={() => this._handleAdjustTime(transaction, extendableTimeRange)}>Extend hiring time</button>
              }
            </div>
          );
        } else if (transaction.equipment.status === EQUIPMENT_STATUSES.RENTING) {
          const extendableTimeRange = getExtendableTimeRange(transaction);

          changeStatusButtons = (
            <div className="mt-2">
              <button className="btn btn-sm btn-success" onClick={() => this._handleChangeEquipmentStatus(transaction, EQUIPMENT_STATUSES.WAITING_FOR_RETURNING)}>Return equipment</button>
              {extendableTimeRange &&
                <button className="ml-2 btn btn-sm btn-outline-info" onClick={() => this._handleAdjustTime(transaction, extendableTimeRange)}>Extend hiring time</button>
              }
            </div>
          );
        }
        statusClasses += 'badge-warning';
        break;

      case TRANSACTION_STATUSES.WAITING_FOR_RETURNING:
        statusClasses += 'badge-warning';
        break;

      case TRANSACTION_STATUSES.FINISHED:
        statusClasses += 'badge-success';
        // TODO: Feedback function
        if (!transaction.feedbacked) {
          changeStatusButtons = (
            <div className="mt-2">
              <button className="btn btn-sm btn-success" onClick={() => this._toggleRatingEquipmentTransaction(transaction)}>Feedback</button>
            </div>
          );
        }
        break;
    }

    const thumbnail = transaction.equipment.thumbnailImage ? transaction.equipment.thumbnailImage.url : '/public/upload/product-images/unnamed-19-jpg.jpg';
    const supplier = transaction.equipment.contractor;

    return (
      <CSSTransition
        key={transaction.id}
        classNames="fade"
        timeout={500}
      >
        <div className="row no-gutters d-flex transaction my-3 rounded shadow-sm flex-column flex-sm-row">
          <div className="image flex-fill col-md-4">
            <Image src={thumbnail} className="rounded-left" />
          </div>
          <div className="detail flex-fill p-2">
            <Link to={getRoutePath(routeConsts.EQUIPMENT_TRANSACTION_DETAIL, { id: transaction.id })}>
              <h6><span className={statusClasses}>{transaction.status}</span> {equipment.name}</h6>
            </Link>
            <div>
              <span>Days: {days}</span>
              <span className="ml-2 text-muted">({transaction.beginDate} to {transaction.endDate})</span>
            </div>
            <div className="flex-wrap">
              <span className="">Daily Price: {formatPrice(equipment.dailyPrice)}</span>
              <span className="ml-2 pl-2 border-left">Total fee: <strong>{formatPrice(equipment.dailyPrice * days)}</strong></span>
            </div>
            {changeStatusButtons}
          </div>
          <div className="contractor-detail p-2 text-center d-flex flex-row flex-sm-column">
            <Link to={getRoutePath(routeConsts.PROFILE_CONTRACTOR, { id: supplier.id })} >
              <Image
                circle
                className="rounded-circle"
                width={50}
                height={50}
                src={supplier.thumbnailImageUrl || 'https://www.shareicon.net/download/2016/04/10/747369_man.svg'}
              />
            </Link>
            <div className="text-left text-sm-center mx-2">
              <Link to={getRoutePath(routeConsts.PROFILE_CONTRACTOR, { id: supplier.id })} >
                <span>{supplier.name}</span>
              </Link>
              <div className="mt-n2">
                <StarRatings rating={supplier.averageEquipmentRating} starDimension="15px" />
              </div>
              <div>
                <a className="text-muted" href={`tel:${supplier.phoneNumber}`}>
                  <i className="fal fa-phone"></i> {supplier.phoneNumber}
                </a>
              </div>
            </div>
          </div>
        </div>
      </CSSTransition>
    );
  };

  /**
   * Show confirm when user click change status button
   * @param transactionId: ID of transaction need to be changed status
   * @param status: status that transaction need to be changed to
   */
  _handleChangeStatus = (transactionId, status) => {
    const confirm = {
      status,
      transactionId,
      input: status === TRANSACTION_STATUSES.CANCELED,
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

  /**
   * Show loading screen when fetching
   */
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

  /**
   * Start change status when user confirmed
   * BUG HEREEEEE
   */
  _handleChangeStatusConfirm = async (cancelReason) => {
    const { confirm } = this.state;

    this._showLoadingConfirm();
    const data = {
      cancelReason,
      status: confirm.status,
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
    };

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

  /**
   * Show confirm when user click change status button
   * @param transactionId: ID of transaction need to be changed status
   * @param status: status that transaction need to be changed to
   */
  _handleChangeEquipmentStatus = (transaction, status) => {
    const confirm = {
      show: true,
      onConfirm: () => this._handleChangeEquipmentStatusConfirm(transaction, status),
      confirmText: 'Yes',
      confirmStyle: 'info',
      showCancel: true,
      onCancel: this._removeConfirm
    };
    confirm.title = this.changingEquipmentStatusMessage[status];

    this.setState({
      confirm
    });
  };

  /**
   * Handle changing status of equipment after user confirmed
   */
  _handleChangeEquipmentStatusConfirm = async (transaction, status) => {
    try {
      this._showLoadingConfirm();
      const res = await ccpApiService.updateEquipmentStatus(transaction.equipment.id, status);

      // check if error
      if (!res.id) {
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

      // show success
      transaction.equipment.status = status;
      const transactions = this._getUpdatedTransactionsList(transaction);
      this.setState({
        transactions,
        alert: {
          success: true,
          title: 'Success!',
        },
        confirm: {}
      });
    } catch (error) {
      let message = '';

      if (error.response && error.response.data) {
        message = error.response.data.message || 'Status was not changed, please try again!';
      }

      this.setState({
        alert: {
          danger: true,
          title: 'Something went wrong!',
          message
        },
        confirm: {}
      });
    }
  };

  /**
   * Render alert for showing loading, info, success, error
   */
  _renderAlert = () => {
    const { confirm, alert } = this.state;
    console.log('confirm', confirm);

    return (
      <div>
        {confirm.title &&
          <SweetAlert
            info={!confirm.input}
            showCancel={confirm.showCancel}
            confirmBtnText={confirm.confirmText}
            confirmBtnBsStyle={confirm.confirmStyle}
            confirmBtnCssclassName={confirm.confirmClass}
            input={confirm.input}
            title={confirm.title}
            onConfirm={confirm.onConfirm}
            onCancel={confirm.onCancel}
          >
            {confirm.message}
          </SweetAlert>
        }
        {alert.title &&
          <SweetAlert onConfirm={this._removeAlert} {...alert} />
        }
      </div>
    );
  };

  /**
   * Handle close extend time modal
   * Set state to close modal
   * Update transaction in current list
   */
  _handleCloseExtendTimeModal = (transaction, isChanged) => {
    const { transactions } = this.state;

    const newState = {
      isOpenExtendTimeModal: false,
      transactionToExtend: undefined,
      extendableTimeRange: undefined,
      transaction: {},
    };

    // update transaction in list
    if (isChanged) {
      const items = transactions.items.map(item => {
        if (item.id !== transaction.id) {
          return item;
        }

        return transaction;
      });

      newState.transactions = {
        ...transactions,
        items,
      };
    }

    this.setState(newState);
  };

  render() {
    const { isShowRatingEquipmentTransaction, feedbackTransaction, isOpenExtendTimeModal, transactionToExtend, extendableTimeRange } = this.state;
    
    this._renderTabContents();

    return (
      <div className="container py-3 user-dashboard">
        {this._renderAlert()}
        <ExtendTimeModal isOpen={isOpenExtendTimeModal} transaction={transactionToExtend} extendableTimeRange={extendableTimeRange} onClose={this._handleCloseExtendTimeModal}/>
        <RatingEquipmentTransaction
          isOpen={isShowRatingEquipmentTransaction}
          onClose={this._toggleRatingEquipmentTransaction}
          transaction={feedbackTransaction}
        />
        <div className="row">
          <div className="col-md-12">
            <h4>
              Requested transaction
              <button className="btn btn-outline-primary float-right" onClick={this._loadTransactions}><i className="fal fa-sync"></i></button>
            </h4>
          </div>
          <div className="col-md-3">
            <div className="border-right border-primary h-100">
              <div className="sticky-top sticky-sidebar nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                <h5>Status</h5>
                {this._renderTabNavs()}
              </div>
            </div>
          </div>
          <div className="col-md-9">
            <div className="tab-content" id="v-pills-tabContent">
              {this._renderTabPanels()}
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
