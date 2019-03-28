import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import SweetAlert from 'react-bootstrap-sweetalert';
import Skeleton from 'react-loading-skeleton';
import PropTypes from 'prop-types';

import ccpApiService from '../../../services/domain/ccp-api-service';
import { FeedbackModal } from "../../common";
import { MATERIAL_TRANSACTION_STATUSES, EQUIPMENT_STATUSES } from '../../../common/consts';
import { materialTransactionServices } from 'Src/services/domain/ccp';
import { formatPrice } from 'Src/utils/format.utils';

class MaterialTransactions extends Component {
  state = {
    filterStatus: 'all',
    confirm: {},
    alert: {}
  };

  confirmMessages = {
    [MATERIAL_TRANSACTION_STATUSES.ACCEPTED]: 'Are you sure to accept this transaction?',
    [MATERIAL_TRANSACTION_STATUSES.CANCELED]: 'Are you sure to cancel this transaction?',
    [MATERIAL_TRANSACTION_STATUSES.DENIED]: 'Are you sure to deny this transaction?',
    [MATERIAL_TRANSACTION_STATUSES.DELIVERING]: 'Are you going to deliver material of this transaction?',
    [MATERIAL_TRANSACTION_STATUSES.FINISHED]: 'Have you received the material from requester?'
  };

  showableStatuses = {
    [MATERIAL_TRANSACTION_STATUSES.PENDING]: 'Pending',
    [MATERIAL_TRANSACTION_STATUSES.ACCEPTED]: 'Accepted',
    [MATERIAL_TRANSACTION_STATUSES.DELIVERING]: 'Delivering',
    [MATERIAL_TRANSACTION_STATUSES.FINISHED]: 'Finished',
    [MATERIAL_TRANSACTION_STATUSES.DENIED]: 'Denied'
  };

  tabContents = {};

  needActionCounters = {};

  _loadData = async () => {
    const { contractor } = this.props;
    const transactions = await materialTransactionServices.getTransactionsBySupplierId(contractor.id);
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
      transaction = await materialTransactionServices.updateTransaction(confirm.transactionId, data);
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
    let { transactions } = this.state;

    return transactions.map(transaction => {
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

    transactions.map(transaction => {
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
  _toggleFeedbackModal = (feedbackTransaction) => {
    const { isShowFeedbackModal } = this.state;
    this.setState({
      isShowFeedbackModal: !isShowFeedbackModal,
      feedbackTransaction
    });
  };

  _renderTransaction = transaction => {
    const { filterStatus } = this.state;
    const { requester } = transaction;

    if (filterStatus !== 'all' && transaction.status !== filterStatus) {
      return null;
    }

    let statusClasses = 'badge ';
    let changeStatusButtons = '';
    switch (transaction.status) {
      case MATERIAL_TRANSACTION_STATUSES.PENDING:
        this._countNeedActionForStatus(MATERIAL_TRANSACTION_STATUSES.PENDING);
        statusClasses += ' badge-info';
        changeStatusButtons = (
          <div className="mt-2">
            <button className="btn btn-sm btn-success" onClick={() => this._handleChangeStatus(transaction.id, MATERIAL_TRANSACTION_STATUSES.ACCEPTED)}>Accept</button>
            <button className="btn btn-sm btn-outline-danger ml-2" onClick={() => this._handleChangeStatus(transaction.id, MATERIAL_TRANSACTION_STATUSES.DENIED)}>Deny</button>
          </div>
        );
        break;

      case MATERIAL_TRANSACTION_STATUSES.ACCEPTED:
        this._countNeedActionForStatus(MATERIAL_TRANSACTION_STATUSES.ACCEPTED);
        statusClasses += ' badge-success';
        changeStatusButtons = (
          <div className="mt-2">
            <button className="btn btn-sm btn-success" onClick={() => this._handleChangeStatus(transaction.id, MATERIAL_TRANSACTION_STATUSES.DELIVERING)}>Deliver</button>
          </div>
        );
        break;

      case MATERIAL_TRANSACTION_STATUSES.DENIED:
        statusClasses += 'badge-danger';
        break;

      case MATERIAL_TRANSACTION_STATUSES.CANCELED:
        statusClasses += 'badge-danger';
        break;

      case MATERIAL_TRANSACTION_STATUSES.DELIVERING:
        statusClasses += 'badge-warning';
        break;

      case MATERIAL_TRANSACTION_STATUSES.FINISHED:
        statusClasses += 'badge-success';
        // changeStatusButtons = (
        //   <div className="mt-2">
        //     <button className="btn btn-sm btn-success" onClick={() => this._toggleFeedbackModal(transaction)}>Feedback</button>
        //   </div>
        // );
        break;
    }

    // const thumbnail = transaction.material.thumbnailImageUrl || '/public/upload/product-images/unnamed-19-jpg.jpg';

    return (
      <CSSTransition
        key={transaction.id}
        classNames="fade"
        timeout={500}
      >
        <div className="d-flex transaction my-3 rounded shadow-sm flex-column flex-sm-row">
          <div className="detail flex-fill p-2">
            <h6><span className={statusClasses}>{transaction.status}</span> {requester.name}</h6>
            <div>
              Material: {transaction.materialTransactionDetails.length}
            </div>
            <div>
              <span>Total fee: {formatPrice(transaction.totalPrice)}</span>
            </div>
            {changeStatusButtons}
          </div>
          <div className="contractor-detail flex-fill p-2 text-center">
            <img
              className="rounded-circle"
              style={{width: '50px', height: '50px'}}
              src={transaction.requester.thumbnailImage || 'https://www.shareicon.net/download/2016/04/10/747369_man.svg'}
            />
            <p>{transaction.requester.name}</p>
          </div>
        </div>
      </CSSTransition>
    );
  };

  render() {
    const { isShowFeedbackModal, feedbackTransaction } = this.state;
    this._renderTabContents();

    return (
      <div className="container py-5 user-dashboard">
        {this._renderAlert()}
        <FeedbackModal
          isOpen={isShowFeedbackModal}
          onClose={() => this._toggleFeedbackModal()}
          transaction={feedbackTransaction}
        />
        <div className="row">
          <div className="col-md-3">
            <div className="border-right border-primary h-100">
              <div className="sticky-top sticky-sidebar nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                <h4>Status</h4>
                {Object.keys(this.showableStatuses).map(status => {
                  return (
                    <a key={status} className={`nav-link ${status == MATERIAL_TRANSACTION_STATUSES.PENDING ? 'active' : ''}`} id={`v-pills-${status}-tab`} data-toggle="pill" href={`#v-pills-${status}`} role="tab" aria-controls={`v-pills-${status}`} aria-selected={status == MATERIAL_TRANSACTION_STATUSES.PENDING}>
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
              {Object.keys(MATERIAL_TRANSACTION_STATUSES).map(status => {
                return (
                  <div key={status} className={`tab-pane fade ${status == MATERIAL_TRANSACTION_STATUSES.PENDING ? 'show active' : ''}`} id={`v-pills-${status}`} role="tabpanel" aria-labelledby={`v-pills-${status}-tab`}>
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

MaterialTransactions.props = {
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  const { authentication } = state;
  const { contractor } = authentication.user;

  return {
    contractor
  };
};

export default connect(mapStateToProps)(MaterialTransactions);
