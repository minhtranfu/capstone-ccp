import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { authActions, materialCartActions } from 'Redux/actions';
import { formatPrice } from 'Src/utils/format.utils';
import { getRoutePath } from 'Utils/common.utils';
import { routeConsts } from 'Common/consts';

class RequestCard extends Component {

  constructor(props) {
    super(props);

    const { material } = props;

    this.state = {
      isRequestNow: false,
      material,
      quantity: 1,
    }
  }

  /**
   * Handle user input to address field
   */
  _handleChangeAddress = address => {
    this.setState({ address });
  };

  /**
   * Handle user field value change
   */
  _handleChangeQuantity = e => {
    let { value } = e.target;

    const quantity = `${value}`.replace(/[^0-9\.]/g, '').replace(/(.+)\.(.+)?\./g, '$1.$2');

    this.setState({
      quantity
    });
  };

  _addToCart = () => {
    const { material, quantity } = this.state;
    const { addItem } = this.props;

    const item = {
      ...material,
      quantity: +quantity
    };
    addItem(item);
  };

  _requestNow = () => {
    this._addToCart();

    this.setState({
      isRequestNow: true,
    });
  };

  render() {
    const { authentication, toggleLoginModal } = this.props;
    const { isFetching, material, quantity, isRequestNow } = this.state;

    return (
      <div className="request-card bg-white shadow border-primary">
        {isRequestNow &&
          <Redirect push to={`${getRoutePath(routeConsts.MATERIAL_CART)}?itemId=${material.id}`} />
        }
        <div className="my-2 pb-2 border-bottom">
          <i className="fal fa-money-bill"></i> Price:
          <span className="float-right text-x-large">
            {formatPrice(material.price)}
            <small>
              <small className="text-muted">/{material.materialType.unit}</small>
            </small>
          </span>
        </div>
        <div className="form-group d-flex">
          <label htmlFor="transaction_quantity" className="d-flex align-items-end mr-2">
            Quantity:<i className="text-danger">*</i>
          </label>
          <input
            type="text"
            name="quantity"
            id="transaction_quantity"
            className="form-control flex-fill"
            min={1} max={99999999}
            value={quantity}
            onInput={this._handleChangeQuantity}
          />
        </div>
        <div className="text-center my-3 py-2 border-top border-bottom">
          {!quantity &&
            <span className="text-muted">Input quantity to see fee</span>
          }
          {!!quantity &&
            <div className="text-left">
              Total: <span className="float-right text-x-large">{formatPrice(quantity * material.price)}</span>
            </div>
          }
        </div>
        {authentication.isAuthenticated &&
          <div>
            <button className="btn btn-outline-primary btn-block mt-2" disabled={isFetching || !quantity} onClick={this._addToCart}>
              {isFetching &&
                <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
              }
              Add to card
            </button>
            <button className="btn btn-primary btn-block mt-2" disabled={isFetching || !quantity} onClick={this._requestNow}>
              {isFetching &&
                <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
              }
              Request Now
            </button>
          </div>
        }
        {!authentication.isAuthenticated &&
          <button className="btn btn-success btn-block mt-2" onClick={toggleLoginModal}>
            Login to request
          </button>
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { authentication } = state;

  return {
    authentication
  };
};

const mapDispatchToProps = {
  toggleLoginModal: authActions.toggleLoginModal,
  addItem: materialCartActions.addItem
};

export default connect(mapStateToProps, mapDispatchToProps)(RequestCard);
