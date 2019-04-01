import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';

class MaterialTransaction extends Component {

  _renderSupplier = () => {
    return (
      <div className="contractor-detail flex-fill p-2 text-center">
        <img
          className="rounded-circle"
          style={{ width: '50px', height: '50px' }}
          src={supplier.thumbnailImage || 'https://www.shareicon.net/download/2016/04/10/747369_man.svg'}
        />
        <div>{supplier.name}</div>
        {supplier.averageMaterialRating > 0 &&
          <StarRatings
            rating={supplier.averageMaterialRating}
            numberOfStars={5}
            starRatedColor="#ffac00"
            starDimension="20px"
            starSpacing="0px"
          />
        }
      </div>
    );
  };

  /**
   * Show rating modal
   */
  _toggleRatingMaterialTransaction = (feedbackTransaction) => {
    const { isShowRatingMaterialTransaction } = this.state;
    this.setState({
      isShowRatingMaterialTransaction: !isShowRatingMaterialTransaction,
      feedbackTransaction
    });
  };

  _moreInfos = () => {
    const { transaction } = this.props;

    let statusClasses = 'badge ';
    let changeStatusButtons = '';
    switch (transaction.status) {
      case MATERIAL_TRANSACTION_STATUSES.PENDING:
        statusClasses += ' badge-info';
        break;

      case MATERIAL_TRANSACTION_STATUSES.ACCEPTED:
        this._countNeedActionForStatus(MATERIAL_TRANSACTION_STATUSES.ACCEPTED);
        statusClasses += ' badge-success';
        changeStatusButtons = (
          <div className="mt-2">
            <button className="btn btn-sm btn-outline-danger ml-2" onClick={() => this._handleChangeStatus(transaction.id, MATERIAL_TRANSACTION_STATUSES.CANCELED)}>Cancel</button>
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
        this._countNeedActionForStatus(MATERIAL_TRANSACTION_STATUSES.DELIVERING);
        statusClasses += 'badge-warning';

        changeStatusButtons = (
          <div className="mt-2">
            <button className="btn btn-sm btn-success" onClick={() => this._handleChangeStatus(transaction.id, MATERIAL_TRANSACTION_STATUSES.FINISHED)}>Receive</button>
          </div>
        );

        break;

      case MATERIAL_TRANSACTION_STATUSES.FINISHED:
        statusClasses += 'badge-success';
        changeStatusButtons = (
          <div className="mt-2">
            <button className="btn btn-sm btn-success" onClick={() => this._toggleRatingMaterialTransaction(transaction)}>Feedback</button>
          </div>
        );
        break;
    }

    return { changeStatusButtons, statusClasses };
  };

  render() {
    const { transaction } = this.props;
    const { statusClasses, changeStatusButtons } = this._moreInfos();

    return (
      <CSSTransition
        key={transaction.id}
        classNames="fade"
        timeout={500}
      >
        <div className="d-flex transaction my-3 rounded shadow-sm flex-column flex-sm-row">
          <div className="detail flex-fill p-2">
            <h6><span className={statusClasses}>{transaction.status}</span> {supplier.name}</h6>
            <div>
              <span>Material: {transaction.materialTransactionDetails.length}</span>
            </div>
            <div>
              <span>Total fee: {formatPrice(transaction.totalPrice)}</span>
            </div>
            {changeStatusButtons}
          </div>
          <div className="px-3 d-flex flex-column justify-content-center">
            <button className="btn btn-outline-primary">View detail</button>
          </div>
        </div>
      </CSSTransition>
    );
  }
}

export default MaterialTransaction;
