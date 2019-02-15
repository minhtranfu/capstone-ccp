import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import ccpApiService from '../../services/domain/ccp-api-service';

class SearchBox extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            equipmentTypes: []
        };

        this.criteria = {};
    }

    _loadData = async () => {
        const equipmentTypes = await ccpApiService.getEquipmentTypes();
        this.setState({
            equipmentTypes,
        });
    };

    componentDidMount() {
        this._loadData();
    }

    _search = () => {
        const { onSearch } = this.props;

        onSearch && onSearch(this.criteria);
    };

    _handleChangeCriteria = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        this.criteria[name] = value;
    };

    render() {
        const { equipmentTypes } = this.state;
        return (
            <div className="row">
                <div className="col-md-12">
                    <h3>Tìm thuê thiết bị</h3>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="equipment_type">Loại thiết bị:</label>
                        <select name="equipmentType" id="equipment_type" className="form-control" onChange={this._handleChangeCriteria}>
                            <option value="">--Chọn--</option>
                            {
                                equipmentTypes && equipmentTypes.map(equipmentType => <option value={equipmentType.id}>{equipmentType.name}</option>)
                            }
                        </select>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="time">Thời gian</label>
                        <div className="row">
                            <div className="col-md-6">
                                <input type="date" className="form-control" name="beginDate" id="begin_date" onChange={this._handleChangeCriteria}/>
                            </div>
                            <div className="col-md-6 mt-md-0 mt-2">
                                <input type="date" className="form-control" name="endDate" id="end_date" onChange={this._handleChangeCriteria}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-12">
                    <button className="btn btn-success" onClick={this._search}>Tìm</button>
                </div>
            </div>
        );
    }
}

SearchBox.propTypes = {
    onSearch: PropTypes.func.isRequired
};

export default SearchBox;