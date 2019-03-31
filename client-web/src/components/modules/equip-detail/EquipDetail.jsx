import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import Helmet from "react-helmet-async";
import Image from "../../common/Image";
import { connect } from "react-redux";
import { authActions } from "../../../redux/actions";

import ccpApiService from "../../../services/domain/ccp-api-service";
import RequestCard from "./RequestCard";
import { formatPrice } from "Utils/format.utils";

class EquipDetail extends Component {
  state = {
    equip: {},
    availableTimeRanges: [],
    transaction: {},
    error: {},
    redirectToTransaction: false,
    address: ""
  };

  // TODO: Change default images
  defaultImages = [
    "/public/upload/product-images/unnamed-19-jpg.jpg",
    "/public/upload/product-images/unnamed-24-jpg.jpg",
    "/public/upload/product-images/unnamed-20-jpg.jpg",
    "/public/upload/product-images/unnamed-25-jpg.jpg",
    "/public/upload/product-images/unnamed-21-jpg.jpg",
    "/public/upload/product-images/unnamed-22-jpg.jpg",
    "/public/upload/product-images/unnamed-23-jpg.jpg"
  ];

  /**
   * Load equipment detail
   */
  _loadData = async () => {
    const { params } = this.props.match;
    const { id } = params;

    const data = await ccpApiService.getEquipmentById(id);
    if (!data.equipmentImages || !data.equipmentImages.length) {
      data.equipmentImages = this.defaultImages.map(url => ({ url }));
    }

    this.setState({
      equip: data
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

  render() {
    const { equip } = this.state;
    const { authentication } = this.props;
    const { user } = authentication;

    return (
      <div className="container">
        {/* Change current title */}
        <Helmet>
          <title>Equipment detail: {equip.name || ""}</title>
        </Helmet>

        <div className="row py-4">
          {/* Main content */}
          <div className="col-md-9">
            {(equip.equipmentImages && (
              <OwlCarousel
                loop
                autoPlay={true}
                autoplayTimeout={2000}
                items={1}
                className="owl-theme product-images"
                margin={10}
                ref={mainOwl => (this.mainOwl = mainOwl)}
              >
                {equip.equipmentImages.map((image, index) => (
                  <div key={index} className="item image-169">
                    <img src={image.url} alt={equip.name} />
                  </div>
                ))}
              </OwlCarousel>
            )) || <Skeleton height={410} />}
            {(equip.equipmentImages && (
              <OwlCarousel
                items={5}
                className="owl-theme product-images-nav mt-2"
                margin={10}
                rewind={false}
                dots={false}
                nav={true}
              >
                {equip.equipmentImages.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => this._showImage(index)}
                    className="item image-169"
                  >
                    <img src={image.url} alt={equip.name} />
                  </div>
                ))}
              </OwlCarousel>
            )) || <Skeleton height={65} />}
            <div className="py-2 px-3 shadow-sm bg-white">
              <h1 className="">{equip.name || <Skeleton />}</h1>
              <div className="row">
                <div className="col-md-6">
                  <h6><i className="fal fa-tags"></i> Type: {equip.equipmentType && equip.equipmentType.name}</h6>
                </div>
                <div className="col-md-6">
                  <h6><i className="fal fa-dollar-sign"></i> Daily price: {formatPrice(equip.dailyPrice)}</h6>
                </div>
                <div className="col-md-12">
                  <h6><i className="fal fa-map-marker"></i> Address: {equip.address}</h6>
                </div>
              </div>
              <h5 className="mt-3">Description:</h5>
              <div className="description">{equip.description}</div>
            </div>
            {!equip.id && <Skeleton count={10} />}
          </div>
          {/* Right Sidebar */}
          <div className="col-md-3">
            <div className="sticky-top sticky-sidebar">
              <div className="constructor-card text-center">
                <Image
                  src={
                    equip.contractor && equip.contractor.thumbnailImage
                      ? equip.contractor.thumbnailImage
                      : "https://www.shareicon.net/download/2016/04/10/747369_man.svg"
                  }
                  className="rounded-circle w-50"
                  alt=""
                />
                <h5>
                  {equip.contractor ? equip.contractor.name : <Skeleton />}
                </h5>
                <p className="mt-0">
                  Join at:{" "}
                  {equip.contractor ? (
                    new Date(equip.contractor.createdTime).toDateString()
                  ) : (
                    <span className="d-inline">
                      <Skeleton width={100} />
                    </span>
                  )}
                </p>
              </div>
              {equip.id &&
                (!authentication.isAuthenticated ||
                  equip.contractor.id !== user.contractor.id) && (
                  <RequestCard equip={equip} />
                )}
              {equip.id &&
                authentication.isAuthenticated &&
                equip.contractor.id == user.contractor.id && (
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
)(withRouter(EquipDetail));
