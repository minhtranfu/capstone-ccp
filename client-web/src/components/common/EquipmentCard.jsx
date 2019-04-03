import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Image from './Image';
import moment from 'moment';
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
            <div className="image-169 lh-1">
              <Image src={thumbnail} className="card-img-top" alt="" />
            </div>
            <div className="card-body">
              <h6 className="card-title">{product.name} <span className="float-right">{product.dailyPrice}K</span>
                <span className="clearfix"></span>
              </h6>
              <div className="text-muted"><i className="fal fa-archive"></i> {product.equipmentType.name}</div>
              <div className="text-muted d-flex align-items-center">
                <img src={product.contractor.thumbnailImageUrl} alt={`${product.contractor.name}'s avatar`} className="rounded-cirle mr-2" width="50" height="50"/>
                {product.contractor.name}
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
  className: PropTypes.string
};

export default EquipmentCard;
