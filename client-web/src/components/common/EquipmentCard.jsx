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
            <div className={`equip-card my-1 ${className}`}>
                <Link to={`/equip-detail/${product.id}`}>
                    <div className="card">
                        <Image src={product.image || 'https://via.placeholder.com/728x458.png?text=CCP+Capstone'} className="card-img-top" alt="" />
                        <div className="card-body">
                            <h6 className="card-title">{product.name} <span className="float-right"><i className="fa fa-dollar"></i> {product.dailyPrice}</span></h6>
                            <div className="text-muted"><i className="fa fa-map-marker"></i> {product.address}</div>
                            {product.availableTimeRanges[0] &&
                                <div className="text-muted">
                                    <i className="fa fa-calendar-o"></i> {moment(product.availableTimeRanges[0].beginDate).format("YYYY/MM/DD")} - {moment(product.availableTimeRanges[0].endDate).format("YYYY/MM/DD")}
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
    className: PropTypes.string,
};

export default EquipmentCard;