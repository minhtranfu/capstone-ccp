import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import SweetAlert from 'react-bootstrap-sweetalert';
import Skeleton from 'react-loading-skeleton';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { FeedbackModal, Image, StarRatings } from '../../common';
import {
  MATERIAL_TRANSACTION_STATUSES,
  EQUIPMENT_STATUSES,
  routeConsts,
} from '../../../common/consts';
import { materialTransactionServices } from 'Src/services/domain/ccp';
import { formatDate, formatPrice } from 'Utils/format.utils';
import { getRoutePath } from 'Utils/common.utils';

class MaterialTransactions extends Component {
  state = {
    filterStatus: 'all',
    confirm: {},
    alert: {},
  };

  confirmMessages = {
    [MATERIAL_TRANSACTION_STATUSES.ACCEPTED]: 'Are you sure to accept this transaction?',
    [MATERIAL_TRANSACTION_STATUSES.CANCELED]: 'Are you sure to cancel this transaction?',
    [MATERIAL_TRANSACTION_STATUSES.DENIED]: 'Are you sure to deny this transaction?',
    [MATERIAL_TRANSACTION_STATUSES.DELIVERING]:
      'Are you going to deliver material of this transaction?',
    [MATERIAL_TRANSACTION_STATUSES.FINISHED]: 'Have you received the material from requester?',
  };

  showableStatuses = {
    [MATERIAL_TRANSACTION_STATUSES.PENDING]: 'Pending',
    [MATERIAL_TRANSACTION_STATUSES.ACCEPTED]: 'Accepted',
    [MATERIAL_TRANSACTION_STATUSES.DELIVERING]: 'Delivering',
    [MATERIAL_TRANSACTION_STATUSES.FINISHED]: 'Finished',
    [MATERIAL_TRANSACTION_STATUSES.DENIED]: 'Denied',
  };

  tabContents = {};

  needActionCounters = {};

  _loadData = async () => {
    const { contractor } = this.props;
    const transactions = await materialTransactionServices.getTransactionsBySupplierId(
      contractor.id
    );
    this.setState({
      transactions,
    });
  };

  componentDidMount() {
    this._loadData();
  }

  _handleFilterChange = e => {
    const value = e.target.value;
    this.setState({
      filterStatus: value,
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
      onCancel: this._removeConfirm,
    };
    confirm.title = this.confirmMessages[status];

    this.setState({
      confirm,
    });
  };

  _showLoadingConfirm = () => {
    const { confirm } = this.state;
    this.setState({
      confirm: {
        ...confirm,
        confirmText: (
          <span>
            <span className="spinner-border" role="status" aria-hidden="true" /> Changing...
          </span>
        ),
        confirmClass: 'disabled',
        showCancel: false,
        onCancel: undefined,
        onConfirm: () => {},
      },
    });
  };

  _handleChangeStatusConfirm = async () => {
    const { confirm } = this.state;

    this._showLoadingConfirm();
    const data = {
      status: confirm.status,
    };

    let transaction = null;
    try {
      transaction = await materialTransactionServices.updateTransaction(
        confirm.transactionId,
        data
      );
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
          title,
        },
        confirm: {},
      });

      return;
    }

    // Error: can not get the result
    if (!transaction) {
      this.setState({
        alert: {
          danger: true,
          title: 'An error occur!',
          message: 'Please try again!',
        },
        confirm: {},
      });

      return;
    }

    // Error: status was not changed
    if (transaction.status !== data.status) {
      this.setState({
        alert: {
          danger: true,
          title: 'Something went wrong!',
          message: 'Status was not changed, please try again!',
        },
        confirm: {},
      });
      return;
    }

    // Success, alert success and update current list
    const alert = {
      success: true,
      title: 'Success!',
      message: `Transaction status was changed to ${confirm.status}.`,
    };
    const transactions = this._getUpdatedTransactionsList(transaction);
    this.setState({
      alert,
      confirm: {},
      transactions,
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
        ...updatedTransaction,
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
      alert: {},
    });
  };

  _removeConfirm = () => {
    this.setState({
      confirm: {},
    });
  };

  _renderLoadingTransactions = () => {
    const { transactions } = this.state;

    const loadingTransactions = [];
    if (!transactions) {
      for (let i = 0; i < 10; i++) {
        loadingTransactions.push(
          <div key={i} className="transaction my-3 rounded shadow-sm row">
            <div className="detail col-md-3 py-2">
              <h5>
                <Skeleton width={90} /> <Skeleton width={30} />
              </h5>
              <div>
                <Skeleton width={100} />
              </div>
              <div className="text-large">
                <Skeleton width={90} />
              </div>
            </div>
            <div className="col-md-2 text-center d-flex flex-column align-items-center justify-content-center lh-1 py-2">
              <Skeleton circle width={50} height={50} />
              <div>
                <Skeleton width={90} />
              </div>
              <div className="mt-1">
                <Skeleton width={75} />
              </div>
              <div className="mt-1">
                <Skeleton width={105} />
              </div>
            </div>
            <div className="col-md-5 py-2 d-flex align-items-center text-muted border-left">
              <Skeleton width={180} />
            </div>
            <div className="col-md-2 py-2 d-flex flex-column justify-content-center">
              <Skeleton width={50} height={31} />
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
        {confirm.title && (
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
        )}
        {alert.title && <SweetAlert {...alert} onConfirm={this._removeAlert} />}
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
  };

  _countNeedActionForStatus = status => {
    if (!this.needActionCounters[status]) {
      this.needActionCounters[status] = 0;
    }
    this.needActionCounters[status]++;
  };

  /**
   * Show feedback modal
   */
  _toggleFeedbackModal = feedbackTransaction => {
    const { isShowFeedbackModal } = this.state;
    this.setState({
      isShowFeedbackModal: !isShowFeedbackModal,
      feedbackTransaction,
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
          <div className="mb-2">
            <button
              className="btn btn-sm btn-block mb-2 btn-success"
              onClick={() =>
                this._handleChangeStatus(transaction.id, MATERIAL_TRANSACTION_STATUSES.ACCEPTED)
              }
            >
              Accept
            </button>
            <button
              className="btn btn-sm btn-block btn-outline-danger"
              onClick={() =>
                this._handleChangeStatus(transaction.id, MATERIAL_TRANSACTION_STATUSES.DENIED)
              }
            >
              Deny
            </button>
          </div>
        );
        break;

      case MATERIAL_TRANSACTION_STATUSES.ACCEPTED:
        this._countNeedActionForStatus(MATERIAL_TRANSACTION_STATUSES.ACCEPTED);
        statusClasses += ' badge-success';
        changeStatusButtons = (
          <div className="mb-2">
            <button
              className="btn btn-sm btn-block btn-success"
              onClick={() =>
                this._handleChangeStatus(transaction.id, MATERIAL_TRANSACTION_STATUSES.DELIVERING)
              }
            >
              Deliver
            </button>
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
      <CSSTransition key={transaction.id} classNames="fade" timeout={500}>
        <div className="transaction my-3 rounded shadow-sm row">
          <div className="detail col-md-3 py-2">
            <h5>
              <span className={statusClasses}>{transaction.status}</span> #{transaction.id}
            </h5>
            <div>
              <i className="fal fa-calendar" /> {formatDate(transaction.createdTime)}
            </div>
            <div className="text-large">
              <i className="fal fa-money-bill" /> {formatPrice(transaction.totalPrice)}
            </div>
          </div>
          <div className="col-md-2 text-center d-flex flex-column align-items-center justify-content-center lh-1 py-2">
            <Image
              circle
              className="rounded-circle"
              width={50}
              height={50}
              src={transaction.requester.thumbnailImageUrl}
            />
            <div>
              <Link to={getRoutePath(routeConsts.PROFILE_CONTRACTOR, { id: requester.id })}>
                {requester.name}
              </Link>
            </div>
            <div>
              <StarRatings rating={requester.averageMaterialRating} starDimension="15px" />
            </div>
            <div className="mt-1">
              <a className="text-muted" href={`tel:${requester.phoneNumber}`}>
                <i className="fal fa-phone" /> {requester.phoneNumber}
              </a>
            </div>
          </div>
          <div className="col-md-5 py-2 d-flex align-items-center text-muted border-left">
            {transaction.materialTransactionDetails
              .map(detail => {
                return detail.material.name;
              })
              .join(', ')}
          </div>
          <div className="col-md-2 py-2 d-flex flex-column justify-content-center">
            {changeStatusButtons}
            <Link
              to={getRoutePath(routeConsts.MATERIAL_TRANSACTION_DETAIL, { id: transaction.id })}
              className="btn btn-sm btn-block btn-link"
            >
              Detail
            </Link>
          </div>
        </div>
      </CSSTransition>
    );
  };

  render() {
    const { isShowFeedbackModal, feedbackTransaction } = this.state;
    this._renderTabContents();

    return (
      <div className="container py-3 user-dashboard">
        {this._renderAlert()}
        <FeedbackModal
          isOpen={isShowFeedbackModal}
          onClose={() => this._toggleFeedbackModal()}
          transaction={feedbackTransaction}
        />
        <div className="row">
          <div className="col-md-12">
            <h4>
              My transactions
              <button className="btn btn-outline-primary float-right" onClick={this._loadData}>
                <i className="fal fa-sync" />
              </button>
            </h4>
          </div>
          <div className="col-md-3">
            <div className="border-right border-primary h-100">
              <div
                className="sticky-top sticky-sidebar nav flex-column nav-pills"
                id="v-pills-tab"
                role="tablist"
                aria-orientation="vertical"
              >
                <h5>Status</h5>
                {Object.keys(this.showableStatuses).map(status => {
                  return (
                    <a
                      key={status}
                      className={`nav-link ${
                        status == MATERIAL_TRANSACTION_STATUSES.PENDING ? 'active' : ''
                      }`}
                      id={`v-pills-${status}-tab`}
                      data-toggle="pill"
                      href={`#v-pills-${status}`}
                      role="tab"
                      aria-controls={`v-pills-${status}`}
                      aria-selected={status == MATERIAL_TRANSACTION_STATUSES.PENDING}
                    >
                      {this.showableStatuses[status]}
                      {this.needActionCounters[status] && (
                        <span className="badge badge-pill badge-danger ml-1">
                          {this.needActionCounters[status]}
                        </span>
                      )}
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
                  <div
                    key={status}
                    className={`tab-pane fade ${
                      status == MATERIAL_TRANSACTION_STATUSES.PENDING ? 'show active' : ''
                    }`}
                    id={`v-pills-${status}`}
                    role="tabpanel"
                    aria-labelledby={`v-pills-${status}-tab`}
                  >
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
  user: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  const { authentication } = state;
  const { contractor } = authentication;

  return {
    contractor,
  };
};

export default connect(mapStateToProps)(MaterialTransactions);
