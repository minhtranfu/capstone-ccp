import React, { Component } from 'react';
import { connect } from 'react-redux';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import 'bootstrap-daterangepicker/daterangepicker.css';
import SweetAlert from 'react-bootstrap-sweetalert';

import { authActions } from '../../../redux/actions';
import { formatPrice } from 'Src/utils/format.utils';
import { materialTransactionServices } from 'Src/services/domain/ccp';

class RequestCard extends Component {

  constructor(props) {
    super(props);

    const { material } = props;

    this.state = {
      material,
      transaction: {
        material: {
          id: material.id
        }
      },
      error: {},
      redirectToTransaction: false,
      address: ''
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
  _handleFieldChange = e => {
    let { transaction } = this.state;
    let { name, value } = e.target;

    if (!isNaN(value)) {
      value = +value;
    }

    transaction = {
      ...transaction,
      [name]: value
    };

    this.setState({ transaction });
  };

  /**
   * Handle user select address from auto complete
   */
  _handleSelectAddress = address => {

    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        const { transaction } = this.state;
        this.setState({
          address,
          transaction: {
            ...transaction,
            requesterAddress: address,
            requesterLat: latLng.lat,
            requesterLong: latLng.lng
          }
        });
      })
      .catch(error => console.error('Error', error));
  };

  /**
   * Get current long, lat for submit hiring request
   */
  _getCurrentLocation = () => {
    if (!window.navigator || !window.navigator.geolocation) {
      return false;
    }

    const location = window.navigator.geolocation;
    location.getCurrentPosition(result => {
      const { coords } = result;
      const { latitude, longitude } = coords;

      const { transaction } = this.state;
      // TODO: Remove hard code for address
      this.setState({
        transaction: {
          ...transaction,
          requesterLatitude: latitude,
          requesterLongitude: longitude
        }
      });
    });
  };

  /**
   * Submit a request for hiring device
   */
  _postTransaction = async () => {
    let { transaction } = this.state;

    this.setState({
      isFetching: true
    });
    let data;
    try {
      data = await materialTransactionServices.postTransaction(transaction);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data) {
        data = error.response.data;
      }
    }
    this.setState({
      isFetching: false
    });

    const newState = {};
    newState.error = {};
    if (!data) {
      newState.error.message = 'An unknown error, please try again!';
    } else {
      if (data.message) {
        newState.error.message = data.message;
      }

      if (data.id) {
        newState.transactionId = data.id;
      }
    }

    this.setState(newState);
  };

  _renderAlert = () => {
    const { error, transactionId, redirectToTransaction } = this.state;
    return (
      <div>
        {/* Show error of submitting a request */}
        {error.message &&
          <SweetAlert
            warning
            confirmBtnText="OK!"
            confirmBtnBsStyle="default"
            title="Error!"
            onConfirm={() => this.setState({ error: {} })}
          >
            {error.message}
          </SweetAlert>
        }
        {/* Show success of submitting a request */}
        {transactionId &&
          <SweetAlert
            success
            showCancel
            confirmBtnText="View transaction detail"
            confirmBtnBsStyle="primary"
            cancelBtnBsStyle="outline-primary"
            cancelBtnText="Close"
            title="Success!"
            onConfirm={() => this.setState({ redirectToTransaction: true })}
            onCancel={() => this.setState({ transactionId: undefined })}
          >
            Request for this material was sent!
                  </SweetAlert>
        }
        {/* Redirect if user click button view sent transaction */}
        {redirectToTransaction &&
          <Redirect to={`/dashboard/transaction/${transactionId}`} />
        }
      </div>
    )
  };

  render() {
    const { authentication, toggleLoginModal } = this.props;
    const { isFetching, material, transaction, address } = this.state;

    return (
      <div className="request-card bg-white shadow">
        {this._renderAlert()}
        <div className="my-2 pb-2 border-bottom">
          <i className="fal fa-money-bill"></i> Price:
          <span className="float-right text-x-large">
            {formatPrice(material.price)}
            <small>
              <small className="text-muted">/{material.unit}</small>
            </small>
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="requesterAddress">Receive address:<i className="text-danger">*</i></label>
          <PlacesAutocomplete
            value={address}
            onChange={this._handleChangeAddress}
            onSelect={this._handleSelectAddress}
            searchOptions={{
              componentRestrictions: {
                country: 'VN'
              }
            }}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {

              return (
                <div>
                  <input
                    {...getInputProps({
                      placeholder: 'Search Places ...',
                      className: 'form-control location-search-input',
                    })}
                    autoFocus
                  />
                  {(loading || suggestions.length > 0) &&
                    <div className="autocomplete-dropdown-container shadow-lg border bg-white">
                      {loading &&
                        <div className="suggestion-item">
                          <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span> Loading...
                            </div>
                      }
                      {suggestions.map(suggestion => {
                        const className = suggestion.active
                          ? 'suggestion-item active'
                          : 'suggestion-item';

                        return (
                          <div
                            {...getSuggestionItemProps(suggestion, {
                              className
                            })}
                          >
                            <span>{suggestion.description}</span>
                          </div>
                        );
                      })}
                    </div>
                  }
                </div>
              )
            }}
          </PlacesAutocomplete>
        </div>
        <div className="form-group">
          <label htmlFor="transaction_quantity">Quantity:<i className="text-danger">*</i></label>
          <input type="number" name="quantity" id="transaction_quantity" className="form-control" onChange={this._handleFieldChange} min="1"/>
        </div>
        <div className="text-center border-top border-bottom my-3 py-2">
          {!transaction.quantity &&
            <span className="text-muted">Input quantity to see fee</span>
          }
          {transaction.quantity &&
            <div>
              <div className="text-left">Total: <span className="float-right text-x-large">{formatPrice(transaction.quantity * material.price)}</span></div>
            </div>
          }
        </div>
        {authentication.isAuthenticated &&
          <button className="btn btn-success btn-block mt-2" disabled={isFetching || !transaction.quantity || !transaction.requesterAddress} onClick={this._postTransaction}>
            {isFetching &&
              <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
            }
            Request
          </button>
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
  toggleLoginModal: authActions.toggleLoginModal
};

export default connect(mapStateToProps, mapDispatchToProps)(RequestCard);
