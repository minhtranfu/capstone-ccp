import React, { Component } from 'react';
import { connect } from 'react-redux';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import moment from 'moment';
import 'bootstrap-daterangepicker/daterangepicker.css';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import SweetAlert from 'react-bootstrap-sweetalert';

import { authActions } from '../../../redux/actions';
import ccpApiService from '../../../services/domain/ccp-api-service';

class RequestCard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      equip: props.equip,
      availableTimeRanges: [],
      transaction: {
        equipmentId: props.equip.id
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
            requesterLatitude: latLng.lat,
            requesterLongitude: latLng.lng
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
   * Handle changing date range
   */
  _onChangeDateRanage = (e, picker) => {
    const { transaction } = this.state;
    this.setState({
      transaction: {
        ...transaction,
        beginDate: picker.startDate,
        endDate: picker.endDate
      }
    });
  };

  /**
   * Get label for show value of date range picker
   */
  _getLabelOfRange = () => {
    const { transaction } = this.state;

    if (transaction == undefined || !transaction.beginDate) {
      return 'Pick a time range';
    }

    const { beginDate, endDate } = transaction;

    return `${beginDate.format('YYYY/MM/DD')} - ${endDate.format('YYYY/MM/DD')}`;
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
    transaction = {
      ...transaction,
      beginDate: transaction.beginDate.format('YYYY-MM-DD'),
      endDate: transaction.endDate.format('YYYY-MM-DD')
    };
    try {
      data = await ccpApiService.postTransaction(transaction);
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

  /**
   * Check date is invalid for disabling date of date range picker
   */
  _isInvalidDate = date => {
    const { equip } = this.state;

    // Check the date is not in any date range
    let inAvailableTimeRange = false;
    equip.availableTimeRanges.forEach(range => {
      if (date.isAfter(range.beginDate) && date.isBefore(range.endDate)) {
        inAvailableTimeRange = true;
        return;
      }
    });

    if (!inAvailableTimeRange) {
      return true;
    }

    if (equip.activeHiringTransactions && equip.activeHiringTransactions.length > 0) {
      let inHiringTimeRange = false;
      equip.activeHiringTransactions.forEach(hiringTransaction => {
        if ((date.isAfter(hiringTransaction.beginDate) || date.isSame(hiringTransaction.beginDate, 'day'))
          && (date.isBefore(hiringTransaction.endDate) || date.isSame(hiringTransaction.endDate, 'day'))) {
          inHiringTimeRange = true;
          return;
        }
      });

      if (inHiringTimeRange) {
        return inHiringTimeRange;
      }
    }

    if (equip.processingHiringTransaction) {
      if ((date.isAfter(equip.processingHiringTransaction.beginDate) || date.isSame(equip.processingHiringTransaction.beginDate, 'day'))
        && (date.isBefore(equip.processingHiringTransaction.endDate) || date.isSame(equip.processingHiringTransaction.endDate, 'day'))) {
        return true;
      }
    }

    return false;
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
            Request for hiring this device was sent!
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
    const { isFetching, equip, transaction } = this.state;

    let numOfDays = 0;
    if (transaction && transaction.beginDate) {
      numOfDays = transaction.endDate.diff(transaction.beginDate, 'days') + 1;
    }

    return (
      <div className="request-card bg-white shadow">
        {this._renderAlert()}
        <div className="my-2">Daily price: <span className="float-right">{equip.dailyPrice}K</span></div>
        <div className="my-2 pb-2 border-bottom">Delivery price: <span className="float-right">{equip.deliveryPrice}K</span></div>

        <div className="form-group">
          <label htmlFor="requesterAddress"><strong>Receive address:</strong></label>
          <PlacesAutocomplete
            value={this.state.address}
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
          <label htmlFor="timeRange"><strong>Time:</strong></label>
          <DateRangePicker isInvalidDate={this._isInvalidDate} minDate={moment()} onApply={this._onChangeDateRanage} containerClass="w-100" data-range-id="1" startDate="1/1/2014" endDate="3/1/2014">
            <div className="input-group date-range-picker">
              <input type="text" id="timeRange" className="form-control" readOnly value={this._getLabelOfRange() || ''} />
              <div className="input-group-append">
                <span className="input-group-text" id="basic-addon2"><i className="fa fa-calendar"></i></span>
              </div>
            </div>
          </DateRangePicker>
        </div>
        <div className="text-center border-top border-bottom my-3 py-2">
          {!transaction.beginDate &&
            <span className="text-muted">Pick a time range to see fee</span>
          }
          {transaction.beginDate &&
            <div>
              <div className="text-left">Days: <span className="float-right">{numOfDays}</span></div>
              <div className="text-left">Fee: <span className="float-right">{numOfDays * equip.dailyPrice}K</span></div>
            </div>
          }
        </div>
        {authentication.isAuthenticated &&
          <button className="btn btn-success btn-block mt-2" disabled={isFetching || !transaction.beginDate || !transaction.requesterAddress} onClick={this._postTransaction}>
            {isFetching &&
              <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
            }
            Request for hiring
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