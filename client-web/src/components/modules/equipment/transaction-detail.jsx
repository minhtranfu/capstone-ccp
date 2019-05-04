import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import PropTypes from 'prop-types';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import SweetAlert from 'react-bootstrap-sweetalert';

import { getErrorMessage, getRoutePath } from 'Utils/common.utils';
import { equipmentTransactionServices } from 'Services/domain/ccp';
import { Image, StarRatings, RatingEquipmentTransaction, ContractorCard } from 'Components/common';
import { formatPrice, formatDate } from 'Utils/format.utils';
import { EQUIPMENT_STATUSES, TRANSACTION_STATUSES, TRANSACTION_STATUS_CLASSES, routeConsts } from 'Common/consts';
import CcpApiService from 'Services/domain/ccp-api-service';
import ExtendTimeModal from '../requester-dashboard/extend-time-modal';

class EquipmentTransactionDetail extends PureComponent {
  state = {
    isFetching: true,
    isShowExtendTimeModal: false,
    isShowRatingModal: false,
    transaction: {},
    errorMessage: null,
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

  changingEquipmentStatusMessage = {
    [EQUIPMENT_STATUSES.RENTING]: 'Have you received the equipment?',
    [EQUIPMENT_STATUSES.WAITING_FOR_RETURNING]: 'You want to return this equipment early?'
  };

  showableStatuses = {
    [TRANSACTION_STATUSES.PENDING]: 'Pending',
    [TRANSACTION_STATUSES.ACCEPTED]: 'Accepted',
    [TRANSACTION_STATUSES.PROCESSING]: 'Processing',
    [TRANSACTION_STATUSES.FINISHED]: 'Finished',
    [TRANSACTION_STATUSES.DENIED]: 'Denied'
  };

  _loadTransactionData = async () => {
    const { params } = this.props.match;
    const { id } = params;

    try {
      const transaction = await equipmentTransactionServices.getTransactionsById(id);
      this.setState({
        transaction,
        isFetching: false,
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
    this.setState({
      alert,
      confirm: {},
      transaction
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
      const res = await CcpApiService.updateEquipmentStatus(transaction.equipment.id, status);

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

  _renderSupplierButtons = () => {
    const { transaction } = this.state;
    const { equipment } = transaction;

    let changeStatusButtons = '';
    switch (transaction.status) {
      case TRANSACTION_STATUSES.PENDING:
        statusClasses += ' badge-info';
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
        statusClasses += ' badge-success';
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
  _toggleRatingEquipmentTransaction = (feedbacked) => {
    const { isShowRatingModal, transaction } = this.state;
    const newState = {
      isShowRatingModal: !isShowRatingModal,
    };

    if (feedbacked === true) {
      newState.transaction = {
        ...transaction,
        feedbacked
      };
    }

    this.setState(newState);
  };

  _renderRequesterButtons = () => {
    const { transaction } = this.state;
    const { equipment } = transaction;

    let changeStatusButtons = '';
    switch (transaction.status) {
      case TRANSACTION_STATUSES.ACCEPTED:
        statusClasses += 'badge-success';
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
            <button
              className="ml-2 btn btn-sm btn-outline-info"
              onClick={() => this._handleAdjustTime(transaction)}
            >
              Extend hiring time
            </button>
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
              <button
                className="ml-2 btn btn-sm btn-outline-info"
                onClick={() => this._handleAdjustTime(transaction)}
              >
                Extend hiring time
              </button>
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
              <button
                className="ml-2 btn btn-sm btn-outline-info"
                onClick={() => this._handleAdjustTime(transaction)}
              >
                Extend hiring time
              </button>
            </div>
          );
        }
        statusClasses += 'badge-warning';
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
              <span className="text-muted">{t('equipment.transaction.status')}:</span> {transaction.status}
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
  _handleCloseExtendTimeModal = (transaction, isChanged) => {

    const newState = {
      isShowExtendTimeModal: false,
    };

    if (isChanged) {
      newState.transaction = {
        ...transaction
      };
    }

    this.setState(newState);
  };

  render() {
    const { transaction, isFetching, errorMessage, isShowExtendTimeModal, isShowRatingModal } = this.state;
    const { contractor } = this.props;

    const { equipment } = transaction;
    const requester = transaction.requester || {};
    const supplier = transaction.equipment ? transaction.equipment.contractor : {};
    const isSupplier = supplier.id === contractor.id;

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
        {this._renderAlert()}
        <ExtendTimeModal isOpen={isShowExtendTimeModal} transaction={transaction} onClose={this._handleCloseExtendTimeModal}/>
        <RatingEquipmentTransaction
          isOpen={isShowRatingModal}
          onClose={this._toggleRatingEquipmentTransaction}
          transaction={transaction}
        />
        <div className="row">
          <div className="col-md-7">
            <div className="image-169">
              <Image
                src={equipment.thumbnailImage.url}
              />
            </div>
            <div className="bg-white shadow-sm px-2 py-2 my-2">
              {this._renderTransactionInfo()}
              <div className="my-2 text-center">
                {isSupplier && this._renderSupplierButtons()}
                {!isSupplier && this._renderRequesterButtons()}
              </div>
            </div>
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