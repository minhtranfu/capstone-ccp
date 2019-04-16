import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { Link, Redirect, withRouter } from "react-router-dom";
import qs from 'query-string';

import { formatPrice } from 'Utils/format.utils';
import { AddressInput, ComponentBlocking, Image } from 'Components/common';
import { materialCartActions } from "Redux/actions";
import { getRoutePath, getErrorMessage } from 'Utils/common.utils';
import { routeConsts } from 'Common/consts';
import { materialTransactionServices } from 'Services/domain/ccp';

class Cart extends PureComponent {

  constructor(props) {
    super(props);

    
    const selectedItemIds = this._getSelectedItemIds(props);
    this.state = {
      selectedItemIds,
      address: null,
      isFetching: false,
      transactions: null,
    };
  }

  total = 0;

  _getSelectedItemIds = props => {
    const { materialCart, location } = props;
    const queryParams = qs.parse(location.search);
    let selectedItemIds = [];
    if (queryParams.itemId && materialCart.itemIds.includes(+queryParams.itemId)) {
      selectedItemIds.push(+queryParams.itemId);
    } else {
      selectedItemIds = [
        ...materialCart.itemIds,
      ];
    }

    return selectedItemIds;
  };

  _handleChangeSelectedItem = prevProps => {
    const { location } = this.props;

    if (location.search === prevProps.location.search) {
      return;
    }

    const selectedItemIds = this._getSelectedItemIds(this.props);
    this.setState({
      selectedItemIds,
    });
  };

  componentDidUpdate(prevProps) {
    this._handleChangeSelectedItem(prevProps);
  }

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

  _handleSelectItem = id => {
    const { selectedItemIds } = this.state;

    if (selectedItemIds.includes(id)) {
      this.setState({
        selectedItemIds: selectedItemIds.filter(itemId => itemId !== +id),
      });

      return;
    }

    this.setState({
      selectedItemIds: [
        ...selectedItemIds,
        +id,
      ],
    });
  };

  _toggleAll = () => {
    const { selectedItemIds } = this.state;
    const { materialCart } = this.props;

    if (selectedItemIds.length === materialCart.items.length) {
      this.setState({
        selectedItemIds: [],
      });

      return;
    }

    this.setState({
      selectedItemIds: materialCart.items.map(item => item.id),
    });
  };

  /**
   * Render an item in table
   */
  _renderItem = material => {
    const { selectedItemIds } = this.state;

    this.total += material.price * material.quantity;

    return (
      <tr key={material.id} className="py-1 border-bottom transaction align-items-center">
        <td>
          <div className="custom-control custom-checkbox">
            <input type="checkbox" className="custom-control-input"
              onChange={() => {}}
              checked={selectedItemIds.includes(material.id)}
              />
            <label className="custom-control-label cursor-pointer"
              onClick={(e) => this._handleSelectItem(material.id)}
            ></label>
          </div>
        </td>
        <td className="image text-center">
          <Link to={getRoutePath(routeConsts.MATERIAL_DETAIL, { id: material.id })}>
            <img src={material.thumbnailImageUrl} alt={material.name} style={{ height: 100, maxWidth: 100 }} />
          </Link>
        </td>
        <td>
          <Link to={getRoutePath(routeConsts.MATERIAL_DETAIL, { id: material.id })}>
            <h6>{material.name}</h6>
          </Link>
          <div>
            <Image src={material.contractor.thumbnailImageUrl} circle className="rounded-circle" width="30" height="30" /> <Link to={getRoutePath(routeConsts.PROFILE_CONTRACTOR, { id: material.contractor.id })}>{material.contractor.name}</Link>
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
        <td>
          <button className="btn btn-link text-danger p-0"
            onClick={() => this._handleRemoveItem(material.id)}
          >
            <i className="fal fa-trash"></i>
          </button>
        </td>
      </tr>
    );
  };

  /**
   * Render detail table
   */
  _renderDetails = () => {
    const { selectedItemIds } = this.state;
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
              <th className="border-top-0" width="20">
              <div className="custom-control custom-checkbox">
                <input type="checkbox" className="custom-control-input" checked={selectedItemIds.length === materialCart.items.length} onChange={() => {}} />
                <label className="custom-control-label cursor-pointer" onClick={(e) => this._toggleAll()}>
                </label>
              </div>
              </th>
              <th className="border-top-0" width="100"></th>
              <th className="border-top-0">Name</th>
              <th className="border-top-0">Price</th>
              <th className="border-top-0">Quantity</th>
              <th className="border-top-0">Total</th>
              <th className="border-top-0" width="20"></th>
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
    const { materialCart, removeItems } = this.props;
    const { address, selectedItemIds } = this.state;

    const materialTransactionDetails = materialCart.items
      .filter(item => selectedItemIds.includes(item.id))
      .map(item => {
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
      }, () => {
        removeItems(selectedItemIds);
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
  location: PropTypes.object,
  removeItems: PropTypes.func,
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
  clearCart: materialCartActions.clear,
  removeItems: materialCartActions.removeItems,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Cart));
