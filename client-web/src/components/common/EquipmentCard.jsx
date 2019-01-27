import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Image from './Image';

class EquipmentCard extends PureComponent {
    render() {
        const { product, className } = this.props;
        return (
            <div className={`my-1 ${className}`}>
                <div className="card">
                    <Image src={product.image} className="card-img-top" alt="" />
                    <div className="card-body">
                        <h6 className="card-title">{product.name}</h6>
                        <div className="text-muted"><i className="fa fa-map-marker"></i> {product.location}</div>
                        <div className="text-muted"><i className="fa fa-calendar-o"></i> {product.timeRange.start_at} - {product.timeRange.end_at}</div>
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