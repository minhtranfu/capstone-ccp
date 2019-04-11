import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
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

class MaterialDetail extends Component {
  state = {
    material: {},
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

    const data = await ccpApiService.materialServices.getMaterialById(id);

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

  _renderRightSidebar = () => {
    const { material } = this.state;
    const { authentication } = this.props;
    const { user } = authentication;

    return (
      <div className="sticky-top sticky-sidebar">
        <div className="constructor-card text-center">
          <Image
            src={
              material.contractor && material.contractor.thumbnailImageUrl
                ? material.contractor.thumbnailImageUrl
                : "https://www.shareicon.net/download/2016/04/10/747369_man.svg"
            }
            className="rounded-circle w-50"
            alt=""
          />
          <h5>
            {material.contractor ?
              <Link to={getRoutePath(routeConsts.PROFILE_CONTRACTOR, { id: material.contractor.id })}>{material.contractor.name}</Link>
              : <Skeleton />}
          </h5>
          {!material.id ? <Skeleton /> :
            <StarRatings
              rating={material.contractor.averageMaterialRating}
            />
          }
          {!material.id ? <Skeleton /> :
            <div>
              <span className="badge badge-pill badge-warning mr-1">{material.contractor.averageMaterialRating.toFixed(1)}</span>
              {material.contractor.materialFeedbacksCount} reviews
            </div>
          }
          <p className="mt-0 text-muted">
            Join at:{" "}
            {material.contractor ? (
              formatDate(material.contractor.createdTime)
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
            <RequestCard material={material} />
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
    );
  };

  render() {
    const { material } = this.state;

    return (
      <div className="container">
        {/* Change current title */}
        <Helmet>
          <title>{material.name || ""} | Material detail</title>
        </Helmet>

        <div className="row py-4">
          {/* Main content */}
          <div className="col-md-9">
            <div className="image-169 mb-2 shadow-sm">
              <Image src={material.thumbnailImageUrl} />
            </div>
            <div className="py-2 px-3 shadow-sm bg-white">
              <h1 className="">{material.name || <Skeleton />}</h1>
              <h5 className="my-3 text-muted"><u>Information:</u></h5>
              <div className="row">
                <div className="col-md-6 py-2">
                  <h6>
                    <span className="text-muted"><i className="fal fa-calendar"></i> Posted: </span>
                    {formatDate(material.createdTime) || <Skeleton width={100}/>}
                  </h6>
                </div>
                <div className="col-md-6 py-2">
                  <h6>
                    <span className="text-muted"><i className="fal fa-tags"></i> Type: </span>
                    {material.materialType ? material.materialType.name : <Skeleton width={100}/>}
                  </h6>
                </div>
                <div className="col-md-6 py-2">
                  <h6>
                    <span className="text-muted"><i className="fal fa-bullseye"></i> Construction: </span>
                    {material.construction ? material.construction.name : <Skeleton width={100}/>}
                  </h6>
                </div>
                <div className="col-md-6 py-2">
                  <h6>
                    <span className="text-muted"><i className="fal fa-money-bill"></i> Price: </span>
                    {material.price ? <span>{formatPrice(material.price)}<i className="text-muted">/{material.materialType.unit}</i></span> : <Skeleton width={75}/>}
                  </h6>
                </div>
                <div className="col-md-12 py-2">
                  <h6>
                    <span className="text-muted"><i className="fal fa-map-marker"></i> Address: </span>
                    {material.construction ? material.construction.address : <Skeleton width={250}/>}
                  </h6>
                </div>
              </div>
              <h5 className="my-3 text-muted"><u>Description:</u></h5>
              <div
                className="description mb-3"
                dangerouslySetInnerHTML={{ __html: material.description }}
              />
            </div>
            {!material.id && <Skeleton count={10} />}
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
)(withRouter(MaterialDetail));
