import React, { Component } from "react";
import { Link } from "react-router-dom";

import { materialTransactionServices } from "Services/domain/ccp";
import { formatPrice, formatDate } from "Utils/format.utils";
import { getRoutePath } from "Utils/common.utils";
import { routeConsts, MATERIAL_TRANSACTION_STATUSES } from "Common/consts";
import { RatingMaterialModal } from "Components/common";

class MaterialRequestDetail extends Component {

  state = {
    transaction: {}
  };

  /**
   * Load equipment detail
   */
  _loadData = async () => {
    const { params } = this.props.match;
    const { id } = params;

    const transaction = await materialTransactionServices.getTransactionById(id);

    this.setState({
      transaction
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
      materialTransactionDetails
    };
  };

  /**
   * Show feedback modal
   */
  _toggleRatingMaterialDetail = (feedbackDetail) => {
    console.log(feedbackDetail);
    const { isShowRatingMaterialDetail } = this.state;
    const newState = {
      isShowRatingMaterialDetail: !isShowRatingMaterialDetail,
      feedbackDetail
    };

    // Handle feedbacked detail
    if (feedbackDetail && feedbackDetail.feedbacked) {
      window.alert('asdasdasd');
      newState.transaction = this._getTransactionUpdatedDetail();
      newState.feedbackDetail = undefined;
    }
    console.log(newState);

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
            <img src={material.thumbnailImageUrl} alt={material.name} style={{ height: 100, maxWidth: 100 }} />
          </td>
          <td>
            <h6>{material.name}</h6>
            <div>
              <img src={material.contractor.thumbnailImageUrl} className="rounded-circle" width="30" height="30" alt="" /> {material.contractor.name}
            </div>
            <div className="mt-2">
              {transaction.status === MATERIAL_TRANSACTION_STATUSES.FINISHED && !detail.feedbacked &&
                <button className="btn btn-sm btn-outline-primary mr-2" onClick={() => this._toggleRatingMaterialDetail(detail)}>Feedback</button>
              }
              {transaction.status === MATERIAL_TRANSACTION_STATUSES.FINISHED && detail.feedbacked &&
                <span className="text-success mr-3">Feedbacked</span>
              }
              <Link className="btn btn-sm btn-outline-primary" to={getRoutePath(routeConsts.MATERIAL_DETAIL, { id: material.id })}>Buy again</Link>
            </div>
          </td>
          <td>
            <i className="fal fa-money-bill"></i> {formatPrice(detail.price)}<small>/{detail.unit}</small>
          </td>
          <td>
            <i className="fal fa-archive"></i> {detail.quantity}
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

  render() {
    const { transaction, isShowRatingMaterialDetail, feedbackDetail } = this.state;

    return (
      <div className="container">
        <RatingMaterialModal
          isOpen={isShowRatingMaterialDetail}
          onClose={() => this._toggleRatingMaterialDetail()}
          transaction={feedbackDetail}
        />
        <h2 className="my-3">Material request #{transaction.id} detail - {transaction.status}</h2>
        <div className="row">
          <div className="col-md-3">
            <div className="bg-white p-3 shadow-sm">
              <div className="my-2">Status: {transaction.status}</div>
              <div className="my-2">
                <i className="fal fa-calendar"></i> {formatDate(transaction.createdTime)}
              </div>
              <div className="my-2">
                <i className="fal fa-map-marker"></i> {transaction.requesterAddress}
              </div>
            </div>
          </div>
          <div className="col-md-9">
            <div className="bg-white shadow-sm">
              <table className="table">
                <thead>
                  <tr>
                    <th className="border-top-0" width="100"></th>
                    <th className="border-top-0">Name</th>
                    <th className="border-top-0">Price</th>
                    <th className="border-top-0">Quantity</th>
                    <th className="border-top-0">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {this._renderDetails()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MaterialRequestDetail;
