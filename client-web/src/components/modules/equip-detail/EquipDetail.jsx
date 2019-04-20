import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
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
import { formatPrice, formatDate } from "Utils/format.utils";
import { StarRatings } from "Components/common";
import { getRoutePath } from "Utils/common.utils";
import { routeConsts } from "Common/consts";

class EquipDetail extends Component {
  state = {
    equip: {},
    availableTimeRanges: [],
    transaction: {},
    error: {},
    redirectToTransaction: false,
    address: "",
    isFetching: true
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
      equip: data,
      isFetching: false
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

  _renderRightSidebar = () => {
    const { equip, isFetching } = this.state;
    const { authentication } = this.props;
    const { contractor } = authentication;

    return (
      <div className="sticky-top sticky-sidebar mb-2">
        <div className="constructor-card text-center">
          {equip.contractor && equip.contractor.thumbnailImageUrl
            ? <Image
              circle
              src={equip.contractor.thumbnailImageUrl}
              width={125}
              height={125}
              className="rounded-circle"
              alt="Avatar"
            />
            : <Skeleton
              circle
              width={125}
              height={125}
            />
          }
          <h5 className="mb-0">
            {!isFetching ?
              <Link to={getRoutePath(routeConsts.PROFILE_CONTRACTOR, { id: equip.contractor.id })}>{equip.contractor.name}</Link>
              : <Skeleton />}
          </h5>
          {isFetching ? <Skeleton /> :
            <StarRatings
              rating={equip.contractor.averageEquipmentRating}
            />
          }
          {isFetching ? <Skeleton /> :
            <div>
              <span className="badge badge-pill badge-warning mr-1">{equip.contractor.averageEquipmentRating.toFixed(1)}</span>
              {equip.contractor.equipmentFeedbacksCount} reviews
            </div>
          }
          <p className="mt-0 text-muted">
            Joined:{" "}
            {!isFetching ? (
              formatDate(equip.contractor.createdTime)
            ) : (
                <span className="d-inline">
                  <Skeleton width={100} />
                </span>
              )}
          </p>
        </div>
        {!isFetching &&
          (!authentication.isAuthenticated ||
            equip.contractor.id !== contractor.id) && (
            <RequestCard equip={equip} />
          )}
        {!isFetching &&
          authentication.isAuthenticated &&
          equip.contractor.id == contractor.id && (
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
    );
  };

  render() {
    const { equip } = this.state;

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
            ))
            || <div className="image-169">
                <Skeleton height={480} />
              </div>
            }
            {(equip.equipmentImages && (
              <OwlCarousel
                items={5}
                className="owl-theme product-images-nav my-2"
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
            )) || <Skeleton height={88} />}
            <div className="my-2 py-2 px-3 shadow-sm bg-white">
              <h1 className="">{equip.name || <Skeleton />}</h1>
              <div className="row">
                <div className="col-md-6 py-2">
                  {equip.equipmentType ?
                    <h6>
                      <span className="text-muted">
                        <i className="fal fa-tags"></i> Type:
                      </span> {equip.equipmentType && equip.equipmentType.name}
                    </h6>
                    : <Skeleton width={200} />
                  }
                </div>
                <div className="col-md-6 py-2">
                  {equip.dailyPrice ?
                    <h6>
                      <span className="text-muted">
                        <i className="fal fa-money-bill"></i>
                      </span> Daily price: {formatPrice(equip.dailyPrice)}
                    </h6>
                    : <Skeleton width={200} />
                  }
                </div>
                <div className="col-md-12 py-2">
                  {equip.construction ?
                    <h6>
                      <span className="text-muted">
                        <i className="fal fa-map-marker"></i> Address:
                      </span> {equip.construction.address}
                    </h6>
                    : <Skeleton width={400} />
                  }
                </div>
              </div>
              <h5 className="mt-3">Description:</h5>
              <div className="description">
                {equip.description}
                {!equip.id && <Skeleton count={5} />}
              </div>
            </div>
          </div>
          {/* Right Sidebar */}
          <div className="col-md-3">
            {this._renderRightSidebar()}
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
