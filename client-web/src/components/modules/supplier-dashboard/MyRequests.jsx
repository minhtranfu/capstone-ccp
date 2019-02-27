import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import SweetAlert from 'react-bootstrap-sweetalert';
import Skeleton from 'react-loading-skeleton';

import ccpApiService from '../../../services/domain/ccp-api-service';
import { TRANSACTION_STATUSES } from '../../../common/consts';

class MyRequests extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterStatus: 'all',
      confirm: {},
      alert: {}
    };

    this.confirmMessages = {
      [TRANSACTION_STATUSES.ACCEPTED]: 'Are you sure to accept this transaction?',
      [TRANSACTION_STATUSES.CANCELED]: 'Are you sure to cancel this transaction?',
      [TRANSACTION_STATUSES.DENIED]: 'Are you sure to deny this transaction?',
      [TRANSACTION_STATUSES.PROCESSING]: 'Are you going to delivery equipment of this transaction?',
      [TRANSACTION_STATUSES.FINISHED]: 'Did you received equipment of this transaction?'
    };

    this.showableStatuses = {
      [TRANSACTION_STATUSES.PENDING]: 'Pending',
      [TRANSACTION_STATUSES.ACCEPTED]: 'Accepted',
      [TRANSACTION_STATUSES.PROCESSING]: 'Processing',
      [TRANSACTION_STATUSES.FINISHED]: 'Finished',
      [TRANSACTION_STATUSES.DENIED]: 'Denied'
    };

    this.needActionStatuses = [
      TRANSACTION_STATUSES.PENDING,
      TRANSACTION_STATUSES.ACCEPTED
    ];

    this.tabContents = {};
  }

  _loadData = async () => {
    const REQUESTER_ID = 12;
    const transactions = await ccpApiService.getTransactionsByRequesterId(REQUESTER_ID);
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
    const { transactions, filterStatus, confirm, alert } = this.state;

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
        changeStatusButtons = (
          <div className="mt-2">
            <button className="btn btn-success" onClick={() => this._handleChangeStatus(transaction.id, TRANSACTION_STATUSES.ACCEPTED)}>Accept</button>
            <button className="btn btn-outline-danger ml-2" onClick={() => this._handleChangeStatus(transaction.id, TRANSACTION_STATUSES.DENIED)}>Deny</button>
          </div>
        );
        break;

      case TRANSACTION_STATUSES.ACCEPTED:
        statusClasses += ' badge-success';
        changeStatusButtons = (
          <div className="mt-2">
            <button className="btn btn-warning" onClick={() => this._handleChangeStatus(transaction.id, TRANSACTION_STATUSES.PROCESSING)}>Deliery</button>
            <button className="btn btn-outline-danger ml-2" onClick={() => this._handleChangeStatus(transaction.id, TRANSACTION_STATUSES.CANCELED)}>Cancel</button>
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
        statusClasses += 'badge-warning';
        break;

      case TRANSACTION_STATUSES.WAITING_FOR_RETURNING:
        statusClasses += 'badge-warning';
        changeStatusButtons = (
          <div className="mt-2">
            <button className="btn btn-success" onClick={() => this._handleChangeStatus(transaction.id, TRANSACTION_STATUSES.FINISHED)}>Finish</button>
          </div>
        );
        break;

      case TRANSACTION_STATUSES.FINISHED:
        statusClasses += 'badge-success';
        // TODO: Feedback function
        changeStatusButtons = (
          <div className="mt-2">
            <button className="btn btn-success" onClick={() => window.alert('Feedback chưa xong')}>Feedback</button>
          </div>
        );
        break;
    }

    return (
      <CSSTransition
        key={transaction.id}
        classNames="fade"
        timeout={500}
      >
        <div className="d-flex transaction my-3 rounded shadow-sm">
          <div className="image flex-fill">
            <img src="/public/upload/product-images/unnamed-19-jpg.jpg" className="rounded-left" />
          </div>
          <div className="detail flex-fill p-2">
            <h6><span className={statusClasses}>{transaction.status}</span> {equipment.name}</h6>
            <div>
              <span>Days: {days}</span>
              <span className="ml-2 text-muted">({transaction.beginDate} to {transaction.endDate})</span>
            </div>
            <div>
              <span className="">Daily Price: ${equipment.dailyPrice}</span>
              <span className="ml-2 pl-2 border-left">Total fee: ${equipment.dailyPrice * days}</span>
            </div>
            {changeStatusButtons}
          </div>
        </div>
      </CSSTransition>
    );
  };

  render() {

    this._renderTabContents();

    return (
      <div className="container py-5 user-dashboard">
        {this._renderAlert()}
        <div className="row">
          <div className="col-md-3">
            <div className="border-right border-primary h-100">
              <div className="sticky-top sticky-sidebar nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                <h4>Status</h4>
                {Object.keys(this.showableStatuses).map(status => {
                  return (
                    <a key={status} className={`nav-link ${status == TRANSACTION_STATUSES.PENDING ? 'active' : ''}`} id={`v-pills-${status}-tab`} data-toggle="pill" href={`#v-pills-${status}`} role="tab" aria-controls={`v-pills-${status}`} aria-selected={status == TRANSACTION_STATUSES.PENDING}>
                      {this.showableStatuses[status]}
                      {this.needActionStatuses.includes(status) && this.tabContents[status] && this.tabContents[status].length &&
                        <span className="badge badge-pill badge-danger ml-1">{this.tabContents[status] ? this.tabContents[status].length : 0}</span>
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

const mapStateToProps = state => {
  return state;
};

export default connect(mapStateToProps)(MyRequests);
