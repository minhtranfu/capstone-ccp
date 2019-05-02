import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Image from './Image';
import { formatPrice } from 'Utils/format.utils';
import { getRoutePath, calcDistance } from 'Utils/common.utils';
import { routeConsts } from 'Common/consts';
import { StarRatings } from 'Components/common';

class MaterialCard extends PureComponent {
  render() {
    const { product, className, criteria } = this.props;
    const { construction, thumbnailImageUrl } = product;
    const thumbnail = thumbnailImageUrl || '/public/upload/product-images/unnamed-19-jpg.jpg';
    return (
      <div className={`equip-card my-2 ${className}`}>
        <Link to={getRoutePath(routeConsts.MATERIAL_DETAIL, { id: product.id })}>
          <div className="card">
            <div className="thumbnail">
              <div className="image-169 lh-1">
                <Image src={thumbnail} height={210} className="card-img-top" alt={product.name} />
              </div>
              <div className="d-flex align-items-center info lh-1">
                <Image
                  circle
                  src={product.contractor.thumbnailImageUrl}
                  alt={`${product.contractor.name}'s avatar`}
                  className="rounded-circle"
                  width={40}
                  height={40}
                />
                <span className="ml-2">
                  <div>{product.contractor.name}</div>
                  <div>
                    <StarRatings
                      rating={product.contractor.averageMaterialRating}
                      starDimension="15px"
                    />
                  </div>
                </span>
                <span className="ml-auto text-large price bg-primary">
                  {formatPrice(product.price)}
                  <small>/{product.materialType.unit}</small>
                </span>
              </div>
            </div>
            <div className="card-body py-2 px-3">
              <h6 className="card-title mb-1">
                {product.name}
              </h6>
              <div className="text-muted">
                <i className="fal fa-calendar" /> {product.materialType.name}
              </div>
              <div className="text-muted d-flex justify-content-between">
                <span>
                  <i className="fal fa-user-circle" /> {product.manufacturer}
                </span>
                {criteria.lat && (
                  <span>
                    {calcDistance(
                      criteria.lat,
                      criteria.long,
                      construction.latitude,
                      construction.longitude
                    )}{' '}
                    Km
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }
}

MaterialCard.propTypes = {
  product: PropTypes.object.isRequired,
  className: PropTypes.string,
};

export default MaterialCard;
