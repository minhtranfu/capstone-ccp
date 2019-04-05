import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import Helmet from "react-helmet-async";
import StarRatings from 'react-star-ratings';
import { Alert } from "reactstrap";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

import Image from "../../common/Image";
import { authActions } from "../../../redux/actions";
import { formatPrice, formatDate } from "Utils/format.utils";
import { debrisServices, debrisTransactionServices } from "Services/domain/ccp";
import BidForm from './BidForm';
import { getErrorMessage } from "Utils/common.utils";
import SweetAlert from "react-bootstrap-sweetalert/lib/dist/SweetAlert";
import { ComponentBlocking } from "Components/common";
import { DEBRIS_POST_STATUSES, DEBRIS_BID_STATUSES } from "Common/consts";

class DebrisDetail extends Component {
  state = {
    debris: {},
  };

  /**
   * Load debris detail
   */
  _loadData = async () => {
    const { params } = this.props.match;
    const { id } = params;

    const data = await debrisServices.getDebrisById(id);

    this.setState({
      debris: data
    });
  };

  /**
   * Navigate to clicked image in nav owl
   */
  _showImage = index => {
    this.mainOwl.to(index, 250);
  };

  componentDidMount() {
    this._loadData();
    // this._getCurrentLocation();
  }

  /**
   * Set choosedBidId to state to show a confirm
   */
  _handleChooseBid = choosedBidId => {
    this.setState({
      choosedBidId
    });
  };

  /**
   * Post debris transaction when user confirm choose a bid
   */
  _handleConfirmChooseBid = async () => {
    const { debris, choosedBidId } = this.state;
    const debrisTransaction = {
      debrisPost: {
        id: debris.id
      },
      debrisBid: {
        id: choosedBidId
      }
    };

    this.setState({
      isFetching: true,
      choosedBidId: null
    });
    try {
      const transacstion = await debrisTransactionServices.postTransaction(debrisTransaction);
      this.setState({
        transacstion,
        isFetching: false,
        debris: {
          ...debris,
          status: DEBRIS_POST_STATUSES.ACCEPTED
        }
      });
    } catch (error) {
      const messsage = getErrorMessage(error);
      this.setState({
        messsage,
        isFetching: false
      });
    }
  };

  /**
   * Render bid cards and check current is current user had bid
   */
  _renderBids = () => {
    const { authentication } = this.props;
    const { user } = authentication;
    const { debris } = this.state;
    const { debrisBids } = debris;
    const isRequester = this._isRequester();
    const isPending = debris.status === DEBRIS_POST_STATUSES.PENDING;

    if (!debrisBids || debrisBids.length === 0) {
      return null;
    }

    return debrisBids.map(bid => {
      if (authentication.isAuthenticated && user.contractor && bid.supplier.id === user.contractor.id) {
        this.isHadBid = true;
      }

      return (
        <div key={bid.id} className={`my-2 bg-white p-3 d-flex bid ${bid.status !== DEBRIS_BID_STATUSES.PENDING ? 'border border-primary border-2 shadow' : 'shadow-sm'}`}>
          <div className="flex-fill d-flex flex-column flex-lg-row">
            <div className="d-flex bider text-nowrap flex-wrap flex-sm-nowrap">
              <div className="lh-1 mr-2">
                <Image
                  circle
                  width={75}
                  height={75}
                  src={bid.supplier && bid.supplier.thumbnailImageUrl
                    ? bid.supplier.thumbnailImageUrl
                    : "https://www.shareicon.net/download/2016/04/10/747369_man.svg"}
                  className="rounded-circle avatar"
                />
              </div>
              <div className="flex-fill">
                <h5 className="mb-0">{bid.supplier.name}</h5>
                <div>
                  <StarRatings
                    rating={bid.supplier.averageDebrisRating}
                    numberOfStars={5}
                    starRatedColor="#ffac00"
                    starDimension="20px"
                    starSpacing="0px"
                  />
                </div>
                <div>
                  <span className="badge badge-pill badge-warning mr-1">{bid.supplier.averageDebrisRating.toFixed(1)}</span>
                  {bid.supplier.debrisFeedbacksCount} reviews
                </div>
              </div>
              <div className="d-lg-none mx-auto mt-1">
                <div className="price text-large">{formatPrice(bid.price)}</div>
                {isRequester && isPending &&
                  <button className="btn btn-outline-primary float-right mt-2" onClick={() => this._handleChooseBid(bid.id)}>Choose</button>
                }
                {bid.status !== DEBRIS_BID_STATUSES.PENDING &&
                  <span className="float-right text-primary mt-2">Selected</span>
                }
              </div>
            </div>
            <div className="flex-fill px-md-3 mt-2 mt-md-0 word-break">
              {bid.description}
            </div>
          </div>
          <div className="bid-infos d-none d-lg-block">
            <div className="price text-x-large">
              {formatPrice(bid.price)}
            </div>
            {isRequester && isPending &&
              <button className="btn btn-outline-primary float-right mt-2" onClick={() => this._handleChooseBid(bid.id)}>Choose</button>
            }
            {bid.status !== DEBRIS_BID_STATUSES.PENDING &&
              <span className="float-right text-primary mt-2">Selected</span>
            }
          </div>
        </div>
      );
    });
  };

  /**
   * Clear message to hide alert
   */
  _clearMessage = () => {
    this.setState({
      message: null
    });
  };

  _handleBidSuccess = bid => {
    const { debris } = this.state;
    const { debrisBids } = debris;

    debrisBids.push(bid);
    this.setState({
      debris: {
        ...debris
      }
    });
  };

  /**
   * Check current user is requester of current debris post
   */
  _isRequester = () => {
    const { authentication } = this.props;
    const { user } = authentication;
    const { debris } = this.state;

    if (!debris || !debris.id) {
      return false;
    }

    if (!user || !user.contractor) {
      return false;
    }

    return debris.requester.id === user.contractor.id;
  }

  _renderAlert = () => {
    const { choosedBidId, transacstion } = this.state;

    if (!!choosedBidId) {
      return (
        <SweetAlert
          info
          showCancel
          title="Choose this bid?"
          confirmBtnText="Yes"
          onConfirm={this._handleConfirmChooseBid}
          onCancel={() => this.setState({ choosedBidId: null })}
        />
      );
    }

    if (!!transacstion) {
      return (
        <SweetAlert
          success
          title="A transaction with choosed bid was created!"
          onConfirm={() => this.setState({ transacstion: null })}
          onCancel={() => this.setState({ transacstion: null })}
        />
      );
    }

    return null;
  };

  render() {
    const { debris, isFetching, message } = this.state;
    const { debrisBids } = debris;
    const { authentication } = this.props;
    const { user } = authentication;
    const { debrisServiceTypes } = debris;
    const services = !debrisServiceTypes ? '' : debrisServiceTypes.map(type => type.name).join(', ');
    const isRequester = this._isRequester();

    const bidCards = this._renderBids();

    return (
      <div className="container">
        {this._renderAlert()}
        {isFetching &&
          <ComponentBlocking/>
        }
        {/* Change current title */}
        <Helmet>
          <title>{debris.title || ""} | Debris request detail</title>
        </Helmet>

        <div className="row py-4">
          {/* Main content */}
          <div className="col-md-9">
            <Alert isOpen={!!message} toggle={this._clearMessage}>
              {message}
            </Alert>
            {(debris.debrisImages && (
              <OwlCarousel
                loop
                autoPlay={true}
                autoplayTimeout={2000}
                items={1}
                className="owl-theme product-images"
                margin={10}
                ref={mainOwl => (this.mainOwl = mainOwl)}
              >
                {debris.debrisImages.map((image, index) => (
                  <div key={index} className="item image-169">
                    <img src={image.url} alt={debris.title} />
                  </div>
                ))}
              </OwlCarousel>
            )) || <Skeleton height={410} />}
            {(debris.debrisImages && (
              <OwlCarousel
                items={5}
                className="owl-theme product-images-nav mt-2"
                margin={10}
                rewind={false}
                dots={false}
                nav={true}
              >
                {debris.debrisImages.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => this._showImage(index)}
                    className="item image-169"
                  >
                    <img src={image.url} alt={debris.title} />
                  </div>
                ))}
              </OwlCarousel>
            )) || <Skeleton height={65} />}
            <div className="mt-2 py-2 px-3 shadow-sm bg-white">
              <h1 className="">{debris.title || <Skeleton />}</h1>
              <div className="row">
                <div className="col-md-12 py-2">
                  <h5>
                    {debris.status === DEBRIS_POST_STATUSES.PENDING &&
                      <span className="text-success">Waiting for bids</span>
                    }
                    {debris.status !== DEBRIS_POST_STATUSES.PENDING &&
                      <span className="text-primary">{debris.status}</span>
                    }
                  </h5>
                </div>
                <div className="col-md-12 py-2">
                  <h6 className="d-inline">
                    <span className="text-muted"><i className="fal fa-calendar"></i> Posted: </span>
                    {formatDate(debris.createdTime) || <Skeleton width={100} />}
                  </h6>
                  <h6 className="d-inline ml-3 pl-3 border-left">
                    <span className="text-muted"><i className="fas fa-gavel"></i> Bid: </span>
                    {debris.debrisBids ? debris.debrisBids.length : <Skeleton width={60} />}
                  </h6>
                </div>
                <div className="col-md-12 py-2">
                  <h6>
                    <span className="text-muted"><i className="fal fa-tags"></i> Types: </span>
                    {debrisServiceTypes ? services : <Skeleton width={100} />}
                  </h6>
                </div>
                <div className="col-md-12 py-2">
                  <h6>
                    <span className="text-muted"><i className="fal fa-map-marker"></i> Address: </span>
                    {debris.address || <Skeleton width={250} />}
                  </h6>
                </div>
                <div className="col-md-12 py-2">
                  <h6>
                    <span className="text-muted"><i className="fal fa-align-justify"></i> Description: </span>
                  </h6>
                  {debris.description}
                </div>
              </div>
            </div>
            {!debris.id && <Skeleton height={135} count={10} />}
            {debris.id && debris.status === DEBRIS_POST_STATUSES.PENDING && !isRequester && !this.isHadBid &&
              <BidForm debrisId={debris.id} onSuccess={this._handleBidSuccess} />
            }
            {debrisBids &&
              <h4 className="my-3">
                Bids:
              </h4>
            }
            {debrisBids && !debrisBids.length &&
              <div className="alert alert-info text-center"><i className="fal fa-info-circle"></i> There is no bid now!</div>
            }
            {bidCards}
          </div>
          {/* Right Sidebar */}
          <div className="col-md-3">
            <div className="sticky-top sticky-sidebar pt-2">
              <div className="constructor-card text-center">
                <Image
                  circle
                  src={
                    debris.requester && debris.requester.thumbnailImageUrl
                      ? debris.requester.thumbnailImageUrl
                      : "https://www.shareicon.net/download/2016/04/10/747369_man.svg"
                  }
                  className="rounded-circle"
                  alt="Avatar"
                />
                <h5>
                  {debris.requester ? debris.requester.name : <Skeleton />}
                </h5>
                <p className="mt-0">
                  Join at:{" "}
                  {debris.requester ? (
                    formatDate(debris.requester.createdTime)
                  ) : (
                      <span className="d-inline">
                        <Skeleton width={100} />
                      </span>
                    )}
                </p>
              </div>
              {debris.id &&
                authentication.isAuthenticated &&
                debris.requester.id == user.contractor.id && (
                  <div className="shadow bg-white rounded p-2">
                    <h5>Current transactions</h5>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p />
                  </div>
                )}
            </div>
          </div>
        </div>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DebrisDetail));
