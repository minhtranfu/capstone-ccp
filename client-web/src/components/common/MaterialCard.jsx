import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Image from './Image';
import { formatPrice } from 'Utils/format.utils';
import { getRoutePath } from 'Utils/common.utils';
import { routeConsts } from 'Common/consts';

class MaterialCard extends PureComponent {
  render() {
    const { product, className } = this.props;
    const thumbnail = product.thumbnailImageUrl || '/public/upload/product-images/unnamed-19-jpg.jpg';
    return (
      <div className={`equip-card my-2 ${className}`}>
        <Link to={getRoutePath(routeConsts.MATERIAL_DETAIL, {id: product.id})}>
          <div className="card">
            <div className="image-169">
              <Image src={thumbnail} className="card-img-top" alt={product.name} />
            </div>
            <div className="card-body">
              <h6 className="card-title">{product.name} <span className="float-right">{formatPrice(product.price)}<small className="text-muted">/{product.materialType.unit}</small></span>
                <span className="clearfix"></span>
              </h6>
              {/* <div className="text-muted"><i className="fal fa-map-marker"></i> {product.address}</div> */}
              <div className="text-muted">
                <i className="fal fa-user-circle"></i> {product.manufacturer}
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
  className: PropTypes.string
};

export default MaterialCard;
