import React, { Component } from "react";
import { materialTransactionServices } from "Services/domain/ccp";
import { formatPrice } from "Utils/format.utils";

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
        <div key={detail.id} className="py-1 px-2 border-bottom d-flex transaction align-items-center">
          <span className="image" style={{width: 100}}>
            <img src={material.thumbnailImageUrl} alt={material.name}/>
          </span>
          <div className="flex-fill">
            <h6>{material.name}</h6>
            <div>
              <img src={material.contractor.thumbnailImageUrl} className="rounded-circle" width="30" height="30" alt=""/> <Link to={getRoutePath(routeConsts.PROFILE_CONTRACTOR, { id: material.contractor.id })}>{material.contractor.name}</Link>
            </div>
          </div>
          <div className="flex-fill">
            <i className="fal fa-money-bill"></i> {formatPrice(detail.price)}<small>/{detail.unit}</small>
          </div>
          <div className="flex-fill">
            <i className="fal fa-archive"></i> {detail.quantity}
          </div>
          <div className="flex-fill text-right pr-3">
            <span class="text-large">{formatPrice(detail.price * detail.quantity)}</span>
          </div>
        </div>
      );
    });

    list.push(
      <div key="total" className="py-3 px-2 border-bottom d-flex transaction align-items-center">
        <div className="flex-fill text-right pr-3">
          TOTAL: <span class="text-large text-primary">{formatPrice(total)}</span>
        </div>
      </div>
    );
    return list;
  };

  render() {
    const { transaction } = this.state;

    return (
      <div className="container">
        <h2 className="my-3">Material request #{transaction.id} detail - {transaction.status}</h2>
        <div className="row">
          <div className="col-md-4"></div>
          <div className="col-md-9">
            <div className="bg-white">
              {this._renderDetails()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MaterialRequestDetail;
