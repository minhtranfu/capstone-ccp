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
              {/* <div className="text-muted"><i className="fal fa-map-marker"></i> {product.address}</div> */}
              {product.availableTimeRanges[0] &&
                <div className="text-muted">
                  <i className="fal fa-calendar"></i> {moment(product.availableTimeRanges[0].beginDate).format('YYYY/MM/DD')} - {moment(product.availableTimeRanges[0].endDate).format('YYYY/MM/DD')}
                  {product.availableTimeRanges.length > 1 &&
                    <i> ({product.availableTimeRanges.length - 1} more)</i>
                  }
                </div>
              }
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
