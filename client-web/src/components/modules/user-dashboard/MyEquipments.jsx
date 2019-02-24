import React, { PureComponent } from 'react';

import ccpApiService from '../../../services/domain/ccp-api-service';

class MyEquipments extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            filterStatus: 'all',
        };
    }

    _loadData = async () => {
        const REQUESTER_ID = 12;
        const equipments = await ccpApiService.getEquipmentsByContractorId(REQUESTER_ID);
        this.setState({
            equipments
        });
    };

    componentDidMount() {
        this._loadData();
    }

    render() {
        const { equipments } = this.state;

        return (
            <div>
                <h4>My equipments</h4>
                {equipments && equipments.map(equipment => {

                    return (
                            <div className="d-flex transaction my-3 rounded">
                                <div className="image flex-fill">
                                    <img src={equipment.thumbnailImage || "/upload/product-images/unnamed-19-jpg.jpg"} className="rounded-left" />
                                </div>
                                <div className="detail flex-fill p-2">
                                    <h6>{equipment.name}</h6>
                                </div>
                            </div>
                    );
                })}
            </div>
        );
    }
}

export default MyEquipments;