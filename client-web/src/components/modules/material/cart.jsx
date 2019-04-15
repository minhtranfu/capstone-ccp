import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";

import { formatPrice } from 'Utils/format.utils';
import { AddressInput, ComponentBlocking } from 'Components/common';
import { materialCartActions } from "Redux/actions";
import { getRoutePath, getErrorMessage } from 'Utils/common.utils';
import { routeConsts } from 'Common/consts';
import { materialTransactionServices } from 'Services/domain/ccp';

class Cart extends PureComponent {

  state = {
    address: null,
    isFetching: false,
    transactions: null
  };
  total = 0;

  /**
   * Update item in redux
   */
  _handleUpdateQuantity = (item, quantity) => {
    const { updateItem } = this.props;
    
    updateItem({
      ...item,
      quantity
    });
  };

  _handleRemoveItem = itemId => {
    const { removeItem } = this.props;
    removeItem(itemId);
  };

  /**
   * Render an item in table
   */
  _renderItem = material => {

    this.total += material.price * material.quantity;

    return (
      <tr key={material.id} className="py-1 border-bottom transaction align-items-center">
        <td>
          <button className="btn btn-link text-danger"
            onClick={() => this._handleRemoveItem(material.id)}
          >
            <i className="fal fa-trash"></i>
          </button>
        </td>
        <td className="image text-center">
          <img src={material.thumbnailImageUrl} alt={material.name} style={{ height: 100, maxWidth: 100 }} />
        </td>
        <td>
          <h6>{material.name}</h6>
          <div>
            <img src={material.contractor.thumbnailImageUrl} className="rounded-circle" width="30" height="30" alt="" /> {material.contractor.name}
          </div>
        </td>
        <td>
          <i className="fal fa-money-bill"></i> {formatPrice(material.price)}<small>/{material.materialType.unit}</small>
        </td>
        <td>
          <input type="number" className="form-control"
            min={1}
            style={{width: 80}}
            value={material.quantity}
            onChange={e => {
              this._handleUpdateQuantity(material, e.target.value);
            }}
          />
        </td>
        <td className="text-right pr-3">
          <span className="text-large">{formatPrice(material.price * material.quantity)}</span>
        </td>
      </tr>
    );
  };

  /**
   * Render detail table
   */
  _renderDetails = () => {
    const { materialCart } = this.props;
    this.total = 0;

    const details = materialCart.items.map(item => {
      return this._renderItem(item);
    });

    return (
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th className="border-top-0" width="20"></th>
              <th className="border-top-0" width="100"></th>
              <th className="border-top-0">Name</th>
              <th className="border-top-0">Price</th>
              <th className="border-top-0">Quantity</th>
              <th className="border-top-0">Total</th>
            </tr>
          </thead>
          <tbody>
            {details}
          </tbody>
        </table>
      </div>
    );
  };

  /**
   * Validate and request cart
   */
  _handleSubmitForm = async e => {
    e.preventDefault();
    const { materialCart } = this.props;
    const { address } = this.state;

    const materialTransactionDetails = materialCart.items.map(item => {
      return {
        quantity: item.quantity,
        material: {
          id: item.id
        }
      };
    });
    const transactionData = {
      requesterAddress: address.address,
      requesterLat: address.latitude,
      requesterLong: address.longitude,
      materialTransactionDetails
    };

    this.setState({
      isFetching: true
    });

    try {
      const transactions = await materialTransactionServices.postTransaction(transactionData);

      this.setState({
        transactions,
        isFetching: false
      });

    } catch (error) {
      const errorMessage = getErrorMessage(error);

      this.setState({
        errorMessage,
        isFetching: false
      });
    }
  };

  /**
   * Set address result into state
   */
  _handleSelectAddress = address => {
    this.setState({
      address
    });
  };

  /**
   * Render request form for right sidebar
   */
  _renderRequestForm = () => {
    const { address, isFetching } = this.state;

    return (
      <div className="px-3 py-4">
        <div className="d-flex justify-content-between text-large border-bottom pb-3 mb-3">
          <span className="text-muted">Total:</span>
          <span className="text-primary">{formatPrice(this.total)}</span>
        </div>
        <form onSubmit={this._handleSubmitForm}>
          <p className="alert alert-info"><i className="fal fa-info-circle"></i> Input receive address to request</p>
          <div className="form-group">
            <label htmlFor="request_address">Address: <i className="text-danger">*</i></label>
            <AddressInput onSelect={this._handleSelectAddress} inputProps={{ id: 'request_address' }} />
          </div>
          <button className="btn btn-block btn-primary" disabled={!address || isFetching}>Request</button>
        </form>
      </div>
    );
  };

  /**
   * Render cart is empty screen
   */
  _renderCartEmpty = () => {
    return (
      <div className="container flex-fill d-flex justify-content-center align-items-center flex-column flex-sm-row">
        <i className="fal fa-shopping-cart fa-9x text-muted"></i>
        <div className="px-3 text-center text-sm-left">
          <h3>Your cart is empty!</h3>
          <Link to={getRoutePath(routeConsts.MATERIALS)} className="btn btn-primary mt-2 shadow-sm">Find material</Link>
        </div>
      </div>
    );
  };

  render() {
    const { transactions, isFetching, errorMessage } = this.state;
    const { materialCart } = this.props;

    if (materialCart.items.length === 0) {
      return this._renderCartEmpty();
    }

    if (transactions) {
      return <Redirect to={getRoutePath(routeConsts.MATERIAL_REQUEST)} />;
    }

    return (
      <div className="container">
        {isFetching &&
          <ComponentBlocking />
        }
        <h3 className="my-3">
          My material cart
        </h3>
        {errorMessage &&
          <div className="alert alert-warning">
            <i className="fal fa-info-circle"></i> {errorMessage}
          </div>
        }
        <div className="row">
          <div className="col-md-9">
            <div className="bg-white">
              {this._renderDetails()}
            </div>
          </div>
          <div className="col-md-3">
            <div className="bg-white mb-3">
              {this._renderRequestForm()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Cart.props = {
  materialCart: PropTypes.object.isRequired,
  updateItem: PropTypes.func,
  removeItem: PropTypes.func,
  clearCart: PropTypes.func,
};

const mapStateToProps = state => {
  const { materialCart } = state;

  return {
    materialCart
  }
};

const mapDispatchToProps = {
  updateItem: materialCartActions.updateItem,
  removeItem: materialCartActions.removeItem,
  clearCart: materialCartActions.clear
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
