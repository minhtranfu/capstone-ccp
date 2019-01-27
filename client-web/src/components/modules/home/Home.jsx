import React, { PureComponent } from 'react';
import SearchBox from '../../common/SearchBox';
import EquipmentCard from '../../common/EquipmentCard';
import Helmet from 'react-helmet-async';

class Home extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            products: [],
        };
    }

    _loadData = async () => {
        await new Promise(rosolve => {
            setTimeout(rosolve(), 1000);
        });

        const product = {
            id: 1,
            image: 'http://4.bp.blogspot.com/-Hzr2v5MOp6k/U9zAYcmArGI/AAAAAAAABOQ/AFFdqFT8AYo/s1600/xe_lu_rung_5.jpg',
            name: 'Tên thiết bị',
            location: 'Bình Tân, HCM',
            timeRange: {
                start_at: '2019-01-01',
                end_at: '2019-02-01',
            }
        };
        const products = [];
        for (let i = 0; i < 12; i++) {
            products.push(product);
        }

        this.setState({
            products
        });
    };

    componentDidMount() {
        this._loadData();
    }

    render() {
        const { products } = this.state;

        return (
            <div>
                <Helmet>
                    <title>Trang chủ</title>
                </Helmet>
                <div className="section-search text-light">
                    <div className="container">
                        <SearchBox />
                    </div>
                </div>
                <div className="container">
                    <div className="row py-3">
                        <div className="col-md-12">
                            <h3>Kết quả phù hợp</h3>
                        </div>
                        {products && products.map(product => <EquipmentCard className="col-md-4" product={product}/>)}
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;