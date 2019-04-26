import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import Helmet from 'react-helmet-async';
import { connect } from 'react-redux';
import classnames from 'classnames';

import RequestCard from './RequestCard';

import ccpApiService from 'Services/domain/ccp-api-service';
import { authActions } from 'Redux/actions';
import Image from 'Components/common/Image';
import { formatPrice, formatDate } from 'Utils/format.utils';
import { StarRatings } from 'Components/common';
import { getRoutePath } from 'Utils/common.utils';
import { routeConsts } from 'Common/consts';

class EquipDetail extends Component {
  state = {
    equipment: {},
    availableTimeRanges: [],
    transaction: {},
    error: {},
    redirectToTransaction: false,
    address: '',
    isFetching: true,
  };

  // TODO: Change default images
  defaultImages = [
    '/public/upload/product-images/unnamed-19-jpg.jpg',
    '/public/upload/product-images/unnamed-24-jpg.jpg',
    '/public/upload/product-images/unnamed-20-jpg.jpg',
    '/public/upload/product-images/unnamed-25-jpg.jpg',
    '/public/upload/product-images/unnamed-21-jpg.jpg',
    '/public/upload/product-images/unnamed-22-jpg.jpg',
    '/public/upload/product-images/unnamed-23-jpg.jpg',
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
      equipment: data,
      isFetching: false,
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

  _renderCurrentTransaction = () => {
    const { equipment } = this.state;

    if (!equipment.activeHiringTransactions || equipment.activeHiringTransactions.length === 0) {
      return (
        <div className="shadow bg-white rounded p-2">
          <h5>Current transactions</h5>
          <div className="alert alert-info my-3">
            <i className="fal fa-info-circle" /> There is no transaction!
          </div>
        </div>
      );
    }

    return (
      <div className="shadow bg-white rounded p-2">
        <h5>Current transactions</h5>
        {equipment.activeHiringTransactions.map((transaction, index) => {
          return (
            <div key={transaction.id} className={classnames('py-2 border-bottom', { 'border-top': index === 0 })}>
              <Link
                to={getRoutePath(routeConsts.EQUIPMENT_TRANSACTION_DETAIL, {
                  id: transaction.id,
                })}
              >
                <h6>#{transaction.id} - {formatPrice()}</h6>
              </Link>
              <div className="my-">
                <i className="fal fa-calendar" /> {formatDate(transaction.beginDate)} -{' '}
                {formatDate(transaction.endDate)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  _renderRightSidebar = () => {
    const { equipment, isFetching } = this.state;
    const { authentication } = this.props;
    const { contractor } = authentication;

    return (
      <div className="sticky-top sticky-sidebar mb-2">
        <div className="constructor-card text-center">
          {equipment.contractor && equipment.contractor.thumbnailImageUrl ? (
            <Image
              circle
              src={equipment.contractor.thumbnailImageUrl}
              width={125}
              height={125}
              className="rounded-circle"
              alt="Avatar"
            />
          ) : (
            <Skeleton circle width={125} height={125} />
          )}
          <h5 className="mb-0">
            {!isFetching ? (
              <Link
                to={getRoutePath(routeConsts.PROFILE_CONTRACTOR, {
                  id: equipment.contractor.id,
                })}
              >
                {equipment.contractor.name}
              </Link>
            ) : (
              <Skeleton />
            )}
          </h5>
          {isFetching ? (
            <Skeleton />
          ) : (
            <StarRatings rating={equipment.contractor.averageEquipmentRating} />
          )}
          {isFetching ? (
            <Skeleton />
          ) : (
            <div>
              <span className="badge badge-pill badge-warning mr-1">
                {equipment.contractor.averageEquipmentRating.toFixed(1)}
              </span>
              {equipment.contractor.equipmentFeedbacksCount} reviews
            </div>
          )}
          <p className="mt-0 text-muted">
            Joined:{' '}
            {!isFetching ? (
              formatDate(equipment.contractor.createdTime)
            ) : (
              <span className="d-inline">
                <Skeleton width={100} />
              </span>
            )}
          </p>
        </div>
        {!isFetching &&
          (!authentication.isAuthenticated || equipment.contractor.id !== contractor.id) && (
            <RequestCard equip={equipment} />
          )}
        {!isFetching &&
          authentication.isAuthenticated &&
          equipment.contractor.id == contractor.id &&
          this._renderCurrentTransaction()}
      </div>
    );
  };

  render() {
    const { equipment } = this.state;

    return (
      <div className="container">
        {/* Change current title */}
        <Helmet>
          <title>Equipment detail: {equipment.name || ''}</title>
        </Helmet>

        <div className="row py-4">
          {/* Main content */}
          <div className="col-md-9">
            {(equipment.equipmentImages && (
              <OwlCarousel
                loop
                autoPlay={true}
                autoplayTimeout={2000}
                items={1}
                className="owl-theme product-images"
                margin={10}
                ref={mainOwl => (this.mainOwl = mainOwl)}
              >
                {equipment.equipmentImages.map((image, index) => (
                  <div key={index} className="item image-169">
                    <img src={image.url} alt={equipment.name} />
                  </div>
                ))}
              </OwlCarousel>
            )) || (
              <div className="image-169">
                <Skeleton height={480} />
              </div>
            )}
            {(equipment.equipmentImages && (
              <OwlCarousel
                items={5}
                className="owl-theme product-images-nav my-2"
                margin={10}
                rewind={false}
                dots={false}
                nav={true}
              >
                {equipment.equipmentImages.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => this._showImage(index)}
                    className="item image-169"
                  >
                    <img src={image.url} alt={equipment.name} />
                  </div>
                ))}
              </OwlCarousel>
            )) || <Skeleton height={88} />}
            <div className="my-2 py-2 px-3 shadow-sm bg-white">
              <h1 className="">{equipment.name || <Skeleton />}</h1>
              <div className="row">
                <div className="col-md-6 py-2">
                  {equipment.equipmentType ? (
                    <h6>
                      <span className="text-muted">
                        <i className="fal fa-tags" /> Type:
                      </span>{' '}
                      {equipment.equipmentType && equipment.equipmentType.name}
                    </h6>
                  ) : (
                    <Skeleton width={200} />
                  )}
                </div>
                <div className="col-md-6 py-2">
                  {equipment.dailyPrice ? (
                    <h6>
                      <span className="text-muted">
                        <i className="fal fa-money-bill" />
                      </span>{' '}
                      Daily price: {formatPrice(equipment.dailyPrice)}
                    </h6>
                  ) : (
                    <Skeleton width={200} />
                  )}
                </div>
                <div className="col-md-12 py-2">
                  {equipment.construction ? (
                    <h6>
                      <span className="text-muted">
                        <i className="fal fa-map-marker" /> Address:
                      </span>{' '}
                      {equipment.construction.address}
                    </h6>
                  ) : (
                    <Skeleton width={400} />
                  )}
                </div>
              </div>
              
              <h5 className="mt-3">Additional information:</h5>
              <div className="my-2 row">
                {equipment.additionalSpecsValues && equipment.additionalSpecsValues.map(info => {
                  return (
                    <div key={info.id} className="col-md-6 py-2">
                      <h6>
                        <span className="text-muted">
                          <small className="fal fa-circle"></small> {info.additionalSpecsField.name}
                        </span>{' '}
                        {info.value}
                      </h6>
                    </div>
                  );
                })}
              </div>

              <h5 className="mt-3">Description:</h5>
              <div className="description">
                {equipment.description}
                {!equipment.id && <Skeleton count={5} />}
              </div>
            </div>
          </div>
          {/* Right Sidebar */}
          <div className="col-md-3">{this._renderRightSidebar()}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { authentication } = state;

  return {
    authentication,
  };
};

const mapDispatchToProps = {
  toggleLoginModal: authActions.toggleLoginModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(EquipDetail));
