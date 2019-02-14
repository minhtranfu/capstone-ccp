import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

import ccpApiService from '../../../services/domain/ccp-api-service';

class EquipDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            equip: {},
        };
    }

    _loadData = async () => {
        await new Promise(resolve => {
            setTimeout(() => resolve(1), 1000);
        });

        const { params } = this.props.match;
        // const { id } = params;
        // TODO: get dynamic id from URL path
        const id = 34

        const data = await ccpApiService.getEquipmentById(id);
        data.images = [
            "/upload/product-images/unnamed-19-jpg.jpg",
            "/upload/product-images/unnamed-24-jpg.jpg",
            "/upload/product-images/unnamed-20-jpg.jpg",
            "/upload/product-images/unnamed-25-jpg.jpg",
            "/upload/product-images/unnamed-21-jpg.jpg",
            "/upload/product-images/unnamed-22-jpg.jpg",
            "/upload/product-images/unnamed-23-jpg.jpg",
        ];

        this.setState({
            equip: data
        });
    };

    componentDidMount() {
        this._loadData();
    }

    render() {
        const { equip } = this.state;
        console.log(equip.images);
        return (
            <div className="container">
                <div className="row py-4">
                    <div className="col-md-9">
                        {equip.images && (
                            <OwlCarousel
                                items={1}
                                className="owl-theme product-images"
                                loop
                                margin={10}
                            >
                                {equip.images.map((src, index) => <div key={index} className="item"><img src={src} alt={equip.name} /></div>)}
                            </OwlCarousel>
                        ) || <Skeleton height={410} />}
                        <h1 className="product-title">{equip.name || <Skeleton />}</h1>
                        <div className="row">
                            <div className="col-md-4">Construction: {equip.construction && equip.construction.name}</div>
                            <div className="col-md-4">Daily price: {equip.dailyPrice}</div>
                            <div className="col-md-4">Delivery price: {equip.deliveryPrice}</div>
                            <div className="col-md-12">Address: {equip.address}</div>
                        </div>
                        <h5>Description:</h5>
                        <div className="description">
                            {equip.description}
                        </div>
                    </div>
                    <div className="col-md-3 constructor-card">
                        <img className="rounded-circle w-50 d-block mx-auto" src={equip.contractor && equip.contractor.thumbnailImage ? equip.contractor.thumbnailImage : 'https://www.shareicon.net/download/2016/04/10/747369_man.svg'} alt=""/>
                        <h5 className="text-center">{equip.contractor ? equip.contractor.name : <Skeleton />}</h5>
                        <p className="m-0">
                            Join at: {equip.contractor ?
                            new Date(equip.contractor.createdTime).toDateString()
                            : <span className="d-inline"><Skeleton width={100} /></span>
                            }
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(EquipDetail);