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
                    <Image src="http://4.bp.blogspot.com/-Hzr2v5MOp6k/U9zAYcmArGI/AAAAAAAABOQ/AFFdqFT8AYo/s1600/xe_lu_rung_5.jpg" className="card-img-top" alt="" />
                    <div className="card-body">
                        <h6 className="card-title">{product.name}</h6>
                        <div className="text-muted"><i className="fa fa-map-marker"></i> Location</div>
                        <div className="text-muted"><i className="fa fa-calendar-o"></i> 10/01/2019 - 10/04/2019</div>
                        <Link to={`/equip-detail/${product.id}`} className="btn btn-outline-primary btn-sm">Chi tiết <i className="fa fa-chevron-right"></i></Link>
                    </div>
                </div>
            </div>
        );
    }
}

EquipmentCard.propTypes = {
    product: PropTypes.shape(Object),
    className: PropTypes.string,
};

export default EquipmentCard;