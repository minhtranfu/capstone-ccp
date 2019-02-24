import React, { PureComponent } from 'react';

import ccpApiService from '../../../services/domain/ccp-api-service';

class MyConstructions extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {};
    }

    _loadData = async () => {
        // TODO: Remove hardcode constractor ID
        const constractorId = 12;
        const constructions = await ccpApiService.getConstructionsByContractorId(constractorId);
        this.setState({
            constructions
        });
    };

    componentDidMount() {
        this._loadData();
    }

    render() {
        const { constructions } = this.state;

        return (
            <div>
                <h4>My Constructions <button className="btn btn-success btn-sm float-right"><i class="fa fa-plus"></i> Add new</button></h4>
                {constructions && constructions.map(construction => {

                    return (
                        <div key={construction.id} className="bg-white shadow construction my-3 p-3 rounded">
                            <h4 className="m-0">
                                {construction.name}
                                <span className="float-right">
                                    <button className="btn btn-outline-success btn-sm"><i class="fa fa-pencil"></i></button>
                                    <button className="btn btn-outline-danger btn-sm ml-2"><i class="fa fa-trash"></i></button>
                                </span>
                                <span className="clearfix"></span>
                            </h4>
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default MyConstructions;