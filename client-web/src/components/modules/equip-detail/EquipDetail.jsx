import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

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
        const { id } = params;

        this.setState({
            equip: {
                id,
                name: 'Title will be here!',
            },
        });
    };

    componentDidMount() {
        this._loadData();
    }

    render() {
        const { equip } = this.state;
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <strong>{equip.id || <Skeleton width={25}/>}</strong>
                        <h1>{equip.name || <Skeleton />}</h1>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(EquipDetail);