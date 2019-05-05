import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import PropTypes from 'prop-types';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import SweetAlert from 'react-bootstrap-sweetalert';

import { getErrorMessage, getRoutePath, getExtendableTimeRange } from 'Utils/common.utils';
import { equipmentTransactionServices } from 'Services/domain/ccp';
import {
  Image,
  StarRatings,
  RatingEquipmentTransaction,
  ContractorCard,
  PopConfirm,
  ComponentBlocking,
} from 'Components/common';
import { formatPrice, formatDate } from 'Utils/format.utils';
import {
  EQUIPMENT_STATUSES,
  TRANSACTION_STATUSES,
  TRANSACTION_STATUS_CLASSES,
  routeConsts,
  DATE_CHANGE_REQUEST_STATUSES,
  DATE_CHANGE_REQUEST_STATUS_COLORS,
} from 'Common/consts';
import CcpApiService from 'Services/domain/ccp-api-service';
import ExtendTimeModal from '../requester-dashboard/extend-time-modal';
import { Small } from 'glamorous';

class EquipmentTransactionDetail extends PureComponent {
  state = {
    isFetching: true,
    isChanging: false,
    isShowExtendTimeModal: false,
    isShowRatingModal: false,
    transaction: {},
    errorMessage: null,
    confirm: {},
    alert: {},
  };

  confirmMessages = {
    [TRANSACTION_STATUSES.ACCEPTED]: 'Are you sure to accept this transaction?',
    [TRANSACTION_STATUSES.CANCELED]: 'Are you sure to cancel this transaction?',
    [TRANSACTION_STATUSES.DENIED]: 'Are you sure to deny this transaction?',
    [TRANSACTION_STATUSES.PROCESSING]: 'Are you going to delivery equipment of this transaction?',
    [TRANSACTION_STATUSES.FINISHED]: 'Have you received the equipment from requester?',
  };

  changingEquipmentStatusMessage = {
    [EQUIPMENT_STATUSES.RENTING]: 'Have you received the equipment?',
    [EQUIPMENT_STATUSES.WAITING_FOR_RETURNING]: 'You want to return this equipment early?',
  };

  showableStatuses = {
    [TRANSACTION_STATUSES.PENDING]: 'Pending',
    [TRANSACTION_STATUSES.ACCEPTED]: 'Accepted',
    [TRANSACTION_STATUSES.PROCESSING]: 'Processing',
    [TRANSACTION_STATUSES.FINISHED]: 'Finished',
    [TRANSACTION_STATUSES.DENIED]: 'Denied',
  };

  _loadTransactionData = async () => {
    const { contractor, match } = this.props;
    const { params } = match;
    const { id } = params;

    try {
      const transaction = await equipmentTransactionServices.getTransactionsById(id);
      this.isSupplier = transaction.requester.id !== contractor.id;
      this.setState({
        transaction,
        isFetching: false,
        extendableTimeRange: getExtendableTimeRange(transaction),
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      this.setState({
        errorMessage,
        isFetching: false,
      });
    }
  };

  componentDidMount() {
    this._loadTransactionData();
  }

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
      onCancel: this._removeConfirm,
    };
    confirm.title = this.confirmMessages[status];

    this.setState({
      confirm,
    });
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

  _renderAlert = () => {
    const { confirm, alert } = this.state;

    return (
      <div>
        {confirm.title && (
          <SweetAlert
            info={!confirm.input}
            input={confirm.input}
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

  _handleChangeStatusConfirm = async (cancelReason) => {
    const { confirm } = this.state;

    this._showLoadingConfirm();
    const data = {
      status: confirm.status,
      cancelReason,
    };

    let transaction = null;
    try {
      transaction = await CcpApiService.updateTransactionById(confirm.transactionId, data);
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
    this.setState({
      alert,
      confirm: {},
      transaction,
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
      onCancel: this._removeConfirm,
    };
    confirm.title = this.changingEquipmentStatusMessage[status];

    this.setState({
      confirm,
    });
  };

  /**
   * Handle changing status of equipment after user confirmed
   */
  _handleChangeEquipmentStatusConfirm = async (transaction, status) => {
    try {
      this._showLoadingConfirm();
      const res = await CcpApiService.updateEquipmentStatus(transaction.equipment.id, status);

      // check if error
      if (!res.id) {
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

      // show success
      this.setState({
        transaction: {
          ...transaction,
          equipment: {
            ...transaction.equipment,
            status,
          },
        },
        alert: {
          success: true,
          title: 'Success!',
        },
        confirm: {},
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
          message,
        },
        confirm: {},
      });
    }
  };

  _renderSupplierButtons = () => {
    const { transaction } = this.state;
    const { equipment } = transaction;

    let changeStatusButtons = '';
    switch (transaction.status) {
      case TRANSACTION_STATUSES.PENDING:
        changeStatusButtons = (
          <div className="mt-2">
            <button
              className="btn btn-sm btn-success"
              onClick={() =>
                this._handleChangeStatus(transaction.id, TRANSACTION_STATUSES.ACCEPTED)
              }
            >
              Accept
            </button>
            <button
              className="btn btn-sm btn-outline-danger ml-2"
              onClick={() => this._handleChangeStatus(transaction.id, TRANSACTION_STATUSES.DENIED)}
            >
              Deny
            </button>
          </div>
        );
        break;

      case TRANSACTION_STATUSES.ACCEPTED:
        if (equipment.status === EQUIPMENT_STATUSES.AVAILABLE) {
          changeStatusButtons = (
            <div className="mt-2">
              <button
                className="btn btn-sm btn-success"
                onClick={() =>
                  this._handleChangeStatus(transaction.id, TRANSACTION_STATUSES.PROCESSING)
                }
              >
                Deliver
              </button>
            </div>
          );
        }
        break;

      case TRANSACTION_STATUSES.PROCESSING:
        if (equipment.status === EQUIPMENT_STATUSES.WAITING_FOR_RETURNING) {
          changeStatusButtons = (
            <div className="mt-2">
              <button
                className="btn btn-sm btn-success"
                onClick={() =>
                  this._handleChangeStatus(transaction.id, TRANSACTION_STATUSES.FINISHED)
                }
              >
                Receive
              </button>
            </div>
          );
        }

        break;
    }

    return changeStatusButtons;
  };

  // Show adjust time modal
  _handleAdjustTime = transactionToExtend => {
    this.setState({
      isShowExtendTimeModal: true,
    });
  };

  /**
   * Show rating modal
   */
  _toggleRatingEquipmentTransaction = feedbacked => {
    const { isShowRatingModal, transaction } = this.state;
    const newState = {
      isShowRatingModal: !isShowRatingModal,
    };

    if (feedbacked === true) {
      newState.transaction = {
        ...transaction,
        feedbacked,
      };
    }

    this.setState(newState);
  };

  _renderRequesterButtons = () => {
    const { transaction, extendableTimeRange } = this.state;
    const { equipment } = transaction;

    let changeStatusButtons = '';
    switch (transaction.status) {
      case TRANSACTION_STATUSES.ACCEPTED:
        changeStatusButtons = (
          <div className="mt-2">
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() =>
                this._handleChangeStatus(transaction.id, TRANSACTION_STATUSES.CANCELED)
              }
            >
              Cancel
            </button>
            {!transaction.hasPendingTransactionDateChangeRequest && extendableTimeRange && (
              <button
                className="ml-2 btn btn-sm btn-outline-info"
                onClick={() => this._handleAdjustTime(transaction)}
              >
                Extend hiring time
              </button>
            )}
          </div>
        );
        break;

      case TRANSACTION_STATUSES.PROCESSING:
        if (equipment.status === EQUIPMENT_STATUSES.DELIVERING) {
          changeStatusButtons = (
            <div className="mt-2">
              <button
                className="btn btn-sm btn-success"
                onClick={() =>
                  this._handleChangeEquipmentStatus(transaction, EQUIPMENT_STATUSES.RENTING)
                }
              >
                Receive
              </button>
              {!transaction.hasPendingTransactionDateChangeRequest && extendableTimeRange && (
                <button
                  className="ml-2 btn btn-sm btn-outline-info"
                  onClick={() => this._handleAdjustTime(transaction)}
                >
                  Extend hiring time
                </button>
              )}
            </div>
          );
        } else if (transaction.equipment.status === EQUIPMENT_STATUSES.RENTING) {
          changeStatusButtons = (
            <div className="mt-2">
              <button
                className="btn btn-sm btn-success"
                onClick={() =>
                  this._handleChangeEquipmentStatus(
                    transaction,
                    EQUIPMENT_STATUSES.WAITING_FOR_RETURNING
                  )
                }
              >
                Return equipment
              </button>
              {!transaction.hasPendingTransactionDateChangeRequest && extendableTimeRange && (
                <button
                  className="ml-2 btn btn-sm btn-outline-info"
                  onClick={() => this._handleAdjustTime(transaction)}
                >
                  Extend hiring time
                </button>
              )}
            </div>
          );
        }
        break;

      case TRANSACTION_STATUSES.FINISHED:
        if (!transaction.feedbacked) {
          changeStatusButtons = (
            <div className="mt-2">
              <button
                className="btn btn-sm btn-success"
                onClick={() => this._toggleRatingEquipmentTransaction(transaction)}
              >
                Feedback
              </button>
            </div>
          );
        }
        break;
    }

    return changeStatusButtons;
  };

  _renderTransactionInfo = () => {
    const { transaction } = this.state;
    const { equipment } = transaction;
    const { t } = this.props;

    const days = moment(transaction.endDate).diff(moment(transaction.beginDate), 'days') + 1;

    return (
      <div>
        <Link to={getRoutePath(routeConsts.EQUIPMENT_DETAIL, { id: equipment.id })}>
          <h3 className="align-text-bottom">
            <span className={`mr-2 badge badge-${TRANSACTION_STATUS_CLASSES[transaction.status]}`}>
              {transaction.status}
            </span>
            {equipment.name}
          </h3>
        </Link>
        <div className="row">
          <div className="col-md-6">
            <h6 className="my-2">
              <span className="text-muted">{t('equipment.transaction.rentFrom')}:</span>{' '}
              {formatDate(transaction.beginDate)}
            </h6>
          </div>
          <div className="col-md-6">
            <h6 className="my-2">
              <span className="text-muted">{t('equipment.transaction.rentTo')}:</span>{' '}
              {formatDate(transaction.endDate)}
            </h6>
          </div>
          <div className="col-md-6">
            <h6 className="my-2">
              <span className="text-muted">{t('equipment.transaction.status')}:</span>{' '}
              {transaction.status}
            </h6>
          </div>
          <div className="col-md-6">
            <h6 className="my-2">
              <span className="text-muted">{t('equipment.dailyPrice')}:</span>{' '}
              {formatPrice(transaction.dailyPrice)}
            </h6>
          </div>
          <div className="col-md-6">
            <h6 className="my-2">
              <span className="text-muted">{t('equipment.transaction.rentDays')}:</span> {days}
            </h6>
          </div>
          <div className="col-md-6">
            <h6 className="my-2">
              <span className="text-muted">{t('equipment.transaction.totalFee')}:</span>{' '}
              <span className="text-large">{formatPrice(transaction.dailyPrice * days)}</span>
            </h6>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Handle close extend time modal
   * Set state to close modal
   * Update transaction in current list
   */
  _handleCloseExtendTimeModal = request => {
    const newState = {
      isShowExtendTimeModal: false,
    };

    if (request) {
      const { transaction } = this.state;
      newState.transaction = {
        ...transaction,
        transactionDateChangeRequests: transaction.transactionDateChangeRequests
          ? [...transaction.transactionDateChangeRequests, request]
          : [request],
        hasPendingTransactionDateChangeRequest: true,
      };
    }

    this.setState(newState);
  };

  _handleUpdateStatusDateChangeRequest = async (requestId, status) => {
    const { transaction } = this.state;
    this.setState({
      isChanging: true,
    });

    try {
      const resultRequest = await equipmentTransactionServices.updateStatusDateChangeRequest(
        requestId,
        status
      );

      const transactionDateChangeRequests = transaction.transactionDateChangeRequests.map(
        request => {
          if (request.id !== requestId) {
            return request;
          }

          return resultRequest;
        }
      );

      const endDate =
        resultRequest.status === DATE_CHANGE_REQUEST_STATUSES.ACCEPTED
          ? resultRequest.requestedEndDate
          : transaction.endDate;

      const hasPendingTransactionDateChangeRequest =
        resultRequest.status === DATE_CHANGE_REQUEST_STATUSES.PENDING;

      this.setState({
        isChanging: false,
        transaction: {
          ...transaction,
          endDate,
          transactionDateChangeRequests,
          hasPendingTransactionDateChangeRequest,
        },
      });
    } catch (error) {
      const dateChangeError = getErrorMessage(error);
      this.setState({
        dateChangeError,
        isChanging: false,
      });
    }
  };

  _renderChangeRequest = () => {
    const { transaction, dateChangeError } = this.state;

    if (
      !transaction ||
      !transaction.transactionDateChangeRequests ||
      transaction.transactionDateChangeRequests.length === 0
    ) {
      return null;
    }

    return (
      <div className="bg-white shadow-sm my-2 p-3">
        <h5>Extend time request</h5>
        {dateChangeError && (
          <div className="alert alert-warning my-3">
            <i className="fal fa-info-circle" /> {dateChangeError}
          </div>
        )}
        <div className="row py-2">
          <div className="col-md-3">Created at</div>
          <div className="col-md-3">Extend to</div>
          <div className="col-md-3">Status</div>
          <div className="col-md-3">Actions</div>
        </div>
        {transaction.transactionDateChangeRequests.map(request => {
          const actionButtons = [];

          if (request.status === DATE_CHANGE_REQUEST_STATUSES.PENDING) {
            if (this.isSupplier) {
              actionButtons.push(
                <button
                  key={`accept-${request.id}`}
                  id={`accept-${request.id}`}
                  className="btn btn-sm btn-primary"
                >
                  Accept
                  <PopConfirm
                    target={`accept-${request.id}`}
                    title="Accept this request?"
                    message="Are you sure to accept this request?"
                    confirmText="Accept"
                    confirmColor="primary"
                    onConfirm={() =>
                      this._handleUpdateStatusDateChangeRequest(
                        request.id,
                        DATE_CHANGE_REQUEST_STATUSES.ACCEPTED
                      )
                    }
                  />
                </button>
              );
              actionButtons.push(
                <button
                  key={`deny-${request.id}`}
                  id={`deny-${request.id}`}
                  className="btn btn-sm btn-outline-danger ml-2"
                >
                  Deny
                  <PopConfirm
                    target={`deny-${request.id}`}
                    title="Deny this request?"
                    message="Are you sure to deny this request?"
                    confirmText="Deny"
                    confirmColor="danger"
                    onConfirm={() =>
                      this._handleUpdateStatusDateChangeRequest(
                        request.id,
                        DATE_CHANGE_REQUEST_STATUSES.DENIED
                      )
                    }
                  />
                </button>
              );
            } else {
              actionButtons.push(
                <button
                  key={`cancel-${request.id}`}
                  id={`cancel-${request.id}`}
                  className="btn btn-sm btn-outline-danger ml-2"
                >
                  Cancel
                  <PopConfirm
                    target={`cancel-${request.id}`}
                    title="Cancel this request?"
                    message="Are you sure to cancel this request?"
                    confirmText="Yes, cancel it"
                    confirmColor="danger"
                    onConfirm={() =>
                      this._handleUpdateStatusDateChangeRequest(
                        request.id,
                        DATE_CHANGE_REQUEST_STATUSES.CANCELED
                      )
                    }
                  />
                </button>
              );
            }
          }

          return (
            <div key={request.id} className="row py-2 border-top">
              <div className="col-md-3">
                <span className="text-muted">{formatDate(request.createdTime)}</span>
              </div>
              <div className="col-md-3">{formatDate(request.requestedEndDate)}</div>
              <div className="col-md-3">
                <span className={`badge badge-${DATE_CHANGE_REQUEST_STATUS_COLORS[request.status]}`}>
                  {request.status}
                </span>
              </div>
              <div className="col-md-3">{actionButtons}</div>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const {
      transaction,
      isFetching,
      isChanging,
      errorMessage,
      isShowExtendTimeModal,
      isShowRatingModal,
      extendableTimeRange,
    } = this.state;
    const { contractor } = this.props;

    const { equipment } = transaction;
    const requester = transaction.requester || {};
    const supplier = transaction.equipment ? transaction.equipment.contractor : {};

    if (isFetching) {
      return (
        <div className="container py-4">
          <Skeleton count={10} />
        </div>
      );
    }

    if (errorMessage) {
      return (
        <div className="container flex-fill d-flex justify-content-center align-items-center">
          <div className="alert alert-info">
            <div>
              <i className="fal fa-info-circle" /> Can not get transaction data!
            </div>
            <span className="text-muted ml-3">{errorMessage}</span>
          </div>
        </div>
      );
    }

    return (
      <div className="container py-4">
        {isChanging && <ComponentBlocking />}
        {this._renderAlert()}
        <ExtendTimeModal
          isOpen={isShowExtendTimeModal}
          transaction={transaction}
          extendableTimeRange={extendableTimeRange}
          onClose={this._handleCloseExtendTimeModal}
        />
        <RatingEquipmentTransaction
          isOpen={isShowRatingModal}
          onClose={this._toggleRatingEquipmentTransaction}
          transaction={transaction}
        />
        <div className="row">
          <div className="col-md-7">
            <div className="image-169">
              <Image src={equipment.thumbnailImage.url} />
            </div>
            <div className="bg-white shadow-sm px-2 py-2 my-2">
              {this._renderTransactionInfo()}
              <div className="my-2 text-center">
                {this.isSupplier && this._renderSupplierButtons()}
                {!this.isSupplier && this._renderRequesterButtons()}
              </div>
            </div>
            {this._renderChangeRequest()}
          </div>
          <div className="col-md-5">
            <div className="row">
              <div className="col-6">
                <h6 className="text-center">Requester</h6>
                <ContractorCard contractor={requester} ratingType="equipment" />
              </div>
              <div className="col-6">
                <h6 className="text-center">Supplier</h6>
                <ContractorCard contractor={supplier} ratingType="equipment" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EquipmentTransactionDetail.props = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  contractor: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  const { authentication } = state;
  const { contractor } = authentication;

  return {
    contractor,
  };
};

export default connect(mapStateToProps)(withTranslation()(withRouter(EquipmentTransactionDetail)));
