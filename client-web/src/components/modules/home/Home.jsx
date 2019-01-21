import React, { PureComponent } from 'react';
import SearchBox from '../../common/SearchBox';
import EquipmentCard from '../../common/EquipmentCard';
import Helmet from 'react-helmet-async';

class Home extends PureComponent {
    render() {
        const product = {
            id: 1,
            name: 'asda asddas asdsad asdsd',
        };

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
                        <EquipmentCard className="col-md-4" product={product}/>
                        <EquipmentCard className="col-md-4" product={product}/>
                        <EquipmentCard className="col-md-4" product={product}/>
                        <EquipmentCard className="col-md-4" product={product}/>
                        <EquipmentCard className="col-md-4" product={product}/>
                        <EquipmentCard className="col-md-4" product={product}/>
                        <EquipmentCard className="col-md-4" product={product}/>
                        <EquipmentCard className="col-md-4" product={product}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;