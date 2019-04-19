import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Image from './Image';
import { getRoutePath } from 'Utils/common.utils';
import { routeConsts } from 'Common/consts';

class EquipmentCard extends PureComponent {
  render() {
    const { product: productData, className } = this.props;
    const product = productData.equipmentEntity;
    const thumbnail = product.thumbnailImage ? product.thumbnailImage.url : '/public/upload/product-images/unnamed-19-jpg.jpg';
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
                  {product.contractor.name}
                </span>

                <span className="ml-auto text-large price bg-primary">{product.dailyPrice}K</span>
              </div>
            </div>
            <div className="card-body">
              <h6 className="card-title">{product.name}</h6>
              <div className="text-muted"><i className="fal fa-archive"></i> {product.equipmentType.name}</div>
            </div>
          </div>
        </Link>
      </div>
    );
  }
}

EquipmentCard.propTypes = {
  product: PropTypes.object.isRequired,
  className: PropTypes.string
};

export default EquipmentCard;
