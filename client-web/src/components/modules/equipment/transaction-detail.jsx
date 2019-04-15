import React, { PureComponent } from 'react';
import { withRouter } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import PropTypes from 'prop-types';

import { getErrorMessage } from 'Utils/common.utils';
import { equipmentTransactionServices } from 'Services/domain/ccp';
import { Image, StarRatings } from "Components/common";
import { formatPrice } from 'Utils/format.utils';

class EquipmentTransactionDetail extends PureComponent {
  state = {
    isFetching: true,
    transaction: {},
    errorMessage: null,
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

  render() {
    const { transaction, isFetching, errorMessage } = this.state;

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
              <i className="fal fa-info-circle"></i> Can not get transaction data!
            </div>
            <span className="text-muted ml-3">{errorMessage}</span>
          </div>
        </div>
      );
    }

    return (
      <div className="container py-4">
        <div className="row">
          <div className="col-md-7">
            <div className="bg-white shadow-sm px-2 py-2 mb-2">
              <h3 className="align-text-bottom">
                <span className="badge badge-pill badge-success">{transaction.beginDate} - {transaction.endDate}</span>
                {transaction.equipment.name}
              </h3>
              <div className="row">
                <div className="col-md-4">
                  <h6>Status: {transaction.status}</h6>
                </div>
                <div className="col-md-4">
                  <h6>Daily Price: {formatPrice(transaction.dailyPrice)}</h6>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-5">
            <div className="row">
              <div className="col-6">
                <h6 className="text-center">Requester</h6>
                <div className="constructor-card text-center">
                  <Image
                    circle
                    width={125}
                    height={125}
                    className="rounded-circle" alt="Avatar"
                    src={requester.thumbnailImageUrl}
                  />
                  <h5 className="mb-0">{requester.name || <Skeleton />}</h5>
                  <StarRatings
                    rating={requester.averageEquipmentRating}
                  />
                  <p className="mt-0">
                    Joined: {requester.createdTime
                      ? new Date(requester.createdTime).toDateString()
                      : <span className="d-inline"><Skeleton width={100} /></span>
                    }
                  </p>
                </div>
              </div>
              <div className="col-6">
                <h6 className="text-center">Supplier</h6>
                <div className="constructor-card text-center">
                  <Image
                    circle
                    width={125}
                    height={125}
                    className="rounded-circle" alt="Avatar"
                    src={supplier.thumbnailImageUrl}
                  />
                  <h5 className="mb-0">{supplier.name || <Skeleton />}</h5>
                  <StarRatings
                    rating={supplier.averageEquipmentRating}
                  />
                  <p className="mt-0">
                    Joined: {supplier.createdTime
                      ? new Date(supplier.createdTime).toDateString()
                      : <span className="d-inline"><Skeleton width={100} /></span>
                    }
                  </p>
                </div>
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
};

export default withRouter(EquipmentTransactionDetail);
