import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';

import { materialTransactionServices } from 'Services/domain/ccp';
import { formatPrice, formatDate } from 'Utils/format.utils';
import { getRoutePath, getErrorMessage } from 'Utils/common.utils';
import {
  routeConsts,
  MATERIAL_TRANSACTION_STATUSES,
  MATERIAL_TRANSACTION_STATUS_COLORS,
} from 'Common/consts';
import { RatingMaterialModal } from 'Components/common';

class MaterialRequestDetail extends Component {
  state = {
    transaction: {},
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

  /**
   * Load equipment detail
   */
  _loadData = async () => {
    const { contractor, match } = this.props;
    const { params } = match;
    const { id } = params;

    const transaction = await materialTransactionServices.getTransactionById(id);
    this.isRequester = contractor.id === transaction.requester.id;

    this.setState({
      transaction,
    });
  };

  componentDidMount() {
    this._loadData();
  }

  /**
   * Mark material detail as feedbacked
   */
  _getTransactionUpdatedDetail = updatedDetail => {
    const { transaction } = this.state;

    const materialTransactionDetails = transaction.materialTransactionDetails.map(detail => {
      if (detail.id !== updatedDetail.id) {
        return detail;
      }

      return updatedDetail;
    });

    return {
      ...transaction,
      materialTransactionDetails,
    };
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
      const title = getErrorMessage(error);

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
   * Show feedback modal
   */
  _toggleRatingMaterialDetail = feedbackDetail => {
    const { isShowRatingMaterialDetail } = this.state;
    const newState = {
      isShowRatingMaterialDetail: !isShowRatingMaterialDetail,
      feedbackDetail,
    };

    // Handle feedbacked detail
    if (feedbackDetail && feedbackDetail.feedbacked) {
      newState.transaction = this._getTransactionUpdatedDetail();
      newState.feedbackDetail = undefined;
    }

    this.setState(newState);
  };

  _renderDetails = () => {
    const { transaction } = this.state;

    if (!transaction.materialTransactionDetails) {
      return;
    }

    let total = 0;
    const list = transaction.materialTransactionDetails.map(detail => {
      const { material } = detail;

      total += detail.price * detail.quantity;
      return (
        <tr key={detail.id} className="py-1 border-bottom transaction align-items-center">
          <td className="image text-center">
            <Link
              to={getRoutePath(routeConsts.MATERIAL_DETAIL, { id: material.id })}
            >
              <img
                src={material.thumbnailImageUrl}
                alt={material.name}
                style={{ height: 100, maxWidth: 100 }}
              />
            </Link>
          </td>
          <td>
            <Link
              to={getRoutePath(routeConsts.MATERIAL_DETAIL, { id: material.id })}
            >
              <h6>{material.name}</h6>
            </Link>
            <div>
              <Link
                to={getRoutePath(routeConsts.PROFILE_CONTRACTOR, { id: material.contractor.id })}
              >
                <img
                  src={material.contractor.thumbnailImageUrl}
                  className="rounded-circle"
                  width="30"
                  height="30"
                  alt=""
                />{' '}
                {material.contractor.name}
              </Link>
            </div>
            <div className="mt-2">
              {this.isRequester &&
                transaction.status === MATERIAL_TRANSACTION_STATUSES.FINISHED &&
                !detail.feedbacked && (
                  <button
                    className="btn btn-sm btn-outline-primary mr-2"
                    onClick={() => this._toggleRatingMaterialDetail(detail)}
                  >
                    Feedback
                  </button>
                )}
              {this.isRequester &&
                transaction.status === MATERIAL_TRANSACTION_STATUSES.FINISHED &&
                detail.feedbacked && <span className="text-success mr-3">Feedbacked</span>}
              {this.isRequester && (
                <Link
                  className="btn btn-sm btn-outline-primary"
                  to={getRoutePath(routeConsts.MATERIAL_DETAIL, { id: material.id })}
                >
                  Buy again
                </Link>
              )}
            </div>
          </td>
          <td>
            <i className="fal fa-money-bill" /> {formatPrice(detail.price)}
            <small>/{detail.unit}</small>
          </td>
          <td>
            <i className="fal fa-archive" /> {detail.quantity}
          </td>
          <td className="text-right pr-3">
            <span className="text-large">{formatPrice(detail.price * detail.quantity)}</span>
          </td>
        </tr>
      );
    });

    list.push(
      <tr key="total" className="py-3 transaction align-items-center">
        <td className="text-right pr-3" colSpan="5">
          TOTAL: <span className="text-large text-primary">{formatPrice(total)}</span>
        </td>
      </tr>
    );
    return list;
  };

  _renderActionButtons = () => {
    const { transaction } = this.state;

    const buttons = [];

    switch (transaction.status) {
      case MATERIAL_TRANSACTION_STATUSES.PENDING:
        if (!this.isRequester) {
          buttons.push(
            <button
              key={`accept-${transaction.id}`}
              className="btn btn-success ml-2"
              onClick={() =>
                this._handleChangeStatus(transaction.id, MATERIAL_TRANSACTION_STATUSES.ACCEPTED)
              }
            >
              Accept
            </button>
          );

          buttons.push(
            <button
              key={`deny-${transaction.id}`}
              className="btn btn-outline-danger ml-2"
              onClick={() =>
                this._handleChangeStatus(transaction.id, MATERIAL_TRANSACTION_STATUSES.DENIED)
              }
            >
              Deny
            </button>
          );
        } else {
          buttons.push(
            <button
              key={`deny-${transaction.id}`}
              className="btn btn-outline-danger ml-2"
              onClick={() =>
                this._handleChangeStatus(transaction.id, MATERIAL_TRANSACTION_STATUSES.CANCELED)
              }
            >
              Cancel
            </button>
          );
        }
        break;

      case MATERIAL_TRANSACTION_STATUSES.ACCEPTED:
        if (!this.isRequester) {
          buttons.push(
            <button
              key={`deliver-${transaction.id}`}
              className="btn btn-success ml-2"
              onClick={() =>
                this._handleChangeStatus(transaction.id, MATERIAL_TRANSACTION_STATUSES.DELIVERING)
              }
            >
              Deliver
            </button>
          );
        } else {
          buttons.push(
            <button
              key={`deny-${transaction.id}`}
              className="btn btn-outline-danger ml-2"
              onClick={() =>
                this._handleChangeStatus(transaction.id, MATERIAL_TRANSACTION_STATUSES.CANCELED)
              }
            >
              Cancel
            </button>
          );
        }
        break;

      case MATERIAL_TRANSACTION_STATUSES.DELIVERING:
        if (this.isRequester) {
          buttons.push(
            <button
              key={`deny-${transaction.id}`}
              className="btn btn-outline-danger ml-2"
              onClick={() =>
                this._handleChangeStatus(transaction.id, MATERIAL_TRANSACTION_STATUSES.CANCELED)
              }
            >
              Cancel
            </button>
          );

          buttons.push(
            <button
              key={`receive-${transaction.id}`}
              className="btn btn-success ml-2"
              onClick={() =>
                this._handleChangeStatus(transaction.id, MATERIAL_TRANSACTION_STATUSES.FINISHED)
              }
            >
              Receive
            </button>
          );
        }
        break;
    }

    if (buttons.length === 0) {
      return null;
    }

    return <div className="p-3 text-right">{buttons}</div>;
  };

  render() {
    const { transaction, isShowRatingMaterialDetail, feedbackDetail } = this.state;

    return (
      <div className="container">
        {this._renderAlert()}
        <RatingMaterialModal
          isOpen={isShowRatingMaterialDetail}
          onClose={() => this._toggleRatingMaterialDetail()}
          transaction={feedbackDetail}
        />
        <h4 className="my-3">
          Material request: #{transaction.id} - {transaction.status}
        </h4>
        <div className="row">
          <div className="col-md-3">
            <div className="bg-white p-3 shadow-sm">
              <div className="my-2">
                Status:{' '}
                <span
                  className={`badge badge-${
                    MATERIAL_TRANSACTION_STATUS_COLORS[transaction.status]
                  }`}
                >
                  {transaction.status}
                </span>
              </div>
              <div className="my-2">
                <i className="fal fa-calendar" /> {formatDate(transaction.createdTime)}
              </div>
              <div className="my-2">
                <i className="fal fa-map-marker" /> {transaction.requesterAddress}
              </div>
            </div>
          </div>
          <div className="col-md-9">
            <div className="bg-white shadow-sm">
              <table className="table">
                <thead>
                  <tr>
                    <th className="border-top-0" width="100" />
                    <th className="border-top-0">Name</th>
                    <th className="border-top-0">Price</th>
                    <th className="border-top-0">Quantity</th>
                    <th className="border-top-0">Total</th>
                  </tr>
                </thead>
                <tbody>{this._renderDetails()}</tbody>
              </table>

              {this._renderActionButtons()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { authentication } = state;
  const { contractor } = authentication;

  return {
    contractor,
  };
};

export default connect(mapStateToProps)(MaterialRequestDetail);
