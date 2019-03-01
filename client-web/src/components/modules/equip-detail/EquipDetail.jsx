import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import Helmet from 'react-helmet-async';
import moment from 'moment';
import Image from '../../common/Image';

import 'bootstrap-daterangepicker/daterangepicker.css';
import DateRangePicker from 'react-bootstrap-daterangepicker';

import ccpApiService from '../../../services/domain/ccp-api-service';

import SweetAlert from 'react-bootstrap-sweetalert';

class EquipDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      equip: {},
      availableTimeRanges: [],
      transaction: {},
      error: {},
      redirectToTransaction: false
    };
  }

  /**
   * Load equipment detail
   */
  _loadData = async () => {
    const { params } = this.props.match;
    const { id } = params;

    const data = await ccpApiService.getEquipmentById(id);
    data.images = [
      '/public/upload/product-images/unnamed-19-jpg.jpg',
      '/public/upload/product-images/unnamed-24-jpg.jpg',
      '/public/upload/product-images/unnamed-20-jpg.jpg',
      '/public/upload/product-images/unnamed-25-jpg.jpg',
      '/public/upload/product-images/unnamed-21-jpg.jpg',
      '/public/upload/product-images/unnamed-22-jpg.jpg',
      '/public/upload/product-images/unnamed-23-jpg.jpg'
    ];

    const { transaction } = this.state;
    this.setState({
      equip: data,
      transaction: {
        ...transaction,
        equipmentId: data.id
      }
    });
  };

  /**
   * Navigate to clicked image in nav owl
   */
  _showImage = (index) => {
    this.mainOwl.to(index, 250);
  };

  componentDidMount() {
    this._loadData();
    this._getCurrentLocation();
  }

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
      this.setState({
        transaction: {
          ...transaction,
          requesterLatitude: latitude,
          requesterLongitude: longitude,
          requesterAddress: ''
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
  _getLabelOfRange = (rangeId) => {
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
    // TODO: Remove hardcode requester ID
    const requesterId = 12;
    transaction = {
      ...transaction,
      beginDate: transaction.beginDate.format('YYYY-MM-DD'),
      endDate: transaction.endDate.format('YYYY-MM-DD'),
      requesterId
    };
    try {
      data = await ccpApiService.postTransaction(transaction);
    } catch (error) {
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
    }

    if (data.message) {
      newState.error.message = data.message;
    }

    if (data.id) {
      newState.transactionId = data.id;
    }

    this.setState(newState);
  };

  _isInvalidDate = date => {
    const { equip } = this.state;
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

  render() {
    const { equip, transaction, isFetching, error, transactionId, redirectToTransaction } = this.state;
    let numOfDays = 0;
    if (transaction && transaction.beginDate) {
      numOfDays = transaction.endDate.diff(transaction.beginDate, 'days') + 1;
    }

    return (
      <div className="container">
        {/* Change current title */}
        <Helmet>
          <title>Equipment detail: {equip.name || ''}</title>
        </Helmet>
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

        <div className="row py-4">
          {/* Main content */}
          <div className="col-md-9">
            {equip.images && (
              <OwlCarousel
                loop
                autoPlay={true}
                autoplayTimeout={2000}
                items={1}
                className="owl-theme product-images"
                margin={10}
                ref={mainOwl => this.mainOwl = mainOwl}
              >
                {equip.images.map((src, index) => <div key={index} className="item"><img src={src} alt={equip.name} /></div>)}
              </OwlCarousel>
            ) || <Skeleton height={410} />}
            {equip.images && (
              <OwlCarousel
                items={5}
                className="owl-theme product-images-nav mt-2"
                margin={10}
                rewind={false}
                dots={false}
                nav={true}
              >
                {equip.images.map((src, index) => <div key={index} onClick={() => this._showImage(index)} className="item"><img src={src} alt={equip.name} /></div>)}
              </OwlCarousel>
            ) || <Skeleton height={65} />}
            <div className="py-2 px-3 shadow-sm bg-white">
              <h1 className="">{equip.name || <Skeleton />}</h1>
              <div className="row">
                <div className="col-md-4">
                  <h6>Construction: {equip.construction && equip.construction.name}</h6>
                </div>
                <div className="col-md-4">
                  <h6>Daily price: <i className="fa fa-dollar"></i>{equip.dailyPrice}</h6>
                </div>
                <div className="col-md-4">
                  <h6>Delivery price: <i className="fa fa-dollar"></i>{equip.deliveryPrice}</h6>
                </div>
                <div className="col-md-12">
                  <h6>Address: {equip.address}</h6>
                </div>
              </div>
              <h5 className="mt-2">Available Time Ranges:</h5>
              <div className="time-ranges">
                {equip.availableTimeRanges &&
                  equip.availableTimeRanges.map((range, index) => <span className="badge badge-success badge-pill mr-2" key={index}>
                    <h4 className="m-0 px-2 pb-1">{moment(range.beginDate).format('YYYY/MM/DD')} - {moment(range.endDate).format('YYYY/MM/DD')}</h4>
                  </span>)
                }
              </div>
              <h5 className="mt-3">Description:</h5>
              <div className="description" dangerouslySetInnerHTML={{ __html: equip.description }}>
              </div>
            </div>
            {!equip.id &&
              <Skeleton count={10} />
            }
          </div>
          {/* Right Sidebar */}
          <div className="col-md-3">
            <div className="sticky-top sticky-sidebar">
              <div className="constructor-card text-center">
                <Image src={equip.contractor && equip.contractor.thumbnailImage ? equip.contractor.thumbnailImage : 'https://www.shareicon.net/download/2016/04/10/747369_man.svg'} className="rounded-circle w-50" alt="" />
                <h5>{equip.contractor ? equip.contractor.name : <Skeleton />}</h5>
                <p className="mt-0">
                  Join at: {equip.contractor
                    ? new Date(equip.contractor.createdTime).toDateString()
                    : <span className="d-inline"><Skeleton width={100} /></span>
                  }
                </p>
              </div>
              <div className="request-card bg-white shadow">
                <div className="my-2">Daily price: <span className="float-right"><i className="fa fa-dollar"></i>{equip.dailyPrice}</span></div>
                <div className="my-2">Delivery price: <span className="float-right"><i className="fa fa-dollar"></i>{equip.deliveryPrice}</span></div>
                <DateRangePicker isInvalidDate={this._isInvalidDate} minDate={moment()} onApply={this._onChangeDateRanage} containerClass="w-100" data-range-id="1" startDate="1/1/2014" endDate="3/1/2014">
                  <div className="input-group date-range-picker">
                    <input type="text" className="form-control" readOnly value={this._getLabelOfRange(0) || ''} />
                    <div className="input-group-append">
                      <span className="input-group-text" id="basic-addon2"><i className="fa fa-calendar"></i></span>
                    </div>
                  </div>
                </DateRangePicker>
                <div className="text-center border-top border-bottom my-3 py-2">
                  {!transaction.beginDate &&
                    <span className="text-muted">Pick a time range to see fee</span>
                  }
                  {transaction.beginDate &&
                    <div>
                      <div className="text-left">Days: <span className="float-right">{numOfDays}</span></div>
                      <div className="text-left">Fee: <span className="float-right"><i className="fa fa-dollar"></i>{numOfDays * equip.dailyPrice}</span></div>
                    </div>
                  }
                </div>
                <button className="btn btn-success btn-block mt-2" disabled={isFetching || !transaction.beginDate} onClick={this._postTransaction}>
                  {isFetching &&
                    <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
                  }
                  Request for hiring
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(EquipDetail);
