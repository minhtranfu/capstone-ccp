import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Image from './Image';
import { getRoutePath, calcDistance } from 'Utils/common.utils';
import { routeConsts } from 'Common/consts';
import { StarRatings } from '.';
import { formatPrice } from 'Utils/format.utils';

class EquipmentCard extends PureComponent {

  render() {
    const { product: productData, className, criteria } = this.props;
    const product = productData.equipmentEntity;
    const thumbnail = product.thumbnailImage ? product.thumbnailImage.url : '/public/upload/product-images/unnamed-19-jpg.jpg';
    const { construction } = product;

    return (
      <div className={`equip-card my-2 ${className}`}>
        <Link to={getRoutePath(routeConsts.EQUIPMENT_DETAIL, {id: product.id})}>
          <div className="card">
            <div className="thumbnail">
              <div className="image-169 lh-1">
                <Image src={thumbnail} height={210} className="card-img-top" alt="Equipment thumbnail image" />
              </div>
              <div className="d-flex align-items-center info lh-1">
                <Image circle src={product.contractor.thumbnailImageUrl} alt={`${product.contractor.name}'s avatar`} className="rounded-circle" width={40} height={40}/>
                <span className="ml-2">
                  <div>
                    {product.contractor.name}
                  </div>
                  <div>
                    <StarRatings
                      rating={product.contractor.averageEquipmentRating}
                      starDimension="15px"
                      />
                  </div>
                </span>

                <span className="ml-auto text-large price bg-primary">{formatPrice(product.dailyPrice)}</span>
              </div>
            </div>
            <div className="card-body">
              <h6 className="card-title">{product.name}</h6>
              <div className="text-muted">
                {criteria.lat &&
                  <span className="mr-2 pr-2 border-right">
                    <i className="fal fa-map"></i> {calcDistance(criteria.lat, criteria.long, construction.latitude, construction.longitude)} Km
                  </span>
                }
                <span>
                  <i className="fal fa-archive"></i> {product.equipmentType.name}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }
}

EquipmentCard.propTypes = {
  product: PropTypes.object.isRequired,
  className: PropTypes.string,
  criteria: PropTypes.object,
};

export default EquipmentCard;
