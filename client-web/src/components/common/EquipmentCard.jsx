import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Image from './Image';
import moment from 'moment';

class EquipmentCard extends PureComponent {
    render() {
        const { product: productData, className } = this.props;
        const product = productData.equipmentEntity;
        return (
            <div className={`my-1 ${className}`}>
                <div className="card">
                    <Image src={product.image || 'https://via.placeholder.com/728x458.png?text=CCP+Capstone'} className="card-img-top" alt="" />
                    <div className="card-body">
                        <h6 className="card-title">{product.name}</h6>
                        <div className="text-muted"><i className="fa fa-map-marker"></i> {product.address}</div>
                        {product.availableTimeRanges[0] &&
                            <div className="text-muted">
                                <i className="fa fa-calendar-o"></i> {moment(product.availableTimeRanges[0].beginDate).format("YYYY/MM/DD")} - {moment(product.availableTimeRanges[0].endDate).format("YYYY/MM/DD")}
                                {product.availableTimeRanges.length > 1 &&
                                    <i> ({product.availableTimeRanges.length - 1} more)</i>
                                }
                            </div>
                        }
                        <Link to={`/equip-detail/${product.id}`} className="btn btn-outline-primary btn-sm">Chi tiết <i className="fa fa-chevron-right"></i></Link>
                    </div>
                </div>
            </div>
        );
    }
}

EquipmentCard.propTypes = {
    product: PropTypes.object.isRequired,
    className: PropTypes.string,
};

export default EquipmentCard;