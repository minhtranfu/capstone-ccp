import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import Helmet from "react-helmet-async";
import moment from "moment";
import Image from "../../common/Image";
import { connect } from "react-redux";
import { authActions } from "../../../redux/actions";

import ccpApiService from "../../../services/domain/ccp-api-service";
import RequestCard from "./RequestCard";

class MaterialDetail extends Component {
  state = {
    material: {},
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

    const data = await ccpApiService.materialServices.getMaterialById(id);
    if (!data.equipmentImages || !data.equipmentImages.length) {
      data.equipmentImages = this.defaultImages.map(url => ({ url }));
    }

    this.setState({
      material: data
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
    const { material } = this.state;
    const { authentication } = this.props;
    const { user } = authentication;

    return (
      <div className="container">
        {/* Change current title */}
        <Helmet>
          <title>Material detail: {material.name || ""}</title>
        </Helmet>
        <div className="row">
          <div className="col-md-9">
            <img src={material.thumbnailImageUrl} alt="Material photo" className="w-100"/>
            <h1>{material.name}</h1>
          </div>
        </div>
      </div>
    );
  }

  renderOld() {
    const { material } = this.state;
    const { authentication } = this.props;
    const { user } = authentication;

    return (
      <div className="container">
        {/* Change current title */}
        <Helmet>
          <title>Material detail: {material.name || ""}</title>
        </Helmet>

        <div className="row py-4">
          {/* Main content */}
          <div className="col-md-9">
            {(material.equipmentImages && (
              <OwlCarousel
                loop
                autoPlay={true}
                autoplayTimeout={2000}
                items={1}
                className="owl-theme product-images"
                margin={10}
                ref={mainOwl => (this.mainOwl = mainOwl)}
              >
                {material.equipmentImages.map((image, index) => (
                  <div key={index} className="item">
                    <img src={image.url} alt={material.name} />
                  </div>
                ))}
              </OwlCarousel>
            )) || <Skeleton height={410} />}
            {(material.equipmentImages && (
              <OwlCarousel
                items={5}
                className="owl-theme product-images-nav mt-2"
                margin={10}
                rewind={false}
                dots={false}
                nav={true}
              >
                {material.equipmentImages.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => this._showImage(index)}
                    className="item"
                  >
                    <img src={image.url} alt={material.name} />
                  </div>
                ))}
              </OwlCarousel>
            )) || <Skeleton height={65} />}
            <div className="py-2 px-3 shadow-sm bg-white">
              <h1 className="">{material.name || <Skeleton />}</h1>
              <div className="row">
                <div className="col-md-4">
                  <h6>
                    Construction:{" "}
                    {material.construction && material.construction.name}
                  </h6>
                </div>
                <div className="col-md-4">
                  <h6>Daily price:{material.dailyPrice}K</h6>
                </div>
                <div className="col-md-4">
                  <h6>Delivery price: {material.deliveryPrice}K</h6>
                </div>
                <div className="col-md-12">
                  <h6>Address: {material.address}</h6>
                </div>
              </div>
              <h5 className="mt-2">Available Time Ranges:</h5>
              <div className="time-ranges">
                {material.availableTimeRanges &&
                  material.availableTimeRanges.map((range, index) => (
                    <span
                      className="badge badge-success badge-pill mr-2"
                      key={index}
                    >
                      <h4 className="m-0 px-2 pb-1">
                        {moment(range.beginDate).format("YYYY/MM/DD")} -{" "}
                        {moment(range.endDate).format("YYYY/MM/DD")}
                      </h4>
                    </span>
                  ))}
              </div>
              <h5 className="mt-3">Description:</h5>
              <div
                className="description"
                dangerouslySetInnerHTML={{ __html: material.description }}
              />
            </div>
            {!material.id && <Skeleton count={10} />}
          </div>
          {/* Right Sidebar */}
          <div className="col-md-3">
            <div className="sticky-top sticky-sidebar">
              <div className="constructor-card text-center">
                <Image
                  src={
                    material.contractor && material.contractor.thumbnailImage
                      ? material.contractor.thumbnailImage
                      : "https://www.shareicon.net/download/2016/04/10/747369_man.svg"
                  }
                  className="rounded-circle w-50"
                  alt=""
                />
                <h5>
                  {material.contractor ? material.contractor.name : <Skeleton />}
                </h5>
                <p className="mt-0">
                  Join at:{" "}
                  {material.contractor ? (
                    new Date(material.contractor.createdTime).toDateString()
                  ) : (
                    <span className="d-inline">
                      <Skeleton width={100} />
                    </span>
                  )}
                </p>
              </div>
              {material.id &&
                (!authentication.isAuthenticated ||
                  material.contractor.id !== user.contractor.id) && (
                  <RequestCard equip={equip} />
                )}
              {material.id &&
                authentication.isAuthenticated &&
                material.contractor.id == user.contractor.id && (
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
)(withRouter(MaterialDetail));
