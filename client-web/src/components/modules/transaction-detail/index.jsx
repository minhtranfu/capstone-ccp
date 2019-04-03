import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

import Image from '../../common/Image';
import ccpApiService from '../../../services/domain/ccp-api-service';

class TransactionDetail extends Component {
  state = {};

  _loadTransactionData = async () => {
    const { params } = this.props.match;
    const { id } = params;

    try {
      const transaction = await ccpApiService.getTransactionsById(id);
      setTimeout(() => this.setState({ transaction }), 900);
    } catch (error) {
      console.log(error);
      window.alert('Error occured while loading transaction data!');
    }

  };

  componentDidMount() {
    this._loadTransactionData();
  }

  render() {
    const { transaction } = this.state;

    if (!transaction) {
      return (
        <div className="container py-4">
          <Skeleton count={10} />
        </div>
      );
    }

    return (
      <div className="container py-4">
        <div className="row">
          <div className="col-md-9">
            <h1 className="align-text-bottom">
              <span className="badge badge-pill badge-success">{transaction.beginDate} - {transaction.endDate}</span>
              {transaction.equipment.name}
            </h1>
            <div className="row">
              <div className="col-md-4">
                <h4>Status: {transaction.status}</h4>
              </div>
              <div className="col-md-4">
                <h4>Daily Price: {transaction.dailyPrice}đ</h4>
              </div>
              <div className="col-md-4">
                <h4>Delivery Price: {transaction.deliveryPrice} đ</h4>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <h4 className="text-center">Supplier</h4>
            <div className="constructor-card text-center">
                <Image src={transaction.equipment.contractor && transaction.equipment.contractor.thumbnailImageUrl ? transaction.equipment.contractor.thumbnailImageUrl : 'https://www.shareicon.net/download/2016/04/10/747369_man.svg'} className="rounded-circle w-50" alt="" />
                <h5>{transaction.equipment.contractor ? transaction.equipment.contractor.name : <Skeleton />}</h5>
                <p className="mt-0">
                  Join at: {transaction.equipment.contractor
                    ? new Date(transaction.equipment.contractor.createdTime).toDateString()
                    : <span className="d-inline"><Skeleton width={100} /></span>
                  }
                </p>
              </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(TransactionDetail);
