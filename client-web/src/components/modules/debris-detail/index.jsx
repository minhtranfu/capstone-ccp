import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import Helmet from "react-helmet-async";
import { Collapse } from "reactstrap";

import Image from "../../common/Image";
import { connect } from "react-redux";
import { authActions } from "../../../redux/actions";
import { formatPrice, formatDate } from "Utils/format.utils";
import { debrisServices } from "Services/domain/ccp";
import StarRatings from 'react-star-ratings';

class DebrisDetail extends Component {
  state = {
    debris: {},
    availableTimeRanges: [],
    transaction: {},
    error: {},
    redirectToTransaction: false,
    address: ""
  };

  /**
   * Load equipment detail
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

  _renderBids = () => {
    const { debris } = this.state;
    const { debrisBids } = debris;

    if (!debrisBids || debrisBids.length === 0) {
      return null;
    }

    return debrisBids.map(bid => {
      return (
        <div key={bid.id} className="my-2 bg-white shadow-sm p-3 d-flex bid">
          <div className="flex-fill d-flex flex-column flex-lg-row">
            <div className="d-flex bider text-nowrap flex-wrap flex-sm-nowrap">
              <div>
                <Image src={bid.supplier && bid.supplier.thumbnailImage
                  ? bid.supplier.thumbnailImage
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
                  <span className="badge badge-pill badge-warning mr-1">{bid.supplier.averageDebrisRating}</span>
                  {bid.supplier.debrisFeedbacksCount} reviews
                </div>
              </div>
              <div className="d-lg-none mx-auto mt-1"><div class="price text-large">12,500K</div></div>
            </div>
            <div className="flex-fill px-md-3 mt-2 mt-md-0">
              {bid.description}
            </div>
          </div>
          <div className="bid-infos d-none d-lg-block">
            <div className="price text-x-large">{formatPrice(bid.price)}</div>
          </div>
        </div>
      );
    });
  };

  _toggleBidForm = () => {
    const { isShowBidForm } = this.state;
    this.setState({
      isShowBidForm: !isShowBidForm
    });
  };

  render() {
    const { debris, isShowBidForm } = this.state;
    const { authentication, toggleLoginModal } = this.props;
    const { user } = authentication;
    const { debrisServiceTypes } = debris;
    const services = !debrisServiceTypes ? '' : debrisServiceTypes.map(type => type.name).join(', ');

    return (
      <div className="container">
        {/* Change current title */}
        <Helmet>
          <title>{debris.title || ""} | Debris request detail</title>
        </Helmet>

        <div className="row py-4">
          {/* Main content */}
          <div className="col-md-9">
            {/* <div className="image-169 mb-2 shadow-sm">
              <Image src={debris.thumbnailImageUrl} />
            </div> */}
            <div className="py-2 px-3 shadow-sm bg-white">
              <h1 className="">{debris.title || <Skeleton />}</h1>
              <div className="row">
                <div className="col-md-12 py-2">
                  <h5>
                    {debris.status === 'PENDING' &&
                      <span className="text-success">Waiting for bids</span>
                    }
                    {debris.status !== 'PENDING' &&
                      <span className="text-secondary">DONE</span>
                    }
                  </h5>
                </div>
                <div className="col-md-12 py-2">
                  <h6 className="d-inline">
                    <span className="text-muted"><i className="fal fa-calendar"></i> Posted: </span>
                    {formatDate(debris.createdTime) || <Skeleton width={100} />}
                  </h6>
                  <h6 className="d-inline ml-3 pl-3 border-left">
                    <span className="text-muted"><i className="fas fa-gavel"></i> Bided: </span>
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
              </div>
            </div>
            {!debris.id && <Skeleton height={135} count={10} />}
            {user && !isShowBidForm &&
              <button onClick={this._toggleBidForm} className="btn btn-lg btn-primary btn-block my-2">
                <i className="fal fa-gavel"></i> Bid this request
              </button>
            }
            {user && isShowBidForm &&
              <button onClick={this._toggleBidForm} className="btn btn-lg btn-outline-primary btn-block my-2">
                <i className="fal fa-times"></i> Close bid form
              </button>
            }
            {user &&
              <Collapse isOpen={isShowBidForm}>
                <form className="bg-white p-3 shadow-sm">
                  <h5 className="text-center">Bid this request</h5>
                  <div className="form-group">
                    <label htmlFor="bid_price">Price: <i className="text-danger">*</i></label>
                    <input type="number" className="form-control" min="1" id="bid_price" autoFocus/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="bid_description">Description: <i className="text-danger">*</i></label>
                    <textarea name="description" className="form-control" id="bid_description" cols="30" rows="3"></textarea>
                  </div>
                  <div className="form-group text-center">
                    <button className="btn btn-lg btn-primary"><i className="fal fa-gavel"></i> Bid</button>
                  </div>
                </form>
              </Collapse>
            }
            {!user &&
              <button className="btn btn-lg btn-primary btn-block my-2" onClick={toggleLoginModal}><i className="fal fa-sign-in"></i> Login to bid</button>
            }
            <h4 className="my-3">
              Bids:
            </h4>
            {this._renderBids()}
          </div>
          {/* Right Sidebar */}
          <div className="col-md-3">
            <div className="sticky-top sticky-sidebar">
              <div className="constructor-card text-center">
                <Image
                  src={
                    debris.requester && debris.requester.thumbnailImage
                      ? debris.requester.thumbnailImage
                      : "https://www.shareicon.net/download/2016/04/10/747369_man.svg"
                  }
                  className="rounded-circle w-50"
                  alt=""
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
              {/* {debris.id &&
                (!authentication.isAuthenticated ||
                  debris.contractor.id !== user.contractor.id) && (
                  <RequestCard debris={debris} />
                )} */}
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
